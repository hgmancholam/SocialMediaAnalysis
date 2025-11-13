# Development Guide

Comprehensive guide for developing features in the Net Frontend application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [UX-First Development](#ux-first-development) ⭐ **NEW**
3. [Code Organization](#code-organization)
4. [Development Patterns](#development-patterns)
5. [Feature Development](#feature-development)
6. [Component Development](#component-development)
7. [State Management](#state-management)
8. [ArcGIS Integration](#arcgis-integration)
9. [D3.js Visualization](#d3js-visualization)
10. [Styling Guidelines](#styling-guidelines)
11. [Testing](#testing)
12. [Best Practices](#best-practices)

## Getting Started

### Development Environment

```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

### File Creation Checklist

When creating new files:

- ✅ Use TypeScript (`.ts` or `.tsx`)
- ✅ Add JSDoc comments for complex functions
- ✅ Export types alongside implementations
- ✅ Follow naming conventions
- ✅ Add to appropriate `index.ts` for clean imports

---

## UX-First Development

### Core Principle

> **La experiencia de usuario es la prioridad #1 en todas las decisiones de desarrollo.**

### UX Guidelines

#### 1. **Accesibilidad (WCAG 2.1 AA)**

```typescript
// ✅ SIEMPRE usar Radix UI para componentes interactivos
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// Beneficios:
// - Keyboard navigation automática
// - ARIA attributes correctos
// - Screen reader support
// - Focus management
```

#### 2. **Animaciones y Feedback Visual**

```typescript
// ✅ Usar Framer Motion para todas las animaciones
import { motion, AnimatePresence } from 'framer-motion';

// Ejemplo: Panel lateral expandible
<motion.div
  initial={{ width: 0, opacity: 0 }}
  animate={{ width: isOpen ? 420 : 0, opacity: isOpen ? 1 : 0 }}
  exit={{ width: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  {/* Contenido del panel */}
</motion.div>

// Principios:
// - Duración: 200-400ms para la mayoría de animaciones
// - Easing: ease-in-out para natural feel
// - NO abusar: solo animar cambios significativos
```

#### 3. **Loading States y Skeletons**

```typescript
// ✅ SIEMPRE mostrar feedback durante carga
import { Skeleton } from '@/components/ui/skeleton';

function DataCard({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  return <div>{/* Datos reales */}</div>;
}
```

#### 4. **Toast Notifications para Feedback**

```typescript
// ✅ Usar Sonner para notificaciones
import { toast } from 'sonner';

// Success
toast.success('Datos guardados correctamente');

// Error con acción
toast.error('Error al cargar el mapa', {
  action: {
    label: 'Reintentar',
    onClick: () => retryLoadMap(),
  },
});

// Loading con promise
toast.promise(saveData(), {
  loading: 'Guardando...',
  success: 'Guardado exitosamente',
  error: 'Error al guardar',
});
```

#### 5. **Responsive Design (Mobile-First)**

```typescript
// ✅ Usar Tailwind breakpoints
<div className="
  w-full                    // Mobile: ancho completo
  md:w-1/2                  // Tablet: mitad
  lg:w-1/3                  // Desktop: tercio
  p-4 md:p-6 lg:p-8         // Padding responsive
">
  {/* Contenido */}
</div>

// Breakpoints:
// - sm: 640px  (móvil grande)
// - md: 768px  (tablet)
// - lg: 1024px (desktop)
// - xl: 1280px (desktop grande)
```

#### 6. **Performance: Virtual Scrolling**

```typescript
// ✅ Usar TanStack Virtual para listas largas
import { useVirtualizer } from '@tanstack/react-virtual';

function LargeList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // altura estimada del item
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{ height: `${virtualizer.getTotalSize()}px` }}
        className="relative"
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {/* Renderizar item */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 7. **Command Palette para Power Users**

```typescript
// ✅ Implementar con cmdk
import { Command } from 'cmdk';

function CommandPalette() {
  return (
    <Command>
      <Command.Input placeholder="Buscar..." />
      <Command.List>
        <Command.Group heading="Acciones">
          <Command.Item onSelect={() => navigate('/map')}>
            Ir al Mapa
          </Command.Item>
          <Command.Item onSelect={() => openFilters()}>
            Abrir Filtros
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  );
}

// Shortcut: Ctrl+K / Cmd+K
```

#### 8. **Gestos Táctiles y Drag**

```typescript
// ✅ Usar @use-gesture/react para interacciones táctiles
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

function DraggableNode({ id, position }) {
  const [{ x, y }, api] = useSpring(() => ({ x: position.x, y: position.y }));

  const bind = useDrag(({ offset: [ox, oy] }) => {
    api.start({ x: ox, y: oy });
  });

  return (
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: 'none' }}
    >
      {/* Nodo del grafo */}
    </animated.div>
  );
}
```

#### 9. **Error Handling Graceful**

```typescript
// ✅ Error Boundaries para capturar errores
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">
        Algo salió mal
      </h2>
      <p className="text-red-600 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Reintentar
      </button>
    </div>
  );
}

// Uso:
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MapContainer />
</ErrorBoundary>
```

#### 10. **Optimización de Re-renders**

```typescript
// ✅ Usar memo y useMemo apropiadamente
import { memo, useMemo } from 'react';

// Componente pesado que no debe re-renderizar innecesariamente
const ExpensiveChart = memo(({ data, config }) => {
  const processedData = useMemo(() => {
    return data.map(/* procesamiento pesado */);
  }, [data]);

  return <Chart data={processedData} config={config} />;
});
```

### UX Checklist para Cada Feature

Antes de considerar una feature "completa", verificar:

- [ ] ✅ **Accesibilidad**: ¿Funciona con teclado? ¿ARIA correcto?
- [ ] ✅ **Loading States**: ¿Hay skeleton/spinner durante carga?
- [ ] ✅ **Error Handling**: ¿Qué pasa si falla? ¿Se muestra error amigable?
- [ ] ✅ **Feedback**: ¿El usuario sabe que su acción fue exitosa?
- [ ] ✅ **Responsive**: ¿Funciona en móvil, tablet y desktop?
- [ ] ✅ **Performance**: ¿Lista larga? → Virtual scrolling
- [ ] ✅ **Animaciones**: ¿Transiciones suaves y naturales?
- [ ] ✅ **Touch**: ¿Funciona con gestos táctiles?
- [ ] ✅ **Empty States**: ¿Qué se muestra cuando no hay datos?
- [ ] ✅ **Keyboard Shortcuts**: ¿Hay atajos para power users?

---

## Code Organization

### Import Order

Follow this import order for consistency:

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { create } from 'zustand';

// 2. Internal libraries and utilities
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

// 3. Components
import { Button } from '@/components/ui/button';
import { MapContainer } from '@/components/map/MapContainer';

// 4. Hooks
import { useMapStore } from '@/features/map/store/map-store';
import { useDebounce } from '@/hooks/useDebounce';

// 5. Types
import type { MapConfig } from '@/lib/arcgis/types';

// 6. Constants and config
import { MAP_CONSTANTS } from '@/config/constants';

// 7. Styles (if any)
import styles from './Component.module.css';
```

### Path Aliases

Use the `@/` alias for clean imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';

// ❌ Bad
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../features/auth';
```

## Development Patterns

### Feature Module Pattern

Each feature follows this structure:

```
features/feature-name/
├── components/          # Feature-specific components
│   └── FeatureComponent.tsx
├── hooks/              # Feature-specific hooks
│   └── useFeatureData.ts
├── services/           # Business logic
│   └── feature-service.ts
├── store/              # State management
│   └── feature-store.ts
├── types.ts            # Type definitions
└── index.ts            # Public API
```

#### Example: Creating a New Feature

```typescript
// features/analytics/index.ts
export { AnalyticsPanel } from './components/AnalyticsPanel';
export { useAnalytics } from './hooks/useAnalytics';
export { analyticsService } from './services/analytics-service';
export { useAnalyticsStore } from './store/analytics-store';
export type { AnalyticsData, AnalyticsConfig } from './types';
```

### Service Layer Pattern

Services encapsulate business logic:

```typescript
// features/map/services/map-service.ts
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import { arcgisConfig } from '@/lib/arcgis/config';

class MapService {
  private mapView: MapView | null = null;

  async createMapView(container: HTMLDivElement): Promise<MapView> {
    const map = new Map({
      basemap: arcgisConfig.map.basemap,
    });

    this.mapView = new MapView({
      container,
      map,
      center: arcgisConfig.map.center,
      zoom: arcgisConfig.map.zoom,
    });

    await this.mapView.when();
    return this.mapView;
  }

  async addLayer(layer: __esri.Layer): Promise<void> {
    if (!this.mapView) {
      throw new Error('MapView not initialized');
    }
    this.mapView.map.add(layer);
  }

  destroy(): void {
    if (this.mapView) {
      this.mapView.destroy();
      this.mapView = null;
    }
  }
}

export const mapService = new MapService();
```

### Store Pattern (Zustand)

```typescript
// features/map/store/map-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MapView, Graphic } from '@/lib/arcgis/types';

interface MapState {
  // State
  mapView: MapView | null;
  selectedFeatures: Graphic[];
  isLoading: boolean;

  // Actions
  setMapView: (view: MapView | null) => void;
  setSelectedFeatures: (features: Graphic[]) => void;
  addSelectedFeature: (feature: Graphic) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      // Initial state
      mapView: null,
      selectedFeatures: [],
      isLoading: false,

      // Actions
      setMapView: (view) => set({ mapView: view }),
      setSelectedFeatures: (features) => set({ selectedFeatures: features }),
      addSelectedFeature: (feature) =>
        set((state) => ({
          selectedFeatures: [...state.selectedFeatures, feature],
        })),
      clearSelection: () => set({ selectedFeatures: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'MapStore' }
  )
);
```

### Custom Hook Pattern

```typescript
// features/map/hooks/useMapView.ts
import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/map-store';
import { mapService } from '../services/map-service';

export const useMapView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapView, setMapView, setLoading } = useMapStore();

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!containerRef.current) return;

      try {
        setLoading(true);
        const view = await mapService.createMapView(containerRef.current);

        if (mounted) {
          setMapView(view);
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      mapService.destroy();
      setMapView(null);
    };
  }, []);

  return { containerRef, mapView };
};
```

## Feature Development

### Step-by-Step: Adding a New Feature

#### 1. Create Feature Directory

```bash
mkdir -p src/features/my-feature/{components,hooks,services,store}
```

#### 2. Define Types

```typescript
// features/my-feature/types.ts
export interface MyFeatureData {
  id: string;
  name: string;
  value: number;
}

export interface MyFeatureConfig {
  enabled: boolean;
  threshold: number;
}
```

#### 3. Create Service

```typescript
// features/my-feature/services/my-feature-service.ts
import type { MyFeatureData } from '../types';

class MyFeatureService {
  async fetchData(): Promise<MyFeatureData[]> {
    // Implementation
    return [];
  }

  async processData(data: MyFeatureData[]): Promise<MyFeatureData[]> {
    // Implementation
    return data;
  }
}

export const myFeatureService = new MyFeatureService();
```

#### 4. Create Store

```typescript
// features/my-feature/store/my-feature-store.ts
import { create } from 'zustand';
import type { MyFeatureData } from '../types';

interface MyFeatureState {
  data: MyFeatureData[];
  setData: (data: MyFeatureData[]) => void;
}

export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));
```

#### 5. Create Hook

```typescript
// features/my-feature/hooks/useMyFeature.ts
import { useEffect } from 'react';
import { useMyFeatureStore } from '../store/my-feature-store';
import { myFeatureService } from '../services/my-feature-service';

export const useMyFeature = () => {
  const { data, setData } = useMyFeatureStore();

  useEffect(() => {
    const loadData = async () => {
      const result = await myFeatureService.fetchData();
      setData(result);
    };

    loadData();
  }, []);

  return { data };
};
```

#### 6. Create Component

```typescript
// features/my-feature/components/MyFeatureComponent.tsx
import { FC } from 'react';
import { useMyFeature } from '../hooks/useMyFeature';

export const MyFeatureComponent: FC = () => {
  const { data } = useMyFeature();

  return (
    <div>
      <h2>My Feature</h2>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

#### 7. Export Public API

```typescript
// features/my-feature/index.ts
export { MyFeatureComponent } from './components/MyFeatureComponent';
export { useMyFeature } from './hooks/useMyFeature';
export { myFeatureService } from './services/my-feature-service';
export { useMyFeatureStore } from './store/my-feature-store';
export type { MyFeatureData, MyFeatureConfig } from './types';
```

## Component Development

### Component Template

```typescript
// components/category/ComponentName.tsx
import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ComponentNameProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  onAction?: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({
  title,
  description,
  children,
  className,
  onAction,
}) => {
  return (
    <div className={cn('base-classes', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {children}
      {onAction && (
        <button onClick={onAction} className="btn-primary">
          Action
        </button>
      )}
    </div>
  );
};
```

### Component Best Practices

1. **Props Interface**: Always define props interface
2. **Default Props**: Use default parameters
3. **Memoization**: Use `React.memo` for expensive components
4. **Event Handlers**: Prefix with `on` or `handle`
5. **Conditional Rendering**: Use `&&` or ternary operators
6. **Accessibility**: Include ARIA labels and keyboard navigation

## State Management

### When to Use Each Solution

#### Local State (useState)

- Form inputs
- Toggle states
- Temporary UI state

```typescript
const [isOpen, setIsOpen] = useState(false);
```

#### Zustand Store

- Shared UI state
- Feature-specific state
- Cross-component state

```typescript
const { sidebarOpen, toggleSidebar } = useUIStore();
```

#### TanStack Query

- Server data
- API calls
- Cached data

```typescript
const { data, isLoading } = useQuery({
  queryKey: queryKeys.socialMedia.list(),
  queryFn: fetchSocialMediaData,
});
```

## ArcGIS Integration

### Loading ArcGIS Modules

```typescript
// Lazy load modules
const loadArcGISModules = async () => {
  const [MapView, Map, FeatureLayer] = await Promise.all([
    import('@arcgis/core/views/MapView'),
    import('@arcgis/core/Map'),
    import('@arcgis/core/layers/FeatureLayer'),
  ]);

  return {
    MapView: MapView.default,
    Map: Map.default,
    FeatureLayer: FeatureLayer.default,
  };
};
```

### Event Handling

```typescript
// Proper event cleanup
useEffect(() => {
  if (!mapView) return;

  const handle = mapView.on('click', (event) => {
    console.log('Map clicked:', event);
  });

  return () => {
    handle.remove();
  };
}, [mapView]);
```

## D3.js Visualization

### D3 with React Pattern

```typescript
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const D3Chart = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    // D3 rendering logic
    const g = svg.append('g');

    // ... D3 code

  }, [data]);

  return <svg ref={svgRef} width={800} height={600} />;
};
```

## Styling Guidelines

### Tailwind CSS Classes

```typescript
// Use cn() utility for conditional classes
<div className={cn(
  'base-class',
  'another-class',
  condition && 'conditional-class',
  variant === 'primary' && 'primary-variant',
  className
)} />
```

### Component Variants

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('inline-flex items-center justify-center rounded-md font-medium', {
  variants: {
    variant: {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 bg-transparent',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

## Testing

### Unit Test Example

```typescript
// features/map/services/map-service.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mapService } from './map-service';

describe('MapService', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    mapService.destroy();
  });

  it('should create map view', async () => {
    const view = await mapService.createMapView(container);
    expect(view).toBeDefined();
    expect(view.container).toBe(container);
  });
});
```

## Best Practices

### 1. Error Handling

```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to fetch data:', error);
  // Show user-friendly error message
  toast.error(ERROR_MESSAGES.DATA.LOAD_FAILED);
}
```

### 2. Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await performAction();
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Cleanup

```typescript
useEffect(() => {
  const subscription = observable.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 4. Type Safety

```typescript
// ✅ Good: Explicit types
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ❌ Bad: Implicit any
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

### 5. Performance

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// Memoize components
export const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* ... */}</div>;
});
```

## Code Review Checklist

Before submitting code:

- [ ] TypeScript types are defined
- [ ] No `any` types (unless absolutely necessary)
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Cleanup functions are added
- [ ] Code is formatted (run `npm run format`)
- [ ] No linting errors (run `npm run lint`)
- [ ] Type checking passes (run `npm run type-check`)
- [ ] Component is documented
- [ ] Commit message follows convention

---

**Last Updated**: 2025-10-03
**Version**: 1.0.0
