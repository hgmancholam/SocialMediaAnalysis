/**
 * Network Graph Store
 *
 * State management for network graph visualization
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Node {
  id: string;
  label: string;
  type: string;
  degree: number;
  community?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  [key: string]: unknown;
}

export interface Edge {
  source: string | Node;
  target: string | Node;
  weight?: number;
  [key: string]: unknown;
}

export interface NetworkFilters {
  nodeTypes: string[];
  degreeRange: [number, number];
  communities: number[];
  searchTerm: string;
}

export type LayoutType = 'force' | 'circular' | 'hierarchical';

interface NetworkState {
  // Graph data
  nodes: Node[];
  edges: Edge[];

  // Selection
  selectedNode: Node | null;
  hoveredNode: Node | null;

  // Filters
  filters: NetworkFilters;

  // Layout
  layoutType: LayoutType;

  // View state
  zoomLevel: number;
  isPaused: boolean;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (node: Node | null) => void;
  setHoveredNode: (node: Node | null) => void;
  updateFilters: (filters: Partial<NetworkFilters>) => void;
  setLayoutType: (layoutType: LayoutType) => void;
  setZoomLevel: (level: number) => void;
  togglePause: () => void;
  resetFilters: () => void;
  clearSelection: () => void;
}

const defaultFilters: NetworkFilters = {
  nodeTypes: [],
  degreeRange: [0, Infinity],
  communities: [],
  searchTerm: '',
};

export const useNetworkStore = create<NetworkState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        nodes: [],
        edges: [],
        selectedNode: null,
        hoveredNode: null,
        filters: defaultFilters,
        layoutType: 'force',
        zoomLevel: 1,
        isPaused: false,

        // Actions
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),
        setSelectedNode: (node) => set({ selectedNode: node }),
        setHoveredNode: (node) => set({ hoveredNode: node }),

        updateFilters: (newFilters) =>
          set((state) => ({
            filters: {
              ...state.filters,
              ...newFilters,
              // Ensure searchTerm is always a string
              searchTerm: newFilters.searchTerm ?? state.filters.searchTerm ?? '',
            },
          })),

        setLayoutType: (layoutType) => set({ layoutType }),
        setZoomLevel: (level) => set({ zoomLevel: level }),
        togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

        resetFilters: () => set({ filters: defaultFilters }),
        clearSelection: () => set({ selectedNode: null, hoveredNode: null }),
      }),
      {
        name: 'network-storage',
        version: 1, // Increment this to force storage reset
        partialize: (state) => ({
          layoutType: state.layoutType,
          filters: state.filters,
        }),
        // Merge function to handle potentially corrupted persisted state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        merge: (persistedState: any, currentState) => {
          // Ensure filters exist and have proper structure
          const filters = persistedState?.filters || {};

          return {
            ...currentState,
            ...persistedState,
            filters: {
              nodeTypes: Array.isArray(filters.nodeTypes) ? filters.nodeTypes : [],
              degreeRange: Array.isArray(filters.degreeRange) ? filters.degreeRange : [0, Infinity],
              communities: Array.isArray(filters.communities) ? filters.communities : [],
              // Ensure searchTerm is always a string, never null or undefined
              searchTerm: typeof filters.searchTerm === 'string' ? filters.searchTerm : '',
            },
          };
        },
      }
    ),
    { name: 'NetworkStore' }
  )
);
