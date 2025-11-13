/**
 * useMapView Hook
 *
 * React hook for managing ArcGIS MapView lifecycle
 */

import { useEffect, useRef, useCallback } from 'react';
import { useMapStore } from '../store/map-store';
import { mapService } from '../services/map-service';
import type { MapViewOptions } from '../types';
import { ERROR_MESSAGES } from '@/config/constants';

export const useMapView = (options?: MapViewOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialViewRef = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const { mapView, setMapView, setLoading, setError } = useMapStore();

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!containerRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const view = await mapService.initialize(containerRef.current, options);

        if (mounted) {
          setMapView(view);

          // Save initial view state
          await view.when(() => {
            if (view.center) {
              initialViewRef.current = {
                center: [view.center.longitude ?? 0, view.center.latitude ?? 0],
                zoom: view.zoom,
              };
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
        if (mounted) {
          setError(ERROR_MESSAGES.MAP.LOAD_FAILED);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      mounted = false;
      mapService.destroy();
      setMapView(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.useWebMap, options?.basemap]); // Only re-initialize if these change

  // Zoom in function
  const zoomIn = useCallback(() => {
    if (!mapView) return;
    const newZoom = mapView.zoom + 1;
    mapView.goTo({ zoom: newZoom }, { duration: 500 });
  }, [mapView]);

  // Zoom out function
  const zoomOut = useCallback(() => {
    if (!mapView) return;
    const newZoom = mapView.zoom - 1;
    mapView.goTo({ zoom: newZoom }, { duration: 500 });
  }, [mapView]);

  // Reset to initial view
  const resetView = useCallback(() => {
    if (!mapView || !initialViewRef.current) return;
    mapView.goTo(
      {
        center: initialViewRef.current.center,
        zoom: initialViewRef.current.zoom,
      },
      { duration: 1000 }
    );
  }, [mapView]);

  // Navigate to a specific location
  const navigateToLocation = useCallback(
    async (
      longitude: number,
      latitude: number,
      zoomLevel: number = 15,
      addMarker: boolean = true
    ) => {
      if (!mapView) return;

      // Add a marker if requested
      if (addMarker) {
        mapService.clearGraphics(); // Clear previous markers
        await mapService.addLocationMarker(longitude, latitude, 'Ubicación seleccionada');
      }

      // Navigate to the location
      await mapView.goTo(
        {
          center: [longitude, latitude],
          zoom: zoomLevel,
        },
        { duration: 1500, easing: 'ease-in-out' }
      );
    },
    [mapView]
  );

  return {
    containerRef,
    mapView,
    isLoading: useMapStore((state) => state.isLoading),
    error: useMapStore((state) => state.error),
    zoomIn,
    zoomOut,
    resetView,
    navigateToLocation,
  };
};
