/**
 * Map Feature Types
 */

import type { MapView, Graphic, Layer } from '@/lib/arcgis/types';

export interface MapState {
  mapView: MapView | null;
  isLoading: boolean;
  error: string | null;
  selectedFeatures: Graphic[];
  highlightedFeatures: Graphic[];
  activeLayerId: string | null;
}

export interface MapActions {
  setMapView: (view: MapView | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedFeatures: (features: Graphic[]) => void;
  addSelectedFeature: (feature: Graphic) => void;
  removeSelectedFeature: (featureId: string) => void;
  clearSelection: () => void;
  setHighlightedFeatures: (features: Graphic[]) => void;
  clearHighlights: () => void;
  setActiveLayer: (layerId: string | null) => void;
}

export interface MapViewOptions {
  useWebMap?: boolean;
  center?: [number, number];
  zoom?: number;
  basemap?: string;
}

export interface LayerInfo {
  id: string;
  title: string;
  visible: boolean;
  opacity: number;
  layer: Layer;
}
