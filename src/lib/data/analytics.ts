/**
 * Dataset Analytics
 *
 * Utility functions to calculate analytics metrics from the dataset
 * for visualization in charts and graphs
 */

import type { ProcessedDataset } from '@/types/dataset';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Time series data point for temporal charts
 */
export interface TimeSeriesDataPoint {
  date: string;
  tweets: number;
  retweets: number;
  likes: number;
  impressions: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Get time series data grouped by hour
 */
export function getTimeSeriesData(dataset: ProcessedDataset): TimeSeriesDataPoint[] {
  // Group tweets by hour
  const hourlyData = new Map<string, TimeSeriesDataPoint>();

  dataset.tweets.forEach((tweet) => {
    const date = parseISO(tweet.created_at);
    const hourKey = format(date, 'yyyy-MM-dd HH:00', { locale: es });

    if (!hourlyData.has(hourKey)) {
      hourlyData.set(hourKey, {
        date: hourKey,
        tweets: 0,
        retweets: 0,
        likes: 0,
        impressions: 0,
      });
    }

    const point = hourlyData.get(hourKey)!;
    point.tweets += 1;
    point.retweets += tweet.public_metrics.retweet_count;
    point.likes += tweet.public_metrics.like_count;
    point.impressions += tweet.public_metrics.impression_count;
  });

  // Convert to array and sort by date
  return Array.from(hourlyData.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Sentiment distribution for pie/donut charts
 */
export interface SentimentData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Get sentiment distribution from enriched tweets
 */
export function getSentimentDistribution(dataset: ProcessedDataset): SentimentData[] {
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

  return [
    {
      name: 'Positivo',
      value: sentimentCounts.positive,
      color: '#10B981', // green
    },
    {
      name: 'Neutral',
      value: sentimentCounts.neutral,
      color: '#6B7280', // gray
    },
    {
      name: 'Negativo',
      value: sentimentCounts.negative,
      color: '#EF4444', // red
    },
  ];
}

/**
 * Top users by followers
 */
export interface TopUserData {
  name: string;
  username: string;
  followers: number;
  tweets: number;
  engagement: number;
}

/**
 * Get top users by follower count
 */
export function getTopUsers(dataset: ProcessedDataset, limit: number = 10): TopUserData[] {
  return dataset.users
    .map((user) => {
      // Calculate engagement as sum of likes and retweets for user's tweets
      const userTweets = dataset.tweets.filter((tweet) => tweet.author_id === user.id);
      const engagement = userTweets.reduce(
        (sum, tweet) => sum + tweet.public_metrics.like_count + tweet.public_metrics.retweet_count,
        0
      );

      return {
        name: user.name,
        username: user.username,
        followers: user.public_metrics.followers_count,
        tweets: userTweets.length,
        engagement,
      };
    })
    .sort((a, b) => b.followers - a.followers)
    .slice(0, limit);
}

/**
 * Geographic distribution data
 */
export interface GeoDistributionData {
  name: string;
  usuarios: number;
  tweets: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Get geographic distribution by location
 */
export function getGeoDistribution(dataset: ProcessedDataset): GeoDistributionData[] {
  const locationCounts = new Map<string, { usuarios: number; tweets: number }>();

  // Count users by location
  dataset.users.forEach((user) => {
    if (user.location) {
      // Normalize location (capitalize first letter)
      const location = user.location.trim();
      if (location) {
        const existing = locationCounts.get(location) || { usuarios: 0, tweets: 0 };
        existing.usuarios += 1;
        locationCounts.set(location, existing);
      }
    }
  });

  // Count tweets by user location
  dataset.tweets.forEach((tweet) => {
    const user = dataset.userMap.get(tweet.author_id);
    if (user?.location) {
      const location = user.location.trim();
      if (location) {
        const existing = locationCounts.get(location) || { usuarios: 0, tweets: 0 };
        existing.tweets += 1;
        locationCounts.set(location, existing);
      }
    }
  });

  // Convert to array and sort by user count
  return Array.from(locationCounts.entries())
    .map(([name, data]) => ({
      name,
      usuarios: data.usuarios,
      tweets: data.tweets,
    }))
    .sort((a, b) => b.usuarios - a.usuarios)
    .slice(0, 10); // Top 10 locations
}

/**
 * Entity category distribution
 */
export interface EntityCategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Get entity distribution by category
 */
export function getEntityCategoryDistribution(dataset: ProcessedDataset): EntityCategoryData[] {
  const categoryCounts = new Map<string, number>();

  dataset.enrichedTweets.forEach((tweet) => {
    tweet.entities.forEach((entity) => {
      const count = categoryCounts.get(entity.category) || 0;
      categoryCounts.set(entity.category, count + 1);
    });
  });

  // Color mapping for entity categories
  const categoryColors: Record<string, string> = {
    Person: '#3B82F6', // blue
    Location: '#10B981', // green
    Organization: '#F59E0B', // orange
    Event: '#8B5CF6', // purple
    PersonType: '#EC4899', // pink
    DateTime: '#6366F1', // indigo
    URL: '#14B8A6', // teal
    Quantity: '#F97316', // orange
  };

  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      name: category,
      value: count,
      color: categoryColors[category] || '#6B7280',
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Top entities by frequency
 */
export interface TopEntityData {
  text: string;
  category: string;
  count: number;
  confidence: number;
}

/**
 * Get most frequent entities
 */
export function getTopEntities(dataset: ProcessedDataset, limit: number = 10): TopEntityData[] {
  const entityMap = new Map<string, { category: string; count: number; totalConfidence: number }>();

  dataset.enrichedTweets.forEach((tweet) => {
    tweet.entities.forEach((entity) => {
      const key = `${entity.text}|${entity.category}`;
      const existing = entityMap.get(key);

      if (existing) {
        existing.count += 1;
        existing.totalConfidence += entity.confidence;
      } else {
        entityMap.set(key, {
          category: entity.category,
          count: 1,
          totalConfidence: entity.confidence,
        });
      }
    });
  });

  return Array.from(entityMap.entries())
    .map(([key, data]) => ({
      text: key.split('|')[0],
      category: data.category,
      count: data.count,
      confidence: data.totalConfidence / data.count, // Average confidence
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Engagement metrics data
 */
export interface EngagementMetrics {
  totalTweets: number;
  totalRetweets: number;
  totalLikes: number;
  totalReplies: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topTweet: {
    id: string;
    text: string;
    engagementScore: number;
  } | null;
}

/**
 * Calculate overall engagement metrics
 */
export function getEngagementMetrics(dataset: ProcessedDataset): EngagementMetrics {
  let totalRetweets = 0;
  let totalLikes = 0;
  let totalReplies = 0;
  let totalImpressions = 0;

  let topTweetScore = 0;
  let topTweetId = '';
  let topTweetText = '';

  dataset.tweets.forEach((tweet) => {
    const metrics = tweet.public_metrics;
    totalRetweets += metrics.retweet_count;
    totalLikes += metrics.like_count;
    totalReplies += metrics.reply_count;
    totalImpressions += metrics.impression_count;

    // Calculate engagement score (retweets and likes weighted)
    const engagementScore = metrics.retweet_count * 2 + metrics.like_count + metrics.reply_count;

    if (engagementScore > topTweetScore) {
      topTweetScore = engagementScore;
      topTweetId = tweet.id;
      topTweetText = tweet.text;
    }
  });

  const averageEngagementRate =
    totalImpressions > 0
      ? ((totalRetweets + totalLikes + totalReplies) / totalImpressions) * 100
      : 0;

  return {
    totalTweets: dataset.tweets.length,
    totalRetweets,
    totalLikes,
    totalReplies,
    totalImpressions,
    averageEngagementRate,
    topTweet: topTweetId
      ? {
          id: topTweetId,
          text: topTweetText,
          engagementScore: topTweetScore,
        }
      : null,
  };
}

/**
 * User verification distribution
 */
export interface VerificationData {
  name: string;
  value: number;
  color: string;
}

/**
 * Get verification status distribution
 */
export function getVerificationDistribution(dataset: ProcessedDataset): VerificationData[] {
  const verified = dataset.users.filter((user) => user.verified).length;
  const notVerified = dataset.users.length - verified;

  return [
    {
      name: 'Verificados',
      value: verified,
      color: '#3B82F6', // blue
    },
    {
      name: 'No Verificados',
      value: notVerified,
      color: '#6B7280', // gray
    },
  ];
}

/**
 * Engagement by sentiment
 */
export interface SentimentEngagementData {
  name: string;
  retweets: number;
  likes: number;
  replies: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Get engagement metrics grouped by sentiment
 */
export function getEngagementBySentiment(dataset: ProcessedDataset): SentimentEngagementData[] {
  const sentimentMetrics = {
    positive: { retweets: 0, likes: 0, replies: 0 },
    neutral: { retweets: 0, likes: 0, replies: 0 },
    negative: { retweets: 0, likes: 0, replies: 0 },
  };

  dataset.enrichedTweets.forEach((enrichedTweet) => {
    const originalTweet = dataset.tweetMap.get(enrichedTweet.id);
    if (originalTweet) {
      const metrics = sentimentMetrics[enrichedTweet.sentiment];
      if (metrics) {
        metrics.retweets += originalTweet.public_metrics.retweet_count;
        metrics.likes += originalTweet.public_metrics.like_count;
        metrics.replies += originalTweet.public_metrics.reply_count;
      }
    }
  });

  return [
    {
      name: 'Positivo',
      retweets: sentimentMetrics.positive.retweets,
      likes: sentimentMetrics.positive.likes,
      replies: sentimentMetrics.positive.replies,
    },
    {
      name: 'Neutral',
      retweets: sentimentMetrics.neutral.retweets,
      likes: sentimentMetrics.neutral.likes,
      replies: sentimentMetrics.neutral.replies,
    },
    {
      name: 'Negativo',
      retweets: sentimentMetrics.negative.retweets,
      likes: sentimentMetrics.negative.likes,
      replies: sentimentMetrics.negative.replies,
    },
  ];
}
