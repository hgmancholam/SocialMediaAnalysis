/**
 * Environment Variables Type Definitions
 *
 * Extends Next.js ProcessEnv with custom environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // ArcGIS Configuration
    NEXT_PUBLIC_ARCGIS_PORTAL_URL: string;
    NEXT_PUBLIC_ARCGIS_ITEM_ID: string;
    NEXT_PUBLIC_ARCGIS_CLIENT_ID: string;
    NEXT_PUBLIC_ARCGIS_API_KEY: string;

    // Application Configuration
    NEXT_PUBLIC_BASE_PATH: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_APP_URL: string;

    // Map Configuration
    NEXT_PUBLIC_MAP_CENTER_LON: string;
    NEXT_PUBLIC_MAP_CENTER_LAT: string;
    NEXT_PUBLIC_MAP_ZOOM: string;
    NEXT_PUBLIC_MAP_BASEMAP: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    NEXT_PUBLIC_ENABLE_DEBUG: string;

    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
