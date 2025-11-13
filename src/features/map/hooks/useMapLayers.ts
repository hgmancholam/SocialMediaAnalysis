/**
 * useMapLayers Hook
 *
 * Hook for managing map layers with automatic updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useMapStore } from '../store/map-store';
import { mapService } from '../services/map-service';
import type { MapLayer } from '../components/MapControls';

export const useMapLayers = () => {
  const { mapView } = useMapStore();
  const [layers, setLayers] = useState<MapLayer[]>([]);

  // Update layers list
  const updateLayers = useCallback(() => {
    if (!mapView) {
      setLayers([]);
      return;
    }

    const allLayers = mapService.getAllLayers();
    const mappedLayers: MapLayer[] = allLayers
      .filter((layer) => layer.id && layer.title) // Filter out layers without ID or title
      .map((layer) => ({
        id: layer.id,
        title: layer.title || 'Sin título',
        visible: layer.visible,
        isBaseLayer: mapService.isWebMapLayer(layer.id),
      }));

    setLayers(mappedLayers);
  }, [mapView]);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const newVisibility = mapService.toggleLayerVisibility(layerId);
    // Update the local state
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: newVisibility } : layer
      )
    );
  }, []);

  // Delete layer
  const deleteLayer = useCallback((layerId: string) => {
    const success = mapService.removeLayer(layerId);
    if (success) {
      setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== layerId));
    } else {
      console.error('Failed to remove layer:', layerId);
    }
  }, []);

  // Watch for layer changes when mapView is available
  useEffect(() => {
    if (!mapView) {
      setLayers([]);
      return;
    }

    // Initial update
    updateLayers();

    // Watch for changes in the layers collection
    const watchHandle = mapService.watchLayers(() => {
      updateLayers();
    });

    // Watch for visibility changes on individual layers
    const visibilityWatchers: __esri.WatchHandle[] = [];
    const allLayers = mapService.getAllLayers();

    allLayers.forEach((layer) => {
      if (layer.id) {
        const handle = layer.watch('visible', () => {
          updateLayers();
        });
        if (handle) {
          visibilityWatchers.push(handle);
        }
      }
    });

    // Cleanup
    return () => {
      if (watchHandle) {
        watchHandle.remove();
      }
      visibilityWatchers.forEach((handle) => {
        if (handle) {
          handle.remove();
        }
      });
    };
  }, [mapView, updateLayers]);

  return {
    layers,
    toggleLayerVisibility,
    deleteLayer,
    refreshLayers: updateLayers,
  };
};
