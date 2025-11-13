/**
 * MapContainer Component
 *
 * Main container for ArcGIS MapView
 */

'use client';

import { FC, useEffect } from 'react';
import { useMapView } from '@/features/map';
import { cn } from '@/lib/utils/cn';

interface MapContainerProps {
  className?: string;
  useWebMap?: boolean;
  onMapReady?: (
    view: __esri.MapView,
    controls: {
      zoomIn: () => void;
      zoomOut: () => void;
      resetView: () => void;
      navigateToLocation: (
        longitude: number,
        latitude: number,
        zoomLevel?: number,
        addMarker?: boolean
      ) => Promise<void>;
    }
  ) => void;
}

export const MapContainer: FC<MapContainerProps> = ({
  className,
  useWebMap = false,
  onMapReady,
}) => {
  const {
    containerRef,
    mapView,
    isLoading,
    error,
    zoomIn,
    zoomOut,
    resetView,
    navigateToLocation,
  } = useMapView({
    useWebMap,
  });

  // Call onMapReady when map is initialized
  useEffect(() => {
    if (mapView && onMapReady) {
      onMapReady(mapView, { zoomIn, zoomOut, resetView, navigateToLocation });
    }
  }, [mapView, onMapReady, zoomIn, zoomOut, resetView, navigateToLocation]);

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Map Container */}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Error al cargar el mapa</h3>
                <p className="mt-1 text-sm text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
