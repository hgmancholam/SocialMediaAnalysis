/**
 * User Influence Service
 *
 * Calculates user influence scores based on social media metrics
 */

import type { User } from '@/types/dataset';

/**
 * Influence score for a user with geographic location
 */
export interface UserInfluence {
  userId: string;
  username: string;
  name: string;
  longitude: number;
  latitude: number;
  influenceScore: number;
  normalizedScore: number; // 0-1 scale
  metrics: {
    followers: number;
    following: number;
    tweets: number;
    listed: number;
  };
}

/**
 * Configuration for influence calculation
 */
export interface InfluenceConfig {
  followerWeight?: number;
  followingWeight?: number;
  tweetWeight?: number;
  listedWeight?: number;
  verifiedBonus?: number;
}

const DEFAULT_CONFIG: Required<InfluenceConfig> = {
  followerWeight: 0.5, // Followers are most important
  followingWeight: 0.1, // Following count has minimal impact
  tweetWeight: 0.2, // Activity matters
  listedWeight: 0.15, // Being listed indicates authority
  verifiedBonus: 1.2, // 20% bonus for verified users
};

/**
 * Calculate influence score for a user
 */
export function calculateUserInfluence(
  user: User,
  config: InfluenceConfig = {}
): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const metrics = user.public_metrics;

  // Calculate weighted score
  let score =
    metrics.followers_count * cfg.followerWeight +
    metrics.following_count * cfg.followingWeight +
    metrics.tweet_count * cfg.tweetWeight +
    metrics.listed_count * cfg.listedWeight;

  // Apply verification bonus
  if (user.verified) {
    score *= cfg.verifiedBonus;
  }

  return score;
}

/**
 * Get all users with geographic coordinates and their influence scores
 */
export function getUsersWithInfluence(
  users: User[],
  config?: InfluenceConfig
): UserInfluence[] {
  // Filter users with valid geographic coordinates
  const geoUsers = users.filter(
    (user) => user.geo && user.geo.x !== undefined && user.geo.y !== undefined
  );

  // Calculate influence scores
  const usersWithScores = geoUsers.map((user) => ({
    userId: user.id,
    username: user.username,
    name: user.name,
    longitude: user.geo!.x,
    latitude: user.geo!.y,
    influenceScore: calculateUserInfluence(user, config),
    normalizedScore: 0, // Will be calculated below
    metrics: {
      followers: user.public_metrics.followers_count,
      following: user.public_metrics.following_count,
      tweets: user.public_metrics.tweet_count,
      listed: user.public_metrics.listed_count,
    },
  }));

  // Normalize scores to 0-1 range
  if (usersWithScores.length > 0) {
    const maxScore = Math.max(...usersWithScores.map((u) => u.influenceScore));
    const minScore = Math.min(...usersWithScores.map((u) => u.influenceScore));
    const range = maxScore - minScore;

    usersWithScores.forEach((user) => {
      user.normalizedScore = range > 0 ? (user.influenceScore - minScore) / range : 0.5;
    });
  }

  return usersWithScores;
}

/**
 * Get top influential users by region
 */
export function getTopInfluentialUsers(
  users: UserInfluence[],
  limit: number = 10
): UserInfluence[] {
  return [...users].sort((a, b) => b.influenceScore - a.influenceScore).slice(0, limit);
}

/**
 * Calculate size for point symbol based on normalized score
 * Returns size in pixels
 */
export function calculatePointSize(
  normalizedScore: number,
  minSize: number = 8,
  maxSize: number = 40
): number {
  return minSize + normalizedScore * (maxSize - minSize);
}

/**
 * Get color for influence level
 */
export function getInfluenceColor(normalizedScore: number): [number, number, number, number] {
  // Color gradient: Low (yellow) -> Medium (orange) -> High (red)
  if (normalizedScore < 0.33) {
    // Low influence: Yellow to Orange
    const t = normalizedScore / 0.33;
    return [
      Math.round(255),
      Math.round(220 - t * 60), // 220 -> 160
      Math.round(50 + t * 10), // 50 -> 60
      255,
    ];
  } else if (normalizedScore < 0.66) {
    // Medium influence: Orange to Red-Orange
    const t = (normalizedScore - 0.33) / 0.33;
    return [
      Math.round(255),
      Math.round(160 - t * 50), // 160 -> 110
      Math.round(60 - t * 30), // 60 -> 30
      255,
    ];
  } else {
    // High influence: Red-Orange to Deep Red
    const t = (normalizedScore - 0.66) / 0.34;
    return [
      Math.round(255 - t * 35), // 255 -> 220
      Math.round(110 - t * 60), // 110 -> 50
      Math.round(30 - t * 10), // 30 -> 20
      255,
    ];
  }
}

/**
 * Service class for managing user influence calculations
 */
class UserInfluenceService {
  private cachedInfluenceData: UserInfluence[] | null = null;
  private config: InfluenceConfig = DEFAULT_CONFIG;

  /**
   * Set configuration for influence calculation
   */
  setConfig(config: InfluenceConfig): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cachedInfluenceData = null; // Clear cache when config changes
  }

  /**
   * Calculate and cache influence data for all users
   */
  calculateInfluence(users: User[]): UserInfluence[] {
    this.cachedInfluenceData = getUsersWithInfluence(users, this.config);
    return this.cachedInfluenceData;
  }

  /**
   * Get cached influence data
   */
  getCachedInfluence(): UserInfluence[] | null {
    return this.cachedInfluenceData;
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.cachedInfluenceData = null;
  }

  /**
   * Get top influential users
   */
  getTopUsers(limit: number = 10): UserInfluence[] {
    if (!this.cachedInfluenceData) {
      return [];
    }
    return getTopInfluentialUsers(this.cachedInfluenceData, limit);
  }
}

export const userInfluenceService = new UserInfluenceService();
