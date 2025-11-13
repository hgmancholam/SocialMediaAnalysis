/**
 * Map Store
 *
 * Global state management for map feature using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MapState, MapActions } from '../types';

type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>()(
  devtools(
    (set) => ({
      // Initial state
      mapView: null,
      isLoading: false,
      error: null,
      selectedFeatures: [],
      highlightedFeatures: [],
      activeLayerId: null,

      // Actions
      setMapView: (view) => set({ mapView: view }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setSelectedFeatures: (features) => set({ selectedFeatures: features }),

      addSelectedFeature: (feature) =>
        set((state) => ({
          selectedFeatures: [...state.selectedFeatures, feature],
        })),

      removeSelectedFeature: (featureId) =>
        set((state) => ({
          selectedFeatures: state.selectedFeatures.filter(
            (f) => f.attributes?.OBJECTID !== featureId
          ),
        })),

      clearSelection: () => set({ selectedFeatures: [] }),

      setHighlightedFeatures: (features) => set({ highlightedFeatures: features }),

      clearHighlights: () => set({ highlightedFeatures: [] }),

      setActiveLayer: (layerId) => set({ activeLayerId: layerId }),
    }),
    { name: 'MapStore' }
  )
);
