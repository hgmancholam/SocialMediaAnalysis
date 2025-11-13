# Quick Start Implementation Guide

## Priority 1: Core Data Processing

### Step 1: Create Data Models
```typescript
// src/types/dataset.ts
export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  location?: string;
  geo?: { x: number; y: number };
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface EnrichedTweet extends Tweet {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence_scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  entities: Array<{
    text: string;
    category: string;
    confidence: number;
  }>;
}
```

### Step 2: Data Loader
```typescript
// src/lib/data/loader.ts
export async function loadDataset() {
  const response = await fetch('/data/dataset.json');
  const data = await response.json();
  return {
    tweets: data.tweets,
    users: data.users,
    enrichedTweets: data.enriched_tweets || []
  };
}
```

## Priority 2: Map Implementation

### Step 1: Basic Map Component
```typescript
// src/components/map/MapView.tsx
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';

export function GISMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = new Map({ basemap: 'streets-vector' });
    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-74.0721, 4.7110], // Bogotá
      zoom: 6
    });
    
    return () => view.destroy();
  }, []);
  
  return <div ref={mapRef} className="w-full h-full" />;
}
```

## Priority 3: Network Graph

### Step 1: Install Cytoscape
```bash
npm install cytoscape @types/cytoscape
```

### Step 2: Network Component
```typescript
// src/components/graph/NetworkGraph.tsx
import cytoscape from 'cytoscape';

export function NetworkGraph({ users, tweets }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cy = cytoscape({
      container: containerRef.current,
      elements: buildNetworkData(users, tweets),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'width': 'data(size)',
            'height': 'data(size)',
            'label': 'data(label)'
          }
        }
      ],
      layout: { name: 'cose' }
    });
    
    return () => cy.destroy();
  }, [users, tweets]);
  
  return <div ref={containerRef} className="w-full h-full" />;
}
```

## Priority 4: State Management

```typescript
// src/store/appStore.ts
import { create } from 'zustand';

interface AppState {
  selectedUser: User | null;
  sentimentFilter: string[];
  setSelectedUser: (user: User | null) => void;
  setSentimentFilter: (filter: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedUser: null,
  sentimentFilter: [],
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSentimentFilter: (filter) => set({ sentimentFilter: filter })
}));
```

## Next Steps

1. Implement user markers on map
2. Add click handlers for selection
3. Connect map and network views
4. Add filter controls
5. Implement animations
