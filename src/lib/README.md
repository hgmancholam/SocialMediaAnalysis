# Lib Directory

This directory contains core libraries, utilities, and third-party integrations. Code here should be framework-agnostic and reusable.

## Structure

### `/arcgis`

ArcGIS Maps SDK for JavaScript integration layer.

**Purpose**: Provide a clean abstraction over the ArcGIS SDK, making it easier to use, test, and upgrade.

**Key Files**:

- `config.ts` - ArcGIS configuration (Portal URL, API keys)
- `auth.ts` - Portal authentication utilities
- `map-factory.ts` - Factory for creating MapView instances
- `layer-factory.ts` - Factory for creating layers
- `types.ts` - ArcGIS-related TypeScript types

**Example**:

```typescript
// lib/arcgis/config.ts
export const arcgisConfig = {
  portalUrl: process.env.NEXT_PUBLIC_ARCGIS_PORTAL_URL,
  clientId: process.env.NEXT_PUBLIC_ARCGIS_CLIENT_ID,
  apiKey: process.env.NEXT_PUBLIC_ARCGIS_API_KEY,
};

// lib/arcgis/map-factory.ts
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';

export const createMapView = async (container: HTMLDivElement) => {
  const map = new Map({
    basemap: 'streets-vector',
  });

  const view = new MapView({
    container,
    map,
    center: [-74.0721, 4.711], // Bogotá
    zoom: 10,
  });

  await view.when();
  return view;
};
```

### `/d3`

D3.js utilities and helpers for graph visualizations.

**Purpose**: Centralize D3 logic for reusability and maintainability.

**Key Files**:

- `scales.ts` - D3 scale functions
- `layouts.ts` - Graph layout algorithms (force, tree, etc.)
- `helpers.ts` - Common D3 utilities

**Example**:

```typescript
// lib/d3/layouts.ts
import * as d3 from 'd3';

export const createForceLayout = (nodes: Node[], links: Link[]) => {
  return d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d: any) => d.id)
    )
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(400, 300));
};
```

### `/api`

API client configuration and setup.

**Purpose**: Configure TanStack Query and base API client for future backend integration.

**Key Files**:

- `client.ts` - Base API client (fetch wrapper)
- `query-client.ts` - TanStack Query configuration

**Example**:

```typescript
// lib/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### `/utils`

General utility functions.

**Purpose**: Provide common utilities used throughout the application.

**Key Files**:

- `cn.ts` - Class name utility (clsx + tailwind-merge)
- `format.ts` - Data formatting functions
- `validation.ts` - Validation helpers

**Example**:

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils/format.ts
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CO').format(num);
};
```

## Guidelines

### 1. Framework Agnostic

Code in `lib/` should not depend on React or Next.js specifics:

✅ **Good**:

```typescript
// lib/utils/calculate.ts
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};
```

❌ **Bad**:

```typescript
// lib/utils/calculate.ts
import { useState } from 'react'; // Don't use React in lib/

export const useCalculateDistance = () => {
  // This belongs in hooks/
  const [distance, setDistance] = useState(0);
  // ...
};
```

### 2. Pure Functions

Prefer pure functions that are easy to test:

```typescript
// lib/utils/transform.ts
export const transformData = (input: RawData): ProcessedData => {
  // Pure transformation, no side effects
  return {
    id: input.id,
    value: input.value * 2,
  };
};
```

### 3. Type Safety

Always provide TypeScript types:

```typescript
// lib/arcgis/types.ts
export interface MapConfig {
  basemap: string;
  center: [number, number];
  zoom: number;
}

export interface LayerConfig {
  id: string;
  url: string;
  visible: boolean;
}
```

### 4. Configuration

Centralize configuration in `lib/`:

```typescript
// lib/arcgis/config.ts
export const arcgisConfig = {
  portalUrl: process.env.NEXT_PUBLIC_ARCGIS_PORTAL_URL || '',
  clientId: process.env.NEXT_PUBLIC_ARCGIS_CLIENT_ID || '',
  defaultBasemap: 'streets-vector',
  defaultCenter: [-74.0721, 4.711] as [number, number],
  defaultZoom: 10,
} as const;
```

### 5. Error Handling

Implement consistent error handling:

```typescript
// lib/api/client.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    return response.json();
  },
};
```

## ArcGIS SDK Integration Best Practices

### 1. Lazy Loading

Load ArcGIS modules only when needed:

```typescript
// lib/arcgis/map-factory.ts
export const createMapView = async (container: HTMLDivElement) => {
  const [MapView, Map] = await Promise.all([
    import('@arcgis/core/views/MapView'),
    import('@arcgis/core/Map'),
  ]);

  // Use default exports
  const map = new Map.default({ basemap: 'streets-vector' });
  const view = new MapView.default({ container, map });

  return view;
};
```

### 2. Resource Cleanup

Provide cleanup utilities:

```typescript
// lib/arcgis/cleanup.ts
import MapView from '@arcgis/core/views/MapView';

export const destroyMapView = (view: MapView | null) => {
  if (view) {
    view.destroy();
  }
};
```

### 3. Event Handling

Wrap ArcGIS events for easier use:

```typescript
// lib/arcgis/events.ts
import MapView from '@arcgis/core/views/MapView';

export const onMapClick = (view: MapView, callback: (event: __esri.ViewClickEvent) => void) => {
  const handle = view.on('click', callback);
  return () => handle.remove(); // Return cleanup function
};
```

## D3.js Integration Best Practices

### 1. Separate Calculation from Rendering

Keep D3 calculations separate from React rendering:

```typescript
// lib/d3/layouts.ts - Pure calculations
export const calculateForceLayout = (
  nodes: Node[],
  links: Link[],
  width: number,
  height: number
) => {
  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  // Run simulation
  simulation.tick(300);
  simulation.stop();

  return { nodes, links };
};
```

### 2. Reusable Scales

Create reusable scale functions:

```typescript
// lib/d3/scales.ts
import * as d3 from 'd3';

export const createColorScale = (domain: string[]) => {
  return d3.scaleOrdinal().domain(domain).range(d3.schemeCategory10);
};

export const createSizeScale = (domain: [number, number]) => {
  return d3.scaleLinear().domain(domain).range([5, 20]);
};
```

## Testing

Utilities in `lib/` should be thoroughly tested:

```typescript
// lib/utils/format.test.ts
import { formatDate, formatNumber } from './format';

describe('format utilities', () => {
  it('should format date in Spanish', () => {
    const date = new Date('2025-10-03');
    expect(formatDate(date)).toBe('3 de octubre de 2025');
  });

  it('should format number with thousands separator', () => {
    expect(formatNumber(1000000)).toBe('1.000.000');
  });
});
```

## Best Practices Summary

1. ✅ Keep code framework-agnostic
2. ✅ Write pure functions when possible
3. ✅ Provide comprehensive TypeScript types
4. ✅ Centralize configuration
5. ✅ Implement consistent error handling
6. ✅ Document complex logic
7. ✅ Write unit tests
8. ✅ Export clean public APIs

## Resources

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [D3.js Documentation](https://d3js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
