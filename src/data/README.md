# Data Directory

This directory contains static data files used by the application.

## Structure

```
data/
└── config/                    # Configuration data
    ├── map-layers.json
    └── app-config.json
```

**Note**: The main dataset is located at `public/data/dataset.json`

## Social Media Data

The main dataset is located at `public/data/dataset.json` and contains real Twitter/X data with the following structure:

### Dataset Structure

```json
{
  "tweets": [
    {
      "id": "1988417065263526146",
      "text": "Tweet content...",
      "author_id": "2216136195",
      "created_at": "2025-11-12T01:22:26.000Z",
      "lang": "es",
      "possibly_sensitive": false,
      "public_metrics": {
        "retweet_count": 409,
        "reply_count": 0,
        "like_count": 0,
        "quote_count": 0,
        "bookmark_count": 0,
        "impression_count": 0
      },
      "edit_history_tweet_ids": ["1988417065263526146"]
    }
  ],
  "users": {
    "2216136195": {
      "id": "2216136195",
      "name": "User Name",
      "username": "username",
      "created_at": "2013-11-28T05:06:00.000Z",
      "description": "User bio...",
      "public_metrics": {
        "followers_count": 1234,
        "following_count": 567,
        "tweet_count": 8901,
        "listed_count": 12
      }
    }
  },
  "places": {},
  "sentimiento": [
    {
      "id": "1988417065263526146",
      "text": "Tweet content...",
      "sentiment": "neutral",
      "sentiment_score": 0.5,
      "geo": null
    }
  ]
}
```

### Main Collections

#### Tweets

- `id`: Unique tweet identifier
- `text`: Tweet content
- `author_id`: User ID who created the tweet
- `created_at`: ISO 8601 formatted date-time
- `lang`: Language code (e.g., "es", "en")
- `public_metrics`: Engagement metrics (retweets, likes, replies, etc.)
- `edit_history_tweet_ids`: Array of tweet IDs in edit history

#### Users

- Key-value pairs where key is user ID
- Contains user profile information
- Includes follower counts, bio, creation date, etc.

#### Sentimiento (Sentiment Analysis)

- Array of sentiment analysis results for each tweet
- Includes sentiment classification and scores
- `geo`: Geographic data (if available)

## Configuration Data

### Map Layers Configuration

```json
{
  "layers": [
    {
      "id": "highways",
      "title": "Highways",
      "type": "feature",
      "url": "https://services.arcgis.com/...",
      "visible": true,
      "opacity": 1.0
    }
  ]
}
```

### App Configuration

```json
{
  "features": {
    "analytics": true,
    "export": false
  },
  "ui": {
    "defaultTheme": "light",
    "showWelcome": true
  }
}
```

## Usage

### Loading Data in Components

```typescript
// Using the data loader utility
import { useDataset } from '@/lib/data/useDataset';

function MyComponent() {
  const { data, isLoading, error } = useDataset();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const tweets = data?.tweets || [];
  // Use tweets data
}
```

### Loading Data Dynamically

```typescript
const loadDataset = async () => {
  const response = await fetch('/data/dataset.json');
  const data = await response.json();
  return data;
};
```

## Data Preparation

### Steps to Update the Dataset

1. **Prepare your data** in the Twitter API v2 JSON format
2. **Validate** the JSON structure
3. **Save** as `dataset.json` in `public/data/`
4. **Test** by loading in the application

### Data Validation

Ensure your data includes:

- Valid JSON syntax
- Required fields for all tweets (id, text, author_id, created_at)
- Valid ISO 8601 timestamps
- User information in the `users` object
- Sentiment analysis in the `sentimiento` array (if available)

### Current Dataset

The file `public/data/dataset.json` contains real Twitter/X data with tweets, user information, and sentiment analysis.

## Best Practices

1. **Keep files small**: For large datasets, consider splitting into multiple files
2. **Use compression**: Minify JSON for production
3. **Version your data**: Include version in metadata
4. **Document sources**: Always include data source in metadata
5. **Validate coordinates**: Ensure locations are within the expected region

## Future Enhancements

When moving to API-driven data:

- Replace static JSON with API calls
- Use TanStack Query for data fetching
- Implement caching strategies
- Add real-time updates

---

**Note**: The example file is for reference only. Replace with your actual data.
