# Features Directory

This directory contains feature-based modules following Domain-Driven Design principles. Each feature is self-contained with its own components, hooks, services, store, and types.

## Structure

Each feature follows this structure:

```
feature-name/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific React hooks
├── services/       # Business logic and external integrations
├── store/          # Feature state management (Zustand)
├── types.ts        # TypeScript type definitions
└── index.ts        # Public API exports
```

## Features

### `/auth`

Authentication and authorization feature.

**Responsibilities**:

- Portal for ArcGIS OAuth integration
- User session management
- Login/logout flows
- Token management and refresh

**Key Files**:

- `services/auth-service.ts` - ArcGIS Portal authentication
- `store/auth-store.ts` - Auth state (user, token, session)
- `hooks/useAuth.ts` - Auth hook for components

### `/map`

Map visualization and interaction feature.

**Responsibilities**:

- ArcGIS MapView management
- Layer management and visibility
- Map controls and tools
- Feature selection and highlighting

**Key Files**:

- `services/map-service.ts` - Map business logic
- `store/map-store.ts` - Map state (extent, layers, selections)
- `hooks/useMapView.ts` - React hook for MapView
- `hooks/useMapLayers.ts` - Layer management hook

### `/graph`

Graph visualization feature using D3.js.

**Responsibilities**:

- Social media data visualization
- Node-link diagram rendering
- Graph interactions (zoom, pan, select)
- Graph layout algorithms

**Key Files**:

- `services/graph-service.ts` - Graph data processing
- `store/graph-store.ts` - Graph state (selections, filters)
- `hooks/useGraphData.ts` - Graph data hook
- `hooks/useGraphLayout.ts` - Layout calculation hook

### `/social-media`

Social media data management feature.

**Responsibilities**:

- Load and parse social media data
- Data transformation and filtering
- Coordinate with map and graph features

**Key Files**:

- `services/data-service.ts` - Data loading and processing
- `store/social-media-store.ts` - Social media data state
- `hooks/useSocialMediaData.ts` - Data access hook

## Feature Development Guidelines

### 1. Feature Isolation

- Features should be loosely coupled
- Communicate through stores or events
- Avoid direct imports between features

### 2. Public API

Each feature should export a clean public API through `index.ts`:

```typescript
// features/auth/index.ts
export { useAuth } from './hooks/useAuth';
export { authService } from './services/auth-service';
export { useAuthStore } from './store/auth-store';
export type { User, AuthState } from './types';
```

### 3. Service Layer Pattern

Services contain business logic and external integrations:

```typescript
// features/map/services/map-service.ts
export class MapService {
  async createMapView(container: HTMLDivElement): Promise<MapView> {
    // ArcGIS SDK integration
  }

  async addLayer(layer: Layer): Promise<void> {
    // Layer management logic
  }
}

export const mapService = new MapService();
```

### 4. Store Pattern (Zustand)

Each feature can have its own Zustand store:

```typescript
// features/map/store/map-store.ts
import { create } from 'zustand';

interface MapState {
  mapView: MapView | null;
  selectedFeatures: Graphic[];
  setMapView: (view: MapView) => void;
  setSelectedFeatures: (features: Graphic[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  mapView: null,
  selectedFeatures: [],
  setMapView: (view) => set({ mapView: view }),
  setSelectedFeatures: (features) => set({ selectedFeatures: features }),
}));
```

### 5. Custom Hooks

Hooks provide React integration for services and stores:

```typescript
// features/map/hooks/useMapView.ts
import { useEffect } from 'react';
import { useMapStore } from '../store/map-store';
import { mapService } from '../services/map-service';

export const useMapView = (containerRef: RefObject<HTMLDivElement>) => {
  const { mapView, setMapView } = useMapStore();

  useEffect(() => {
    if (containerRef.current) {
      mapService.createMapView(containerRef.current).then(setMapView);
    }

    return () => {
      mapView?.destroy();
    };
  }, []);

  return mapView;
};
```

## Inter-Feature Communication

### Option 1: Shared Stores

Features can subscribe to other feature stores:

```typescript
// In graph component
const selectedFeatures = useMapStore((state) => state.selectedFeatures);
```

### Option 2: Event Bus (Future)

For complex interactions, consider an event bus:

```typescript
eventBus.emit('feature:selected', { featureId: '123' });
eventBus.on('feature:selected', (data) => {
  /* handle */
});
```

### Option 3: Callback Props

Pass callbacks through component props for direct communication.

## Testing Features

Each feature should be testable in isolation:

```typescript
// features/map/services/map-service.test.ts
import { mapService } from './map-service';

describe('MapService', () => {
  it('should create map view', async () => {
    const container = document.createElement('div');
    const view = await mapService.createMapView(container);
    expect(view).toBeDefined();
  });
});
```

## Adding a New Feature

1. Create feature directory: `features/new-feature/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `store/`
3. Create `types.ts` for TypeScript definitions
4. Create `index.ts` to export public API
5. Implement service layer first
6. Add Zustand store if needed
7. Create React hooks
8. Build components
9. Update this README

## Best Practices

1. **Single Responsibility**: Each feature handles one domain
2. **Dependency Direction**: Features depend on `lib/`, not vice versa
3. **Type Safety**: Export and use TypeScript types
4. **Documentation**: Document complex business logic
5. **Error Handling**: Handle errors gracefully in services
6. **Performance**: Memoize expensive operations
7. **Testability**: Write testable, pure functions

## Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
