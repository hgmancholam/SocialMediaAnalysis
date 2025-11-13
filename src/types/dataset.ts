/**
 * Dataset Type Definitions
 *
 * Types for the Twitter/X dataset including tweets, users, and enriched data
 */

/**
 * Public metrics for tweets
 */
export interface TweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
}

/**
 * Base tweet structure from the dataset
 */
export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  lang: string;
  possibly_sensitive: boolean;
  public_metrics: TweetPublicMetrics;
  edit_history_tweet_ids: string[];
}

/**
 * Public metrics for users
 */
export interface UserPublicMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count: number;
  media_count: number;
}

/**
 * Geographic coordinates for users
 */
export interface GeoCoordinates {
  x: number; // longitude
  y: number; // latitude
}

/**
 * User structure from the dataset
 */
export interface User {
  id: string;
  name: string;
  username: string;
  location?: string;
  geo?: GeoCoordinates;
  public_metrics: UserPublicMetrics;
  verified: boolean;
  created_at: string;
}

/**
 * Sentiment analysis confidence scores
 */
export interface ConfidenceScores {
  positive: number;
  neutral: number;
  negative: number;
}

/**
 * Named entity from text analysis
 */
export interface NamedEntity {
  text: string;
  category: string;
  confidence: number;
}

/**
 * Enriched tweet with sentiment analysis and entity extraction
 */
export interface EnrichedTweet {
  id: string;
  text: string;
  created_at: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence_scores: ConfidenceScores;
  entities: NamedEntity[];
  geo: GeoCoordinates | null;
}

/**
 * Complete dataset structure
 */
export interface Dataset {
  tweets: Tweet[];
  users: Record<string, User>; // Dictionary keyed by user ID
  enriched_tweets: EnrichedTweet[];
}

/**
 * Processed dataset with normalized structure
 */
export interface ProcessedDataset {
  tweets: Tweet[];
  users: User[];
  enrichedTweets: EnrichedTweet[];
  userMap: Map<string, User>;
  tweetMap: Map<string, Tweet>;
  enrichedTweetMap: Map<string, EnrichedTweet>;
}

/**
 * Tweet with full user information and enrichment data
 */
export interface FullTweet extends Tweet {
  user: User;
  enrichment?: EnrichedTweet;
}

/**
 * Statistics for the dataset
 */
export interface DatasetStats {
  totalTweets: number;
  totalUsers: number;
  totalEnrichedTweets: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topEntities: Array<{
    text: string;
    category: string;
    count: number;
  }>;
  usersWithGeo: number;
}
