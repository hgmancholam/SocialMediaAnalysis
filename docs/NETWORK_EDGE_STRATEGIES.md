# Network Edge Creation Strategies

## Overview

The network graph uses multiple strategies to create meaningful connections (edges) between users (nodes). This multi-strategy approach ensures a rich and connected network even when direct interactions (retweets/mentions) are sparse.

## Edge Creation Strategies

### 1. **Direct Interactions** (Strongest Connections)

#### Retweets (Weight: 2.0)
- **Pattern**: `RT @username:`
- **Logic**: When User A retweets User B's content
- **Interpretation**: Strong endorsement and content amplification
- **Example**: User tweets "RT @politician: Important message..."

#### Mentions (Weight: 1.0)
- **Pattern**: `@username` anywhere in tweet
- **Logic**: When User A mentions User B in their tweet
- **Interpretation**: Direct engagement or reference
- **Example**: User tweets "Agree with @analyst on this topic"

### 2. **Geographic Proximity** (Medium Connection)

#### Same Location (Weight: 0.3)
- **Logic**: Users who share the same location string
- **Constraints**: 
  - Only groups of 2-15 users per location
  - Location must be non-empty
- **Interpretation**: Potential local community or regional interest
- **Example**: All users with location "Bogotá" are connected

### 3. **Shared Sentiment** (Weak Connection)

#### Same Dominant Sentiment (Weight: 0.1)
- **Logic**: Users whose tweets have the same dominant sentiment (positive/neutral/negative)
- **Constraints**:
  - Only groups of 2-20 users per sentiment
  - Sentiment determined by majority of user's tweets
- **Interpretation**: Similar emotional tone or perspective
- **Example**: Users with predominantly positive tweets are connected

### 4. **Similar Activity Level** (Very Weak Connection)

#### Activity Ranges (Weight: 0.05)
- **Logic**: Users with similar tweet counts
- **Ranges**:
  - 0-100 tweets (casual users)
  - 100-1,000 tweets (regular users)
  - 1,000-10,000 tweets (active users)
  - 10,000-100,000 tweets (power users)
  - 100,000+ tweets (super users)
- **Constraints**: Only groups of 2-10 users per range
- **Interpretation**: Similar engagement patterns
- **Example**: Users with 5,000-8,000 tweets are connected

## Weight System

Edges can accumulate weight from multiple strategies:

```
Final Weight = Retweet Weight + Mention Weight + Location Weight + Sentiment Weight + Activity Weight
```

**Example Scenarios:**

1. **Strong Connection**: User A retweets User B twice
   - Weight: 2.0 + 2.0 = 4.0

2. **Medium Connection**: User A mentions User B, and they share location
   - Weight: 1.0 + 0.3 = 1.3

3. **Weak Connection**: Users share sentiment and activity level
   - Weight: 0.1 + 0.05 = 0.15

## Visualization Impact

Edge weights affect visualization:
- **Thicker lines**: Higher weight (stronger connection)
- **Color intensity**: Can be mapped to weight
- **Force simulation**: Stronger edges pull nodes closer together

## Benefits of Multi-Strategy Approach

### 1. **Network Density**
- Ensures the network is connected even with sparse direct interactions
- Prevents isolated nodes
- Creates meaningful clusters

### 2. **Multiple Perspectives**
- Direct interactions show explicit relationships
- Sentiment shows ideological alignment
- Geography shows regional patterns
- Activity shows engagement similarity

### 3. **Scalability**
- Constraints prevent over-connection (max group sizes)
- Weight system allows filtering by connection strength
- Strategies can be toggled on/off

### 4. **Analytical Value**
- Can analyze different types of connections separately
- Weight thresholds reveal different network structures
- Community detection works better with richer connections

## Configuration

You can adjust the strategies by modifying `network-builder.ts`:

```typescript
// Adjust weights
edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 2.0); // Retweet weight
edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 1.0); // Mention weight
edgeMap.set(normalizedKey, (edgeMap.get(normalizedKey) || 0) + 0.3); // Location weight
edgeMap.set(normalizedKey, 0.1); // Sentiment weight
edgeMap.set(normalizedKey, 0.05); // Activity weight

// Adjust group size constraints
if (userIds.length >= 2 && userIds.length <= 20) // Sentiment groups
if (userIds.length >= 2 && userIds.length <= 15) // Location groups
if (usersInRange.length >= 2 && usersInRange.length <= 10) // Activity groups
```

## Future Enhancements

Potential additional strategies:

1. **Temporal Proximity**: Connect users who tweet at similar times
2. **Topic Similarity**: Use entity extraction to connect users discussing same topics
3. **Engagement Patterns**: Connect users with similar like/retweet ratios
4. **Follower Overlap**: If follower data available, connect users with shared followers
5. **Hashtag Usage**: Connect users who use similar hashtags

## Performance Considerations

- **Time Complexity**: O(n²) for grouping strategies (sentiment, location, activity)
- **Space Complexity**: O(e) where e is number of edges
- **Optimization**: Group size constraints prevent exponential edge growth
- **Recommendation**: For datasets >1000 users, consider sampling or stricter constraints

---

**Last Updated**: November 13, 2025
