/**
 * Site Configuration
 *
 * Centralized configuration for site metadata and settings
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Net DNI',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  description:
    'ArcGIS-based application for social media visualization of Bogotá-Villavicencio highway',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Application metadata
  metadata: {
    title: 'Net Frontend - Social Media GIS Visualization',
    description: 'Visualización de datos de redes sociales para la vía Bogotá-Villavicencio',
    keywords: ['ArcGIS', 'GIS', 'Social Media', 'Visualization', 'Bogotá', 'Villavicencio'],
    author: 'Your Organization',
    locale: 'es-CO',
  },

  // Links
  links: {
    portal: process.env.NEXT_PUBLIC_ARCGIS_PORTAL_URL || '',
  },
} as const;

export type SiteConfig = typeof siteConfig;
