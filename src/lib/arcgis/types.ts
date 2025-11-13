/**
 * ArcGIS TypeScript Type Definitions
 *
 * Custom types and interfaces for ArcGIS integration
 */

// Re-export commonly used ArcGIS types
// Note: These will be available after @arcgis/core is installed
export type MapView = __esri.MapView;
export type Map = __esri.Map;
export type Graphic = __esri.Graphic;
export type Layer = __esri.Layer;
export type FeatureLayer = __esri.FeatureLayer;
export type GraphicsLayer = __esri.GraphicsLayer;
export type Basemap = __esri.Basemap;
export type Point = __esri.Point;
export type Polyline = __esri.Polyline;
export type Polygon = __esri.Polygon;
export type Extent = __esri.Extent;
export type SpatialReference = __esri.SpatialReference;

// Custom types for our application
export interface MapConfig {
  basemap: string;
  center: [number, number];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface LayerConfig {
  id: string;
  title: string;
  url?: string;
  type: 'feature' | 'graphics' | 'tile' | 'vector-tile';
  visible: boolean;
  opacity?: number;
  minScale?: number;
  maxScale?: number;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
  rotation: number;
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export interface FeatureSelection {
  layerId: string;
  features: Graphic[];
  geometry?: Point | Polyline | Polygon;
}

export interface MapEventHandlers {
  onClick?: (event: __esri.ViewClickEvent) => void;
  onPointerMove?: (event: __esri.ViewPointerMoveEvent) => void;
  onExtentChange?: (extent: Extent) => void;
  onLayerViewCreate?: (event: __esri.ViewLayerviewCreateEvent) => void;
}

export interface WidgetPosition {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'manual';
  index?: number;
}

export interface AuthConfig {
  portalUrl: string;
  clientId: string;
  redirectUri?: string;
}

export interface UserInfo {
  username: string;
  fullName: string;
  email: string;
  role: string;
  thumbnail?: string;
}

export interface PortalInfo {
  name: string;
  url: string;
  user: UserInfo;
}
