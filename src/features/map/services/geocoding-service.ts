/**
 * Geocoding Service
 *
 * Service for geocoding and reverse geocoding using ArcGIS Locator
 */

import * as locator from '@arcgis/core/rest/locator';
import Point from '@arcgis/core/geometry/Point';
import { env } from '@/config/env';

export interface GeocodingResult {
  address: string;
  location: {
    x: number; // longitude
    y: number; // latitude
  };
  score: number;
  attributes: Record<string, unknown>;
}

export interface ReverseGeocodeResult {
  address: string;
  location: {
    x: number;
    y: number;
  };
}

class GeocodingService {
  private locatorUrl: string;
  private cache: Map<string, GeocodingResult[]>;
  private reverseCache: Map<string, ReverseGeocodeResult>;

  constructor() {
    // Using ArcGIS World Geocoding Service
    this.locatorUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
    this.cache = new Map();
    this.reverseCache = new Map();
  }

  /**
   * Geocode an address (convert address to coordinates)
   */
  async geocode(address: string, maxResults: number = 5): Promise<GeocodingResult[]> {
    if (!address || address.trim().length < 3) {
      return [];
    }

    // Check cache first
    const cacheKey = `${address.toLowerCase()}_${maxResults}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const params = {
        address: {
          SingleLine: address,
        },
        maxLocations: maxResults,
        outFields: ['*'],
        location: new Point({
          longitude: env.map.centerLon,
          latitude: env.map.centerLat,
        }),
      };

      const response = await locator.addressToLocations(this.locatorUrl, params);

      const results: GeocodingResult[] = response
        .filter((candidate) => candidate.location && candidate.address)
        .map((candidate) => ({
          address: candidate.address || '',
          location: {
            x: candidate.location!.longitude!,
            y: candidate.location!.latitude!,
          },
          score: candidate.score || 0,
          attributes: candidate.attributes || {},
        }));

      // Cache the results
      this.cache.set(cacheKey, results);

      return results;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Error al buscar la dirección. Por favor, intenta nuevamente.');
    }
  }

  /**
   * Suggest addresses (autocomplete)
   */
  async suggest(text: string, maxSuggestions: number = 5): Promise<string[]> {
    if (!text || text.trim().length < 2) {
      return [];
    }

    try {
      const params = {
        text,
        maxSuggestions,
        location: new Point({
          longitude: env.map.centerLon,
          latitude: env.map.centerLat,
        }),
      };

      const response = await locator.suggestLocations(this.locatorUrl, params);

      return response.map((suggestion) => suggestion.text || '').filter((text) => text.length > 0);
    } catch (error) {
      console.error('Suggestion error:', error);
      return [];
    }
  }

  /**
   * Reverse geocode (convert coordinates to address)
   */
  async reverseGeocode(longitude: number, latitude: number): Promise<ReverseGeocodeResult | null> {
    const cacheKey = `${longitude.toFixed(6)}_${latitude.toFixed(6)}`;

    // Check cache first
    if (this.reverseCache.has(cacheKey)) {
      return this.reverseCache.get(cacheKey)!;
    }

    try {
      const params = {
        location: new Point({
          longitude,
          latitude,
        }),
      };

      const response = await locator.locationToAddress(this.locatorUrl, params);

      if (!response.address) {
        return null;
      }

      const result: ReverseGeocodeResult = {
        address: response.address,
        location: {
          x: longitude,
          y: latitude,
        },
      };

      // Cache the result
      this.reverseCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    this.reverseCache.clear();
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
