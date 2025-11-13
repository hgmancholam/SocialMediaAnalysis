/**
 * Panel State Store
 *
 * Manages state for resizable and collapsible panels
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type TabType = 'resumen' | 'detalles' | 'relaciones';

interface PanelState {
  // Analytics Side Panel
  isAnalyticsPanelOpen: boolean;
  analyticsPanelWidth: number;
  activeTab: TabType;

  // Node Details Panel (for graph view)
  isNodeDetailsPanelOpen: boolean;
  nodeDetailsPanelWidth: number;

  // Actions
  toggleAnalyticsPanel: () => void;
  setAnalyticsPanelOpen: (open: boolean) => void;
  setAnalyticsPanelWidth: (width: number) => void;
  setActiveTab: (tab: TabType) => void;

  toggleNodeDetailsPanel: () => void;
  setNodeDetailsPanelOpen: (open: boolean) => void;
  setNodeDetailsPanelWidth: (width: number) => void;
}

export const usePanelStore = create<PanelState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isAnalyticsPanelOpen: false,
        analyticsPanelWidth: 420,
        activeTab: 'resumen',

        isNodeDetailsPanelOpen: false,
        nodeDetailsPanelWidth: 380,

        // Actions
        toggleAnalyticsPanel: () =>
          set((state) => ({ isAnalyticsPanelOpen: !state.isAnalyticsPanelOpen })),
        setAnalyticsPanelOpen: (open) => set({ isAnalyticsPanelOpen: open }),
        setAnalyticsPanelWidth: (width) => set({ analyticsPanelWidth: width }),
        setActiveTab: (tab) => set({ activeTab: tab }),

        toggleNodeDetailsPanel: () =>
          set((state) => ({ isNodeDetailsPanelOpen: !state.isNodeDetailsPanelOpen })),
        setNodeDetailsPanelOpen: (open) => set({ isNodeDetailsPanelOpen: open }),
        setNodeDetailsPanelWidth: (width) => set({ nodeDetailsPanelWidth: width }),
      }),
      {
        name: 'panel-storage',
        partialize: (state) => ({
          analyticsPanelWidth: state.analyticsPanelWidth,
          activeTab: state.activeTab,
          nodeDetailsPanelWidth: state.nodeDetailsPanelWidth,
        }),
      }
    ),
    { name: 'PanelStore' }
  )
);
