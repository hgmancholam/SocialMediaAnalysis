/**
 * Environment Configuration
 *
 * Centralized access to environment variables with type safety and validation
 */

import { ARCGIS_CONFIG } from './constants';

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value || defaultValue || '';
};

const getEnvVarNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvVarBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const env = {
  // ArcGIS Configuration
  arcgis: {
    portalUrl: getEnvVar('NEXT_PUBLIC_ARCGIS_PORTAL_URL', ARCGIS_CONFIG.PORTAL),
    itemId: getEnvVar('NEXT_PUBLIC_ARCGIS_ITEM_ID', ARCGIS_CONFIG.ITEM_ID),
    clientId: getEnvVar('NEXT_PUBLIC_ARCGIS_CLIENT_ID', ARCGIS_CONFIG.ARCGIS_APP_ID),
    apiKey: getEnvVar('NEXT_PUBLIC_ARCGIS_API_KEY', ARCGIS_CONFIG.ARCGIS_CLIENT_SECRET),
  },

  // Application Configuration
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Net Frontend'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '0.1.0'),
    basePath: getEnvVar('NEXT_PUBLIC_BASE_PATH', ''),
  },

  // Map Configuration
  map: {
    centerLon: getEnvVarNumber('NEXT_PUBLIC_MAP_CENTER_LON', -74.0721),
    centerLat: getEnvVarNumber('NEXT_PUBLIC_MAP_CENTER_LAT', 4.711),
    zoom: getEnvVarNumber('NEXT_PUBLIC_MAP_ZOOM', 10),
    basemap: getEnvVar('NEXT_PUBLIC_MAP_BASEMAP', 'streets-vector'),
  },

  // Feature Flags
  features: {
    enableAnalytics: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    enableDebug: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_DEBUG', false),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

export type Env = typeof env;

// Validation function to check required variables
export const validateEnv = (): void => {
  const errors: string[] = [];

  // Add validation for required variables
  // Uncomment when you have actual values
  // if (!env.arcgis.portalUrl) {
  //   errors.push('NEXT_PUBLIC_ARCGIS_PORTAL_URL is required');
  // }

  if (errors.length > 0) {
    console.error('Environment validation errors:', errors);
    if (env.isProduction) {
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }
  }
};
