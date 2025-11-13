/**
 * Map Service
 *
 * Business logic for map operations
 */

import {
  createMapViewFromWebMap,
  createMapViewWithBasemap,
  destroyMapView,
  createGraphicsLayer,
  addGraphicsLayerToMap,
} from '@/lib/arcgis/map-factory';
import type { MapView, Graphic } from '@/lib/arcgis/types';
import type { MapViewOptions } from '../types';
import type { User } from '@/types/dataset';
import {
  getUsersWithInfluence,
  calculatePointSize,
  getInfluenceColor,
  type UserInfluence,
} from './user-influence-service';

class MapService {
  private mapView: MapView | null = null;
  private graphicsLayer: __esri.GraphicsLayer | null = null;
  private highlightHandle: __esri.Handle | null = null;
  private influenceLayer: __esri.GraphicsLayer | null = null;
  private influenceData: UserInfluence[] = [];

  /**
   * Initialize map view
   */
  async initialize(container: HTMLDivElement, options?: MapViewOptions): Promise<MapView> {
    try {
      // Use WebMap from Portal by default
      if (options?.useWebMap !== false) {
        this.mapView = await createMapViewFromWebMap(container);
      } else {
        // Fallback to custom basemap
        this.mapView = await createMapViewWithBasemap(container, {
          center: options?.center,
          zoom: options?.zoom,
          basemap: options?.basemap,
        });
      }

      // Create graphics layer for custom graphics
      this.graphicsLayer = await createGraphicsLayer('social-media-graphics');
      addGraphicsLayerToMap(this.mapView, this.graphicsLayer);

      return this.mapView;
    } catch (error) {
      console.error('Failed to initialize map:', error);
      throw error;
    }
  }

  /**
   * Get current map view
   */
  getMapView(): MapView | null {
    return this.mapView;
  }

  /**
   * Get graphics layer
   */
  getGraphicsLayer(): __esri.GraphicsLayer | null {
    return this.graphicsLayer;
  }

  /**
   * Add a graphic to the map
   */
  async addGraphic(graphic: Graphic): Promise<void> {
    if (!this.graphicsLayer) {
      throw new Error('Graphics layer not initialized');
    }
    this.graphicsLayer.add(graphic);
  }

  /**
   * Add multiple graphics to the map
   */
  async addGraphics(graphics: Graphic[]): Promise<void> {
    if (!this.graphicsLayer) {
      throw new Error('Graphics layer not initialized');
    }
    this.graphicsLayer.addMany(graphics);
  }

  /**
   * Remove a graphic from the map
   */
  removeGraphic(graphic: Graphic): void {
    if (!this.graphicsLayer) return;
    this.graphicsLayer.remove(graphic);
  }

  /**
   * Clear all graphics
   */
  clearGraphics(): void {
    if (!this.graphicsLayer) return;
    this.graphicsLayer.removeAll();
  }

  /**
   * Add a location marker to the map
   */
  async addLocationMarker(longitude: number, latitude: number, title?: string): Promise<Graphic> {
    const Point = (await import('@arcgis/core/geometry/Point')).default;
    const Graphic = (await import('@arcgis/core/Graphic')).default;
    const SimpleMarkerSymbol = (await import('@arcgis/core/symbols/SimpleMarkerSymbol')).default;

    // Create a point geometry
    const point = new Point({
      longitude,
      latitude,
    });

    // Create a marker symbol
    const markerSymbol = new SimpleMarkerSymbol({
      color: [59, 130, 246], // Blue color
      size: 12,
      outline: {
        color: [255, 255, 255], // White outline
        width: 2,
      },
    });

    // Create a graphic with the point and symbol
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: {
        title: title || 'Ubicación seleccionada',
      },
      popupTemplate: title
        ? {
            title: '{title}',
            content: `Longitud: ${longitude.toFixed(6)}<br>Latitud: ${latitude.toFixed(6)}`,
          }
        : undefined,
    });

    // Add to graphics layer
    if (this.graphicsLayer) {
      this.graphicsLayer.add(pointGraphic);
    }

    return pointGraphic;
  }

  /**
   * Remove location marker
   */
  removeLocationMarker(graphic: Graphic): void {
    if (this.graphicsLayer) {
      this.graphicsLayer.remove(graphic);
    }
  }

  /**
   * Zoom to a specific location
   */
  async zoomTo(target: __esri.Geometry | Graphic | Graphic[]): Promise<void> {
    if (!this.mapView) return;
    await this.mapView.goTo(target);
  }

  /**
   * Highlight features
   */
  async highlightFeatures(layerView: __esri.FeatureLayerView, features: Graphic[]): Promise<void> {
    // Remove previous highlight
    if (this.highlightHandle) {
      this.highlightHandle.remove();
    }

    // Highlight new features
    if (features.length > 0) {
      this.highlightHandle = layerView.highlight(features);
    }
  }

  /**
   * Clear highlights
   */
  clearHighlight(): void {
    if (this.highlightHandle) {
      this.highlightHandle.remove();
      this.highlightHandle = null;
    }
  }

  /**
   * Query features at a point
   */
  async queryFeaturesAtPoint(screenPoint: { x: number; y: number }): Promise<Graphic[]> {
    if (!this.mapView) return [];

    try {
      const response = await this.mapView.hitTest(screenPoint);
      return response.results
        .filter((result) => result.type === 'graphic')
        .map((result) => (result as __esri.GraphicHit).graphic);
    } catch (error) {
      console.error('Failed to query features:', error);
      return [];
    }
  }

  /**
   * Add event listener to map
   */
  on<T = unknown>(eventName: string, callback: (event: T) => void): __esri.Handle | null {
    if (!this.mapView) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.mapView as any).on(eventName, callback);
  }

  /**
   * Watch for property changes
   */
  watch(
    property: string,
    callback: (newValue: unknown, oldValue: unknown) => void
  ): __esri.WatchHandle | null {
    if (!this.mapView) return null;
    return this.mapView.watch(property, callback);
  }

  /**
   * Get all layers from the map
   */
  getAllLayers(): __esri.Layer[] {
    if (!this.mapView || !this.mapView.map) return [];
    return this.mapView.map.allLayers.toArray();
  }

  /**
   * Get layer by ID
   */
  getLayerById(layerId: string): __esri.Layer | undefined {
    if (!this.mapView || !this.mapView.map) return undefined;
    return this.mapView.map.allLayers.find((layer) => layer.id === layerId);
  }

  /**
   * Toggle layer visibility
   */
  toggleLayerVisibility(layerId: string): boolean {
    const layer = this.getLayerById(layerId);
    if (!layer) return false;
    layer.visible = !layer.visible;
    return layer.visible;
  }

  /**
   * Set layer visibility
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.getLayerById(layerId);
    if (layer) {
      layer.visible = visible;
    }
  }

  /**
   * Remove layer from map
   */
  removeLayer(layerId: string): boolean {
    if (!this.mapView || !this.mapView.map) return false;

    const layer = this.getLayerById(layerId);
    if (!layer) return false;

    // Don't allow removal of basemap layers
    if (this.mapView.map.basemap?.baseLayers?.includes(layer as __esri.Layer)) {
      console.warn('Cannot remove basemap layer');
      return false;
    }

    // Don't allow removal of WebMap layers
    if (this.isWebMapLayer(layerId)) {
      console.warn('Cannot remove WebMap layer');
      return false;
    }

    this.mapView.map.remove(layer);
    return true;
  }

  /**
   * Check if layer is a basemap layer
   */
  isBasemapLayer(layerId: string): boolean {
    if (!this.mapView || !this.mapView.map) return false;

    const layer = this.getLayerById(layerId);
    if (!layer) return false;

    return this.mapView.map.basemap?.baseLayers?.includes(layer as __esri.Layer) ?? false;
  }

  /**
   * Check if layer is from the original WebMap (not a dynamically added search layer)
   */
  isWebMapLayer(layerId: string): boolean {
    if (!this.mapView || !this.mapView.map) return false;

    const layer = this.getLayerById(layerId);
    if (!layer) return false;

    // Check if it's a basemap layer
    if (this.mapView.map.basemap?.baseLayers?.includes(layer as __esri.Layer)) {
      return true;
    }

    // Layers added dynamically (like tweets-layer) are search layers
    // The WebMap layers are loaded from the portal and don't have specific IDs we set
    const dynamicLayerIds = ['tweets-layer', 'social-media-graphics', 'users-influence-layer'];

    // If it's not a dynamic layer we created, it's from the WebMap
    return !dynamicLayerIds.includes(layerId);
  }

  /**
   * Watch for layer changes (add/remove)
   */
  watchLayers(callback: () => void): __esri.WatchHandle | null {
    if (!this.mapView || !this.mapView.map) return null;

    // Watch the allLayers collection for changes
    return this.mapView.map.allLayers.on('change', () => {
      callback();
    });
  }

  /**
   * Create and add influence layer with user points
   */
  async createInfluenceLayer(users: User[]): Promise<void> {
    if (!this.mapView || !this.mapView.map) {
      throw new Error('Map view not initialized');
    }

    // Remove existing influence layer if present
    if (this.influenceLayer) {
      this.mapView.map.remove(this.influenceLayer);
      this.influenceLayer = null;
    }

    // Calculate influence for all users with geo data
    this.influenceData = getUsersWithInfluence(users);

    if (this.influenceData.length === 0) {
      console.warn('No users with geographic data found');
      return;
    }

    // Import ArcGIS modules
    const [Point, Graphic, SimpleMarkerSymbol, GraphicsLayer] = await Promise.all([
      import('@arcgis/core/geometry/Point').then((m) => m.default),
      import('@arcgis/core/Graphic').then((m) => m.default),
      import('@arcgis/core/symbols/SimpleMarkerSymbol').then((m) => m.default),
      import('@arcgis/core/layers/GraphicsLayer').then((m) => m.default),
    ]);

    // Create graphics for each user
    const graphics: Graphic[] = this.influenceData.map((userInfluence) => {
      const point = new Point({
        longitude: userInfluence.longitude,
        latitude: userInfluence.latitude,
      });

      const size = calculatePointSize(userInfluence.normalizedScore, 8, 40);
      const color = getInfluenceColor(userInfluence.normalizedScore);

      const symbol = new SimpleMarkerSymbol({
        color: color,
        size: size,
        outline: {
          color: [255, 255, 255, 0.8],
          width: 2,
        },
      });

      return new Graphic({
        geometry: point,
        symbol: symbol,
        attributes: {
          userId: userInfluence.userId,
          username: userInfluence.username,
          name: userInfluence.name,
          influenceScore: userInfluence.influenceScore,
          normalizedScore: userInfluence.normalizedScore,
          followers: userInfluence.metrics.followers,
          following: userInfluence.metrics.following,
          tweets: userInfluence.metrics.tweets,
          listed: userInfluence.metrics.listed,
        },
        popupTemplate: {
          title: '{name} (@{username})',
          content: `
            <div style="font-size: 13px;">
              <p style="margin: 8px 0;"><strong>Puntuación de Influencia:</strong> {influenceScore}</p>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 4px 0;"><strong>Seguidores:</strong> {followers}</p>
                <p style="margin: 4px 0;"><strong>Siguiendo:</strong> {following}</p>
                <p style="margin: 4px 0;"><strong>Tweets:</strong> {tweets}</p>
                <p style="margin: 4px 0;"><strong>En listas:</strong> {listed}</p>
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                  <strong>Ubicación:</strong><br>
                  Lat: ${userInfluence.latitude.toFixed(6)}<br>
                  Lon: ${userInfluence.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          `,
        },
      });
    });

    // Create the influence layer
    this.influenceLayer = new GraphicsLayer({
      id: 'users-influence-layer',
      title: 'Usuarios Influyentes',
      graphics: graphics,
      visible: true,
    });

    // Add layer to map
    this.mapView.map.add(this.influenceLayer);

    console.log(`Influence layer created with ${graphics.length} user points`);
  }

  /**
   * Get influence layer
   */
  getInfluenceLayer(): __esri.GraphicsLayer | null {
    return this.influenceLayer;
  }

  /**
   * Toggle influence layer visibility
   */
  toggleInfluenceLayerVisibility(): boolean {
    if (!this.influenceLayer) return false;
    this.influenceLayer.visible = !this.influenceLayer.visible;
    return this.influenceLayer.visible;
  }

  /**
   * Remove influence layer
   */
  removeInfluenceLayer(): void {
    if (!this.influenceLayer || !this.mapView || !this.mapView.map) return;
    this.mapView.map.remove(this.influenceLayer);
    this.influenceLayer = null;
    this.influenceData = [];
  }

  /**
   * Get influence data
   */
  getInfluenceData(): UserInfluence[] {
    return this.influenceData;
  }

  /**
   * Destroy map view and clean up resources
   */
  destroy(): void {
    this.clearHighlight();

    if (this.graphicsLayer) {
      this.graphicsLayer.removeAll();
      this.graphicsLayer = null;
    }

    if (this.influenceLayer) {
      this.influenceLayer.removeAll();
      this.influenceLayer = null;
    }

    if (this.mapView) {
      destroyMapView(this.mapView);
      this.mapView = null;
    }
  }
}

// Export singleton instance
export const mapService = new MapService();
