/**
 * TanStack Query Configuration
 *
 * Centralized configuration for React Query (TanStack Query)
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh
    staleTime: 1000 * 60 * 5, // 5 minutes

    // GC time: how long unused data stays in cache
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && 'status' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },

    // Refetch configuration
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },

  mutations: {
    // Retry mutations once
    retry: 1,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys factory for type-safe query keys
export const queryKeys = {
  // Social media data
  socialMedia: {
    all: ['social-media'] as const,
    list: () => [...queryKeys.socialMedia.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.socialMedia.all, 'detail', id] as const,
    filtered: (filters: Record<string, unknown>) =>
      [...queryKeys.socialMedia.all, 'filtered', filters] as const,
  },

  // Map data
  map: {
    all: ['map'] as const,
    layers: () => [...queryKeys.map.all, 'layers'] as const,
    features: (layerId: string) => [...queryKeys.map.all, 'features', layerId] as const,
  },

  // User data
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
} as const;

// Type helper for query keys
export type QueryKeys = typeof queryKeys;
