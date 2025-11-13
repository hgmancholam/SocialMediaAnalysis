/**
 * Map Factory
 *
 * Factory functions for creating ArcGIS MapView instances
 */

import { arcgisConfig } from './config';
import type { MapView, MapConfig } from './types';

/**
 * Creates a MapView from a Portal WebMap item
 */
export const createMapViewFromWebMap = async (container: HTMLDivElement): Promise<MapView> => {
  // Dynamically import ArcGIS modules
  const [WebMap, MapView, esriConfig] = await Promise.all([
    import('@arcgis/core/WebMap'),
    import('@arcgis/core/views/MapView'),
    import('@arcgis/core/config'),
  ]);

  // Configure portal URL
  if (arcgisConfig.portal.url) {
    esriConfig.default.portalUrl = arcgisConfig.portal.url;
  }

  // Load WebMap from Portal
  const webMap = new WebMap.default({
    portalItem: {
      id: arcgisConfig.portal.itemId,
    },
  });

  // Create MapView
  const view = new MapView.default({
    container,
    map: webMap,
    // Let the WebMap define the initial extent
    // Or override with custom center/zoom if needed
    center: arcgisConfig.map.center,
    zoom: arcgisConfig.map.zoom,
    // Disable native UI controls (we have custom controls)
    ui: {
      components: [], // Remove all default UI components including zoom
    },
  });

  // Wait for view to be ready
  await view.when();

  return view;
};

/**
 * Creates a MapView with a custom basemap (fallback option)
 */
export const createMapViewWithBasemap = async (
  container: HTMLDivElement,
  config?: Partial<MapConfig>
): Promise<MapView> => {
  const [Map, MapView, esriConfig] = await Promise.all([
    import('@arcgis/core/Map'),
    import('@arcgis/core/views/MapView'),
    import('@arcgis/core/config'),
  ]);

  // Configure portal URL
  if (arcgisConfig.portal.url) {
    esriConfig.default.portalUrl = arcgisConfig.portal.url;
  }

  const map = new Map.default({
    basemap: config?.basemap || arcgisConfig.map.basemap,
  });

  const view = new MapView.default({
    container,
    map,
    center: config?.center || arcgisConfig.map.center,
    zoom: config?.zoom || arcgisConfig.map.zoom,
    constraints: {
      minZoom: config?.minZoom || arcgisConfig.map.minZoom,
      maxZoom: config?.maxZoom || arcgisConfig.map.maxZoom,
    },
    // Disable native UI controls (we have custom controls)
    ui: {
      components: [], // Remove all default UI components including zoom
    },
  });

  await view.when();

  return view;
};

/**
 * Destroys a MapView and cleans up resources
 */
export const destroyMapView = (view: MapView | null): void => {
  if (view) {
    view.destroy();
  }
};

/**
 * Adds a layer to the map
 */
export const addLayerToMap = async (
  view: MapView,
  layerUrl: string,
  layerType: 'feature' | 'tile' | 'vector-tile' = 'feature'
): Promise<__esri.Layer> => {
  let Layer;

  switch (layerType) {
    case 'feature':
      Layer = (await import('@arcgis/core/layers/FeatureLayer')).default;
      break;
    case 'tile':
      Layer = (await import('@arcgis/core/layers/TileLayer')).default;
      break;
    case 'vector-tile':
      Layer = (await import('@arcgis/core/layers/VectorTileLayer')).default;
      break;
    default:
      Layer = (await import('@arcgis/core/layers/FeatureLayer')).default;
  }

  const layer = new Layer({
    url: layerUrl,
  });

  if (view.map) {
    view.map.add(layer);
  }
  return layer;
};

/**
 * Creates a graphics layer for custom graphics
 */
export const createGraphicsLayer = async (id?: string): Promise<__esri.GraphicsLayer> => {
  const GraphicsLayer = (await import('@arcgis/core/layers/GraphicsLayer')).default;

  return new GraphicsLayer({
    id: id || 'graphics-layer',
  });
};

/**
 * Adds a graphics layer to the map
 */
export const addGraphicsLayerToMap = (view: MapView, graphicsLayer: __esri.GraphicsLayer): void => {
  if (view.map) {
    view.map.add(graphicsLayer);
  }
};
