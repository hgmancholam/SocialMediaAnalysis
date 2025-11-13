/**
 * ArcGIS Configuration
 *
 * Centralized configuration for ArcGIS Maps SDK integration
 */

import { env } from '@/config/env';
import { MAP_CONSTANTS } from '@/config/constants';

export const arcgisConfig = {
  // Portal Configuration
  portal: {
    url: env.arcgis.portalUrl,
    itemId: env.arcgis.itemId,
    clientId: env.arcgis.clientId,
    apiKey: env.arcgis.apiKey,
  },

  // Map Configuration
  map: {
    basemap: env.map.basemap,
    center: [env.map.centerLon, env.map.centerLat] as [number, number],
    zoom: env.map.zoom,
    minZoom: MAP_CONSTANTS.MIN_ZOOM,
    maxZoom: MAP_CONSTANTS.MAX_ZOOM,
  },

  // Layer Configuration
  layers: {
    // Add your layer configurations here
    // Example:
    // highways: {
    //   url: 'https://services.arcgis.com/...',
    //   visible: true,
    // },
  },

  // Widget Configuration
  widgets: {
    zoom: {
      position: 'top-left' as const,
    },
    home: {
      position: 'top-left' as const,
    },
    locate: {
      position: 'top-left' as const,
    },
    search: {
      position: 'top-right' as const,
    },
    legend: {
      position: 'bottom-right' as const,
    },
  },

  // Performance Configuration
  performance: {
    // Limit features displayed
    maxFeatures: 1000,
    // Enable clustering for large datasets
    enableClustering: true,
    // Debounce map events (ms)
    eventDebounce: 300,
  },
} as const;

export type ArcGISConfig = typeof arcgisConfig;
