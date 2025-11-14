/**
 * Application Constants
 *
 * Centralized constants used throughout the application
 */

// Map Constants
export const MAP_CONSTANTS = {
  DEFAULT_BASEMAP: 'streets-vector',
  DEFAULT_CENTER: [-74.0721, 4.711] as [number, number], // Bogotá
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 1, // Permite ver todo el país
  MAX_ZOOM: 18,

  HIGHWAY_EXTENT: {
    xmin: -74.5,
    ymin: 4.0,
    xmax: -73.5,
    ymax: 5.0,
    spatialReference: { wkid: 4326 },
  },
} as const;

// Graph Constants
export const GRAPH_CONSTANTS = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  NODE_RADIUS: {
    MIN: 5,
    MAX: 20,
    DEFAULT: 10,
  },
  LINK_DISTANCE: 100,
  CHARGE_STRENGTH: -100,
  COLORS: {
    NODE_DEFAULT: '#3b82f6',
    NODE_SELECTED: '#ef4444',
    NODE_HIGHLIGHTED: '#f59e0b',
    LINK_DEFAULT: '#94a3b8',
    LINK_SELECTED: '#ef4444',
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 300,
  HEADER_HEIGHT: 64,
  PANEL_MIN_WIDTH: 200,
  PANEL_MAX_WIDTH: 600,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

// Data Constants
export const DATA_CONSTANTS = {
  SOCIAL_MEDIA_DATA_PATH: '/data/dataset.json',
  MAX_FEATURES_DISPLAY: 1000,
  CACHE_DURATION: 1000 * 60 * 5, // 5 minutes
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  DASHBOARD: '/dashboard',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_FAILED: 'Error al iniciar sesión. Por favor, intente nuevamente.',
    SESSION_EXPIRED: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    UNAUTHORIZED: 'No tiene permisos para acceder a este recurso.',
  },
  MAP: {
    LOAD_FAILED: 'Error al cargar el mapa. Por favor, recargue la página.',
    LAYER_FAILED: 'Error al cargar la capa del mapa.',
  },
  DATA: {
    LOAD_FAILED: 'Error al cargar los datos. Por favor, intente nuevamente.',
    PARSE_FAILED: 'Error al procesar los datos.',
  },
  NETWORK: {
    OFFLINE: 'No hay conexión a internet.',
    TIMEOUT: 'La solicitud ha excedido el tiempo de espera.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  },
  DATA: {
    LOAD_SUCCESS: 'Datos cargados exitosamente.',
  },
} as const;

// Feature Flags (can be overridden by environment variables)
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: false,
  ENABLE_DEBUG: false,
  ENABLE_OFFLINE: false,
  ENABLE_REAL_TIME: false,
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  SOCIAL_MEDIA: '/api/social-media',
  ANALYTICS: '/api/analytics',
  USER: '/api/user',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  MAP_EXTENT: 'map_extent',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
} as const;

// Number Formats
export const NUMBER_FORMATS = {
  LOCALE: 'es-CO',
  CURRENCY: 'COP',
  DECIMAL_PLACES: 2,
} as const;

export const ARCGIS_CONFIG = {
  ITEM_ID: '2f2bb3ff302a4ff7adcaf2f938904aaf', // Finagro
  PORTAL: 'https://geoagro.finagro.com.co/arcgisportal/sharing/rest',
  ARCGIS_APP_ID: '7njaaJm1E8zc0eFq',
  URL_REDIRECT: 'http://localhost:3000/',
  ARCGIS_CLIENT_SECRET: '64881988dd744c64a41757bbf4414492',
  SESSION_TIMEOUT: 1000 * 60 * 60, // 1 hour
} as const;
