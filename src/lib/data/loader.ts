/**
 * Data Loader
 *
 * Handles loading and processing of the Twitter/X dataset
 */

import type {
  Dataset,
  ProcessedDataset,
  Tweet,
  User,
  EnrichedTweet,
  DatasetStats,
} from '@/types/dataset';

/**
 * Load the raw dataset from the public data directory
 */
export async function loadDataset(): Promise<Dataset> {
  try {
    const response = await fetch('/data/dataset.json');

    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      tweets: data.tweets || [],
      users: data.users || {},
      // El dataset real usa "sentimiento" en lugar de "enriched_tweets"
      enriched_tweets: data.sentimiento || data.enriched_tweets || [],
    };
  } catch (error) {
    console.error('Error loading dataset:', error);
    throw error;
  }
}

/**
 * Process the raw dataset into a more usable format
 * Converts the users object into an array and creates lookup maps
 */
export function processDataset(dataset: Dataset): ProcessedDataset {
  // Convert users object to array
  const users = Object.values(dataset.users);

  // Create lookup maps for efficient access
  const userMap = new Map<string, User>();
  users.forEach((user) => {
    userMap.set(user.id, user);
  });

  const tweetMap = new Map<string, Tweet>();
  dataset.tweets.forEach((tweet) => {
    tweetMap.set(tweet.id, tweet);
  });

  const enrichedTweetMap = new Map<string, EnrichedTweet>();
  dataset.enriched_tweets.forEach((enrichedTweet) => {
    enrichedTweetMap.set(enrichedTweet.id, enrichedTweet);
  });

  return {
    tweets: dataset.tweets,
    users,
    enrichedTweets: dataset.enriched_tweets,
    userMap,
    tweetMap,
    enrichedTweetMap,
  };
}

/**
 * Load and process the dataset in one call
 */
export async function loadAndProcessDataset(): Promise<ProcessedDataset> {
  const dataset = await loadDataset();
  return processDataset(dataset);
}

/**
 * Calculate statistics from the processed dataset
 */
export function calculateDatasetStats(dataset: ProcessedDataset): DatasetStats {
  // Calculate date range
  const dates = dataset.tweets
    .map((tweet) => new Date(tweet.created_at))
    .filter((date) => !isNaN(date.getTime()));

  const start =
    dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
  const end = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();

  // Calculate sentiment distribution
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  dataset.enrichedTweets.forEach((tweet) => {
    if (tweet.sentiment in sentimentCounts) {
      sentimentCounts[tweet.sentiment]++;
    }
  });

  // Calculate top entities
  const entityCounts = new Map<string, { category: string; count: number }>();

  dataset.enrichedTweets.forEach((tweet) => {
    tweet.entities.forEach((entity) => {
      const key = `${entity.text}|${entity.category}`;
      const existing = entityCounts.get(key);

      if (existing) {
        existing.count++;
      } else {
        entityCounts.set(key, {
          category: entity.category,
          count: 1,
        });
      }
    });
  });

  const topEntities = Array.from(entityCounts.entries())
    .map(([key, value]) => ({
      text: key.split('|')[0],
      category: value.category,
      count: value.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Count users with geo data
  const usersWithGeo = dataset.users.filter((user) => user.geo).length;

  return {
    totalTweets: dataset.tweets.length,
    totalUsers: dataset.users.length,
    totalEnrichedTweets: dataset.enrichedTweets.length,
    dateRange: {
      start,
      end,
    },
    sentimentDistribution: sentimentCounts,
    topEntities,
    usersWithGeo,
  };
}

/**
 * Get tweets by user ID
 */
export function getTweetsByUser(dataset: ProcessedDataset, userId: string): Tweet[] {
  return dataset.tweets.filter((tweet) => tweet.author_id === userId);
}

/**
 * Get enriched tweets by sentiment
 */
export function getEnrichedTweetsBySentiment(
  dataset: ProcessedDataset,
  sentiment: 'positive' | 'neutral' | 'negative'
): EnrichedTweet[] {
  return dataset.enrichedTweets.filter((tweet) => tweet.sentiment === sentiment);
}

/**
 * Get users with geographic coordinates
 */
export function getUsersWithGeo(dataset: ProcessedDataset): User[] {
  return dataset.users.filter((user) => user.geo);
}

/**
 * Get enriched tweets with geographic coordinates
 */
export function getEnrichedTweetsWithGeo(dataset: ProcessedDataset): EnrichedTweet[] {
  return dataset.enrichedTweets.filter((tweet) => tweet.geo);
}

/**
 * Search tweets by text content
 */
export function searchTweets(dataset: ProcessedDataset, query: string): Tweet[] {
  const lowerQuery = query.toLowerCase();
  return dataset.tweets.filter((tweet) => tweet.text.toLowerCase().includes(lowerQuery));
}

/**
 * Get tweets within a date range
 */
export function getTweetsByDateRange(
  dataset: ProcessedDataset,
  startDate: Date,
  endDate: Date
): Tweet[] {
  return dataset.tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.created_at);
    return tweetDate >= startDate && tweetDate <= endDate;
  });
}

/**
 * Search result interface for map search
 */
export interface MapSearchResult {
  type: 'user' | 'tweet' | 'location';
  id: string;
  label: string;
  description?: string;
  location: {
    x: number; // longitude
    y: number; // latitude
  };
  data?: User | EnrichedTweet;
}

/**
 * Search users and tweets with location data
 * Returns results that can be displayed on the map
 */
export function searchLocations(
  dataset: ProcessedDataset,
  query: string,
  maxResults: number = 10
): MapSearchResult[] {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.length < 2) {
    return [];
  }

  const results: MapSearchResult[] = [];

  // Search users with geo data
  const usersWithGeo = dataset.users.filter((user) => user.geo);

  usersWithGeo.forEach((user) => {
    const matchesName = user.name.toLowerCase().includes(lowerQuery);
    const matchesUsername = user.username.toLowerCase().includes(lowerQuery);
    const matchesLocation = user.location?.toLowerCase().includes(lowerQuery);

    if (matchesName || matchesUsername || matchesLocation) {
      results.push({
        type: 'user',
        id: user.id,
        label: `@${user.username}`,
        description: user.location || user.name,
        location: {
          x: user.geo!.x,
          y: user.geo!.y,
        },
        data: user,
      });
    }
  });

  // Search enriched tweets (use tweet geo OR author geo)
  dataset.enrichedTweets.forEach((enrichedTweet) => {
    const matchesText = enrichedTweet.text.toLowerCase().includes(lowerQuery);

    // Also check entities
    const matchesEntity = enrichedTweet.entities.some((entity) =>
      entity.text.toLowerCase().includes(lowerQuery)
    );

    if (matchesText || matchesEntity) {
      // Get the original tweet to find the author
      const originalTweet = dataset.tweetMap.get(enrichedTweet.id);
      const author = originalTweet ? dataset.userMap.get(originalTweet.author_id) : undefined;

      // Determine location: use tweet geo if available, otherwise use author geo
      let location: { x: number; y: number } | null = null;

      if (enrichedTweet.geo) {
        // Tweet has its own geo coordinates
        location = {
          x: enrichedTweet.geo.x,
          y: enrichedTweet.geo.y,
        };
      } else if (author?.geo) {
        // Use author's geo coordinates if tweet doesn't have location
        location = {
          x: author.geo.x,
          y: author.geo.y,
        };
      }

      // Only add if we have a location (either from tweet or author)
      if (location) {
        const preview =
          enrichedTweet.text.length > 60
            ? enrichedTweet.text.substring(0, 60) + '...'
            : enrichedTweet.text;

        results.push({
          type: 'tweet',
          id: enrichedTweet.id,
          label: preview,
          description: author ? `Por @${author.username}` : 'Tweet',
          location,
          data: enrichedTweet,
        });
      }
    }
  });

  // Sort by relevance (exact matches first, then partial)
  results.sort((a, b) => {
    const aExact = a.label.toLowerCase() === lowerQuery;
    const bExact = b.label.toLowerCase() === lowerQuery;

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    return 0;
  });

  return results.slice(0, maxResults);
}
