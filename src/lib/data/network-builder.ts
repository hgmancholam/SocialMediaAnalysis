/**
 * Network Data Builder
 *
 * Transforms tweet/user dataset into network graph format
 */

import type { ProcessedDataset } from '@/types/dataset';
import type { Node, Edge } from '@/features/graph/store/network-store';

/**
 * Build network data from the dataset
 * Creates nodes for users and edges based on multiple strategies:
 *
 * Edge Creation Strategies (by weight):
 * 1. Retweets: weight 2.0 - Strong connection (user retweeted another user)
 * 2. Mentions: weight 1.0 - Medium connection (user mentioned another user)
 * 3. Geographic proximity: weight 0.3 - Users in same location
 * 4. Shared sentiment: weight 0.1 - Users with same dominant sentiment
 * 5. Similar activity: weight 0.05 - Users with similar tweet counts
 */
export function buildNetworkFromDataset(dataset: ProcessedDataset): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const edgeMap = new Map<string, number>(); // Track edge weights

  // Create nodes from users
  dataset.users.forEach((user) => {
    // Calculate user's tweet count
    const userTweets = dataset.tweets.filter((t) => t.author_id === user.id);

    // Get enrichment data for user's tweets
    const enrichedTweets = userTweets
      .map((t) => dataset.enrichedTweetMap.get(t.id))
      .filter((et) => et !== undefined);

    // Calculate sentiment distribution
    const sentiments = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    enrichedTweets.forEach((et) => {
      if (et && et.sentiment in sentiments) {
        sentiments[et.sentiment]++;
      }
    });

    // Determine dominant sentiment
    let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (sentiments.positive > sentiments.neutral && sentiments.positive > sentiments.negative) {
      dominantSentiment = 'positive';
    } else if (
      sentiments.negative > sentiments.neutral &&
      sentiments.negative > sentiments.positive
    ) {
      dominantSentiment = 'negative';
    }

    // Construct profile image URL using Twitter/X user ID
    // Pattern: https://x.com/{username}/photo
    const profileImageUrl = `https://x.com/${user.username}/photo`;

    nodes.push({
      id: user.id,
      label: user.username,
      type: dominantSentiment,
      degree: userTweets.length,
      name: user.name,
      location: user.location,
      geo: user.geo,
      followers: user.public_metrics.followers_count,
      following: user.public_metrics.following_count,
      tweetCount: userTweets.length,
      verified: user.verified,
      sentimentDistribution: sentiments,
      profileImageUrl,
    });
  });

  // Strategy 1: Create edges based on retweets and mentions
  dataset.tweets.forEach((tweet) => {
    // Check if it's a retweet (starts with "RT @")
    const rtMatch = tweet.text.match(/^RT @(\w+):/);
    if (rtMatch) {
      const mentionedUsername = rtMatch[1];

      // Find the mentioned user
      const mentionedUser = dataset.users.find(
        (u) => u.username.toLowerCase() === mentionedUsername.toLowerCase()
      );

      if (mentionedUser && mentionedUser.id !== tweet.author_id) {
        const edgeKey = `${tweet.author_id}-${mentionedUser.id}`;
        const reverseKey = `${mentionedUser.id}-${tweet.author_id}`;

        // Use consistent edge direction (lower id first)
        const normalizedKey = tweet.author_id < mentionedUser.id ? edgeKey : reverseKey;

        edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 2.0);
      }
    }

    // Extract @mentions from tweet text
    const mentions = tweet.text.match(/@(\w+)/g);
    if (mentions) {
      mentions.forEach((mention) => {
        const username = mention.substring(1); // Remove @
        const mentionedUser = dataset.users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (mentionedUser && mentionedUser.id !== tweet.author_id) {
          const edgeKey = `${tweet.author_id}-${mentionedUser.id}`;
          const reverseKey = `${mentionedUser.id}-${tweet.author_id}`;

          const normalizedKey = tweet.author_id < mentionedUser.id ? edgeKey : reverseKey;

          edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 1.0);
        }
      });
    }
  });

  // Strategy 2: Create edges based on shared sentiment
  // Connect users who have similar sentiment patterns
  const usersBySentiment = new Map<string, string[]>();
  nodes.forEach((node) => {
    const sentiment = node.type;
    if (!usersBySentiment.has(sentiment)) {
      usersBySentiment.set(sentiment, []);
    }
    usersBySentiment.get(sentiment)!.push(node.id);
  });

  // Connect users with same dominant sentiment (lighter weight)
  usersBySentiment.forEach((userIds) => {
    // Only create edges if there are between 2 and 20 users with this sentiment
    if (userIds.length >= 2 && userIds.length <= 20) {
      for (let i = 0; i < userIds.length; i++) {
        for (let j = i + 1; j < userIds.length; j++) {
          const normalizedKey =
            userIds[i] < userIds[j] ? `${userIds[i]}-${userIds[j]}` : `${userIds[j]}-${userIds[i]}`;

          // Only add if not already connected
          if (!edgeMap.has(normalizedKey)) {
            edgeMap.set(normalizedKey, 0.1);
          }
        }
      }
    }
  });

  // Strategy 3: Create edges based on geographic proximity
  // Connect users who are in the same location or nearby
  const usersByLocation = new Map<string, string[]>();
  nodes.forEach((node) => {
    if (node.location) {
      const location = (node.location as string).toLowerCase().trim();
      if (!usersByLocation.has(location)) {
        usersByLocation.set(location, []);
      }
      usersByLocation.get(location)!.push(node.id);
    }
  });

  // Connect users in same location
  usersByLocation.forEach((userIds) => {
    if (userIds.length >= 2 && userIds.length <= 15) {
      for (let i = 0; i < userIds.length; i++) {
        for (let j = i + 1; j < userIds.length; j++) {
          const normalizedKey =
            userIds[i] < userIds[j] ? `${userIds[i]}-${userIds[j]}` : `${userIds[j]}-${userIds[i]}`;

          // Add or increase weight
          edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 0.3);
        }
      }
    }
  });

  // Strategy 4: Connect users with similar activity levels
  // Group users by tweet count ranges
  const activityRanges = [
    { min: 0, max: 100 },
    { min: 100, max: 1000 },
    { min: 1000, max: 10000 },
    { min: 10000, max: 100000 },
    { min: 100000, max: Infinity },
  ];

  activityRanges.forEach((range) => {
    const usersInRange = nodes.filter((n) => n.degree >= range.min && n.degree < range.max);

    if (usersInRange.length >= 2 && usersInRange.length <= 10) {
      for (let i = 0; i < usersInRange.length; i++) {
        for (let j = i + 1; j < usersInRange.length; j++) {
          const normalizedKey =
            usersInRange[i].id < usersInRange[j].id
              ? `${usersInRange[i].id}-${usersInRange[j].id}`
              : `${usersInRange[j].id}-${usersInRange[i].id}`;

          // Only add if not already connected
          if (!edgeMap.has(normalizedKey)) {
            edgeMap.set(normalizedKey, 0.05);
          }
        }
      }
    }
  });

  // Convert edge map to edge array
  edgeMap.forEach((weight, key) => {
    const [source, target] = key.split('-');
    edges.push({
      source,
      target,
      weight,
      type: 'interaction',
    });
  });

  return { nodes, edges };
}

/**
 * Filter network data based on criteria
 */
export function filterNetwork(
  nodes: Node[],
  edges: Edge[],
  filters: {
    minDegree?: number;
    maxDegree?: number;
    sentiments?: string[];
    hasGeo?: boolean;
    minFollowers?: number;
    searchTerm?: string;
  }
): { nodes: Node[]; edges: Edge[] } {
  let filteredNodes = [...nodes];

  // Apply filters
  if (filters.minDegree !== undefined) {
    filteredNodes = filteredNodes.filter((n) => n.degree >= filters.minDegree!);
  }

  if (filters.maxDegree !== undefined) {
    filteredNodes = filteredNodes.filter((n) => n.degree <= filters.maxDegree!);
  }

  if (filters.sentiments && filters.sentiments.length > 0) {
    filteredNodes = filteredNodes.filter((n) => filters.sentiments!.includes(n.type));
  }

  if (filters.hasGeo) {
    filteredNodes = filteredNodes.filter((n) => n.geo);
  }

  if (filters.minFollowers !== undefined) {
    filteredNodes = filteredNodes.filter((n) => (n.followers as number) >= filters.minFollowers!);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredNodes = filteredNodes.filter(
      (n) =>
        n.label.toLowerCase().includes(term) ||
        (n.name as string)?.toLowerCase().includes(term) ||
        (n.location as string)?.toLowerCase().includes(term)
    );
  }

  // Filter edges to only include those between remaining nodes
  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter((e) => {
    const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
    const targetId = typeof e.target === 'string' ? e.target : e.target.id;
    return nodeIds.has(sourceId) && nodeIds.has(targetId);
  });

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

/**
 * Get network statistics
 */
export function getNetworkStats(nodes: Node[], edges: Edge[]) {
  const totalNodes = nodes.length;
  const totalEdges = edges.length;

  // Calculate average degree
  const totalDegree = nodes.reduce((sum, n) => sum + n.degree, 0);
  const avgDegree = totalNodes > 0 ? totalDegree / totalNodes : 0;

  // Find most connected nodes
  const topNodes = [...nodes].sort((a, b) => b.degree - a.degree).slice(0, 10);

  // Sentiment distribution
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  nodes.forEach((n) => {
    if (n.type in sentimentCounts) {
      sentimentCounts[n.type as keyof typeof sentimentCounts]++;
    }
  });

  // Nodes with geo
  const nodesWithGeo = nodes.filter((n) => n.geo).length;

  return {
    totalNodes,
    totalEdges,
    avgDegree,
    topNodes,
    sentimentCounts,
    nodesWithGeo,
    density: totalNodes > 1 ? (2 * totalEdges) / (totalNodes * (totalNodes - 1)) : 0,
  };
}

/**
 * Detect communities using simple label propagation
 */
export function detectCommunities(nodes: Node[], edges: Edge[]): Node[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n, community: 0 }]));
  const adjacency = new Map<string, Set<string>>();

  // Build adjacency list
  edges.forEach((e) => {
    const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
    const targetId = typeof e.target === 'string' ? e.target : e.target.id;

    if (!adjacency.has(sourceId)) adjacency.set(sourceId, new Set());
    if (!adjacency.has(targetId)) adjacency.set(targetId, new Set());

    adjacency.get(sourceId)!.add(targetId);
    adjacency.get(targetId)!.add(sourceId);
  });

  // Initialize communities
  let communityId = 0;
  nodeMap.forEach((node) => {
    node.community = communityId++;
  });

  // Label propagation (simplified)
  const maxIterations = 10;
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    nodeMap.forEach((node, nodeId) => {
      const neighbors = adjacency.get(nodeId);
      if (!neighbors || neighbors.size === 0) return;

      // Count neighbor communities
      const communityCounts = new Map<number, number>();
      neighbors.forEach((neighborId) => {
        const neighbor = nodeMap.get(neighborId);
        if (neighbor) {
          const count = communityCounts.get(neighbor.community) || 0;
          communityCounts.set(neighbor.community, count + 1);
        }
      });

      // Find most common community
      let maxCount = 0;
      let maxCommunity = node.community;
      communityCounts.forEach((count, community) => {
        if (count > maxCount) {
          maxCount = count;
          maxCommunity = community;
        }
      });

      if (maxCommunity !== node.community) {
        node.community = maxCommunity;
        changed = true;
      }
    });

    if (!changed) break;
  }

  return Array.from(nodeMap.values());
}
