/**
 * useMapClick Hook
 *
 * React hook for handling map click events
 */

import { useEffect } from 'react';
import { useMapStore } from '../store/map-store';
import { mapService } from '../services/map-service';

export const useMapClick = (onFeatureClick?: (features: __esri.Graphic[]) => void) => {
  const mapView = useMapStore((state) => state.mapView);

  useEffect(() => {
    if (!mapView) return;

    const handleClick = async (event: __esri.ViewClickEvent) => {
      try {
        const features = await mapService.queryFeaturesAtPoint(event);

        if (features.length > 0 && onFeatureClick) {
          onFeatureClick(features);
        }
      } catch (error) {
        console.error('Error handling map click:', error);
      }
    };

    const handle = mapService.on('click', handleClick);

    return () => {
      if (handle) {
        handle.remove();
      }
    };
  }, [mapView, onFeatureClick]);
};
