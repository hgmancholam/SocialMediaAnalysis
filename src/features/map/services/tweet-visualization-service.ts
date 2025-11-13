/**
 * Tweet Visualization Service
 *
 * Service to visualize tweets on the ArcGIS map with clustering and
 * size based on engagement (retweets)
 */

import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import type { ProcessedDataset, EnrichedTweet, Tweet } from '@/types/dataset';

interface TweetVisualizationConfig {
  minSize: number;
  maxSize: number;
  color: [number, number, number, number];
  outlineColor: [number, number, number, number];
}

const DEFAULT_CONFIG: TweetVisualizationConfig = {
  minSize: 12,
  maxSize: 50,
  color: [59, 130, 246, 0.8], // Blue with transparency
  outlineColor: [255, 255, 255, 1],
};

class TweetVisualizationService {
  private layer: GraphicsLayer | null = null;
  private config: TweetVisualizationConfig = DEFAULT_CONFIG;

  /**
   * Create or get the tweets layer
   */
  private async getLayer(customTitle?: string): Promise<GraphicsLayer> {
    // If we have a custom title, create a new layer or update existing one
    if (customTitle) {
      if (this.layer) {
        this.layer.title = customTitle;
      } else {
        this.layer = new GraphicsLayer({
          id: 'tweets-layer',
          title: customTitle,
        });
      }
      return this.layer;
    }

    if (this.layer) {
      return this.layer;
    }

    this.layer = new GraphicsLayer({
      id: 'tweets-layer',
      title: 'Tweets Georeferenciados',
    });

    return this.layer;
  }

  /**
   * Calculate tweet engagement (retweets + likes)
   */
  private getTweetEngagement(tweet: Tweet): number {
    return tweet.public_metrics.retweet_count + tweet.public_metrics.like_count;
  }

  /**
   * Calculate marker size based on engagement
   */
  private calculateMarkerSize(engagement: number, maxEngagement: number): number {
    if (maxEngagement === 0) return this.config.minSize;

    const normalized = engagement / maxEngagement;
    const sizeRange = this.config.maxSize - this.config.minSize;
    return this.config.minSize + normalized * sizeRange;
  }

  /**
   * Create a marker symbol for a tweet
   */
  private createMarkerSymbol(size: number): SimpleMarkerSymbol {
    return new SimpleMarkerSymbol({
      style: 'circle',
      color: this.config.color,
      size: size,
      outline: {
        color: this.config.outlineColor,
        width: 2,
      },
    });
  }

  /**
   * Create popup template for tweet
   */
  private createPopupTemplate(tweet: Tweet, enrichedTweet?: EnrichedTweet): PopupTemplate {
    const engagement = this.getTweetEngagement(tweet);

    // Sentiment info with better colors
    let sentimentInfo = '';
    if (enrichedTweet) {
      const sentimentConfig = {
        positive: { emoji: '😊', label: 'Positivo', bg: '#dcfce7', color: '#166534' },
        neutral: { emoji: '😐', label: 'Neutral', bg: '#e0e7ff', color: '#3730a3' },
        negative: { emoji: '😞', label: 'Negativo', bg: '#fee2e2', color: '#991b1b' },
      }[enrichedTweet.sentiment];

      sentimentInfo = `
        <div style="margin: 12px 0; padding: 10px; background: ${sentimentConfig.bg}; border-radius: 8px; border: 2px solid ${sentimentConfig.color}20;">
          <strong style="color: #000;">Sentimiento:</strong> 
          <span style="font-size: 20px; margin: 0 4px;">${sentimentConfig.emoji}</span> 
          <strong style="color: ${sentimentConfig.color};">${sentimentConfig.label}</strong>
        </div>
      `;
    }

    // Entities info with better visibility
    let entitiesInfo = '';
    if (enrichedTweet && enrichedTweet.entities.length > 0) {
      const entityTags = enrichedTweet.entities
        .map(
          (e) =>
            `<span style="display: inline-block; padding: 4px 10px; margin: 3px; background: #3b82f6; color: white; border-radius: 6px; font-size: 13px; font-weight: 500;">${e.text}</span>`
        )
        .join('');

      entitiesInfo = `
        <div style="margin: 12px 0; padding: 10px; background: #f0f9ff; border-radius: 8px; border: 2px solid #bae6fd;">
          <strong style="color: #000; display: block; margin-bottom: 8px;">🏷️ Entidades:</strong>
          <div style="margin-top: 6px;">${entityTags}</div>
        </div>
      `;
    }

    const content = `
      <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #000; background: #fff; padding: 4px;">
        <p style="margin: 0 0 16px 0; color: #000; font-size: 15px; font-weight: 400; line-height: 1.5;">${tweet.text}</p>
        
        <div style="display: flex; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; margin: 12px 0; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <span style="font-size: 18px;">❤️</span>
            <span style="font-weight: 700; color: #000; font-size: 15px;">${tweet.public_metrics.like_count.toLocaleString('es-ES')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <span style="font-size: 18px;">🔄</span>
            <span style="font-weight: 700; color: #000; font-size: 15px;">${tweet.public_metrics.retweet_count.toLocaleString('es-ES')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <span style="font-size: 18px;">💬</span>
            <span style="font-weight: 700; color: #000; font-size: 15px;">${tweet.public_metrics.reply_count.toLocaleString('es-ES')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <span style="font-size: 18px;">📊</span>
            <span style="font-weight: 700; color: #000; font-size: 15px;">${engagement.toLocaleString('es-ES')}</span>
          </div>
        </div>
        
        <div style="margin: 12px 0; padding: 8px; background: #fafafa; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <span style="font-size: 16px; margin-right: 6px;">📅</span>
          <strong style="color: #000;">${new Date(tweet.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</strong>
        </div>
        
        ${sentimentInfo}
        ${entitiesInfo}
      </div>
    `;

    return new PopupTemplate({
      title:
        '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 12px; border-radius: 6px; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;"><span style="font-size: 20px;">📱</span> Tweet</div>',
      content: content,
    });
  }

  /**
   * Add tweets to the map
   */
  async visualizeTweets(
    mapView: __esri.MapView,
    dataset: ProcessedDataset,
    searchTerm?: string
  ): Promise<void> {
    try {
      // Create layer title based on search term if provided
      let layerTitle: string | undefined;
      if (searchTerm) {
        // Limit to 50 characters
        const truncatedTerm =
          searchTerm.length > 37 ? searchTerm.substring(0, 37) + '...' : searchTerm;
        layerTitle = `Búsqueda ${truncatedTerm}`;
      }

      const layer = await this.getLayer(layerTitle);

      // Clear existing graphics
      layer.removeAll();

      // Get all tweets with location (either from tweet or author)
      const tweetsWithLocation: Array<{
        tweet: Tweet;
        enrichedTweet?: EnrichedTweet;
        location: { x: number; y: number };
      }> = [];

      dataset.tweets.forEach((tweet) => {
        const enrichedTweet = dataset.enrichedTweetMap.get(tweet.id);
        let location: { x: number; y: number } | null = null;

        // Check if enriched tweet has geo
        if (enrichedTweet?.geo) {
          location = { x: enrichedTweet.geo.x, y: enrichedTweet.geo.y };
        } else {
          // Use author's geo
          const author = dataset.userMap.get(tweet.author_id);
          if (author?.geo) {
            location = { x: author.geo.x, y: author.geo.y };
          }
        }

        if (location) {
          tweetsWithLocation.push({ tweet, enrichedTweet, location });
        }
      });

      // Calculate max engagement for normalization
      const maxEngagement = Math.max(
        ...tweetsWithLocation.map((t) => this.getTweetEngagement(t.tweet)),
        1
      );

      // Create graphics for each tweet
      const graphics = tweetsWithLocation.map(({ tweet, enrichedTweet, location }) => {
        const engagement = this.getTweetEngagement(tweet);
        const size = this.calculateMarkerSize(engagement, maxEngagement);

        const point = new Point({
          longitude: location.x,
          latitude: location.y,
          spatialReference: { wkid: 4326 },
        });

        const symbol = this.createMarkerSymbol(size);
        const popupTemplate = this.createPopupTemplate(tweet, enrichedTweet);

        return new Graphic({
          geometry: point,
          symbol: symbol,
          attributes: {
            tweetId: tweet.id,
            text: tweet.text,
            engagement: engagement,
            retweets: tweet.public_metrics.retweet_count,
            likes: tweet.public_metrics.like_count,
            replies: tweet.public_metrics.reply_count,
            created_at: tweet.created_at,
            sentiment: enrichedTweet?.sentiment || 'unknown',
          },
          popupTemplate: popupTemplate,
        });
      });

      // Add graphics to layer
      layer.addMany(graphics);

      // Add layer to map if not already added
      if (mapView.map && !mapView.map.layers.includes(layer)) {
        mapView.map.add(layer);
      }

      // Ensure popups are enabled
      mapView.popupEnabled = true;
    } catch (error) {
      console.error('❌ Error al visualizar tweets:', error);
      throw error;
    }
  }

  /**
   * Remove tweets layer from map and close any open popups
   */
  async removeTweets(mapView: __esri.MapView): Promise<void> {
    if (this.layer && mapView.map) {
      // Close any open popups
      if (mapView.popup && mapView.popup.visible) {
        mapView.popup.close();
      }

      mapView.map.remove(this.layer);
      this.layer.removeAll();
    }
  }

  /**
   * Toggle tweets visibility
   */
  toggleVisibility(): void {
    if (this.layer) {
      this.layer.visible = !this.layer.visible;
    }
  }
}

export const tweetVisualizationService = new TweetVisualizationService();
