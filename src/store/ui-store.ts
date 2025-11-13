/**
 * UI State Store
 *
 * Global UI state management using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state
  isSidebarCollapsed: boolean;
  sidebarWidth: number;

  // Panel states
  graphPanelOpen: boolean;
  layerPanelOpen: boolean;

  // Modal states
  activeModal: string | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Theme
  theme: 'light' | 'dark';

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;

  toggleGraphPanel: () => void;
  setGraphPanelOpen: (open: boolean) => void;

  toggleLayerPanel: () => void;
  setLayerPanelOpen: (open: boolean) => void;

  openModal: (modalId: string) => void;
  closeModal: () => void;

  setLoading: (loading: boolean, message?: string) => void;

  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isSidebarCollapsed: false,
        sidebarWidth: 240,
        graphPanelOpen: true,
        layerPanelOpen: false,
        activeModal: null,
        isLoading: false,
        loadingMessage: '',
        theme: 'dark',

        // Actions
        toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
        setSidebarWidth: (width) => set({ sidebarWidth: width }),

        toggleGraphPanel: () => set((state) => ({ graphPanelOpen: !state.graphPanelOpen })),
        setGraphPanelOpen: (open) => set({ graphPanelOpen: open }),

        toggleLayerPanel: () => set((state) => ({ layerPanelOpen: !state.layerPanelOpen })),
        setLayerPanelOpen: (open) => set({ layerPanelOpen: open }),

        openModal: (modalId) => set({ activeModal: modalId }),
        closeModal: () => set({ activeModal: null }),

        setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),

        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          isSidebarCollapsed: state.isSidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          theme: state.theme,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
