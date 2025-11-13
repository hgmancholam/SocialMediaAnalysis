# Architecture Documentation

## Project Overview

**Net Frontend** is a Next.js-based GIS application showcasing ArcGIS Maps SDK integration with social media data visualization (X/Twitter) for the Bogotá-Villavicencio highway corridor in Colombia. This PoC demonstrates enterprise-grade architecture patterns for future scalability.

## Technology Stack

### Core Framework

- **Next.js 15.5.4** - Static Site Generation (SSG) for IIS deployment
- **React 19.1.0** - UI framework with latest features
- **TypeScript 5** - Type safety and developer experience

### Mapping & Visualization

- **ArcGIS Maps SDK for JavaScript** - Web mapping platform v. 4.33
- **D3.js** - Graph and data visualization
- **Portal for ArcGIS** - Authentication and identity management

### State Management

- **Zustand** - Lightweight global state (UI state, map state, selections)
- **TanStack Query (React Query)** - Server state, caching, data fetching

### UI/UX

- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Modern icon system
- **Radix UI** - Accessible primitive components (Dropdown, Tabs, Tooltip, Slider, Checkbox, Dialog)
- **Framer Motion** - Declarative animations and transitions
- **React Resizable Panels** - Resizable and collapsible layouts
- **Recharts** - Declarative chart library for React
- **D3.js + d3-force** - Custom visualizations and force-directed graphs
- **cmdk** - Command palette and search interfaces
- **Sonner** - Toast notifications
- **date-fns** - Modern date utility library
- **TanStack Table** - Headless table component
- **TanStack Virtual** - Virtual scrolling for performance
- **@use-gesture/react** - Touch and mouse gestures

### Code Quality

- **ESLint** - Linting with Next.js config
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates
- **TypeScript strict mode** - Maximum type safety

## Architecture Principles

### 1. **Separation of Concerns**

- Clear boundaries between UI, business logic, and data layers
- Domain-driven folder structure
- Single Responsibility Principle per module

### 2. **Scalability First**

- Modular architecture ready for feature expansion
- Plugin-based approach for map tools and visualizations
- Extensible configuration system

### 3. **Performance Optimization**

- Code splitting and lazy loading
- Memoization strategies for expensive computations
- Optimized ArcGIS layer rendering
- Static export for fast CDN delivery

### 4. **User Experience First**

- **Accessibility**: WCAG 2.1 AA compliance using Radix UI primitives
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Smooth Interactions**: Framer Motion for fluid animations and transitions
- **Performance**: Virtual scrolling and lazy loading for large datasets
- **Feedback**: Toast notifications and loading states for all user actions
- **Intuitive UI**: Command palette (cmdk) for power users
- **Error Handling**: Graceful degradation and user-friendly error messages

### 5. **Developer Experience**

- Consistent patterns and conventions
- Comprehensive TypeScript types
- Self-documenting code structure
- Path aliases for clean imports

### 6. **Maintainability**

- Clean Architecture principles
- Dependency injection where appropriate
- Testable code structure
- Clear documentation

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── logout/
│   ├── (main)/                   # Main app route group (protected)
│   │   ├── dashboard/            # Main dashboard view
│   │   └── layout.tsx            # Authenticated layout
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/redirect page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── map/                      # Map-related components
│   │   ├── MapContainer.tsx      # Main map wrapper
│   │   ├── MapControls.tsx       # Zoom, home, etc.
│   │   ├── LayerPanel.tsx        # Layer visibility controls
│   │   └── MapToolbar.tsx        # Map interaction tools
│   ├── graph/                    # Graph visualization components
│   │   ├── SocialMediaGraph.tsx  # Main D3 graph component
│   │   ├── GraphControls.tsx     # Graph interaction controls
│   │   ├── GraphLegend.tsx       # Graph legend
│   │   └── GraphTooltip.tsx      # Interactive tooltips
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # App header with auth
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── MainLayout.tsx        # Main app layout
│   │   └── Panel.tsx             # Resizable panels
│   └── shared/                   # Shared/common components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # useAuth, useSession
│   │   ├── services/             # ArcGIS auth service
│   │   ├── store/                # Auth Zustand store
│   │   └── types.ts              # Auth types
│   ├── map/                      # Map feature
│   │   ├── components/           # Map-specific components
│   │   ├── hooks/                # useMapView, useMapLayers
│   │   ├── services/             # Map service layer
│   │   ├── store/                # Map state store
│   │   ├── utils/                # Map utilities
│   │   └── types.ts              # Map types
│   ├── graph/                    # Graph visualization feature
│   │   ├── components/           # Graph components
│   │   ├── hooks/                # useGraphData, useGraphLayout
│   │   ├── services/             # Graph data processing
│   │   ├── store/                # Graph state
│   │   ├── utils/                # D3 utilities
│   │   └── types.ts              # Graph types
│   └── social-media/             # Social media data feature
│       ├── components/           # Social media components
│       ├── hooks/                # useSocialMediaData
│       ├── services/             # Data processing
│       ├── store/                # Social media state
│       └── types.ts              # Social media types
│
├── lib/                          # Core libraries and utilities
│   ├── arcgis/                   # ArcGIS SDK integration
│   │   ├── config.ts             # ArcGIS configuration
│   │   ├── auth.ts               # Portal authentication
│   │   ├── map-factory.ts        # Map instance factory
│   │   ├── layer-factory.ts      # Layer creation utilities
│   │   └── types.ts              # ArcGIS types
│   ├── d3/                       # D3.js utilities
│   │   ├── scales.ts             # D3 scales
│   │   ├── layouts.ts            # Graph layouts
│   │   └── helpers.ts            # D3 helpers
│   ├── api/                      # API client setup
│   │   ├── client.ts             # Base API client
│   │   └── query-client.ts       # TanStack Query config
│   └── utils/                    # General utilities
│       ├── cn.ts                 # Class name utility
│       ├── format.ts             # Data formatting
│       └── validation.ts         # Validation helpers
│
├── hooks/                        # Global custom hooks
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useEventListener.ts
│
├── store/                        # Global Zustand stores
│   ├── app-store.ts              # Global app state
│   ├── ui-store.ts               # UI state (modals, panels)
│   └── index.ts                  # Store exports
│
├── data/                         # Static data files
│   └── config/                   # Configuration data
│       ├── map-layers.json       # Layer definitions
│       └── app-config.json       # App configuration
│
├── public/                       # Public static assets
│   └── data/
│       └── dataset.json          # Main Twitter/X dataset
│
├── styles/                       # Additional styles
│   ├── map.css                   # ArcGIS map styles
│   └── graph.css                 # D3 graph styles
│
├── types/                        # Global TypeScript types
│   ├── index.ts                  # Type exports
│   ├── common.ts                 # Common types
│   └── env.d.ts                  # Environment variables
│
└── config/                       # Application configuration
    ├── site.ts                   # Site metadata
    ├── env.ts                    # Environment config
    └── constants.ts              # App constants

public/
├── data/                         # Public data files (if needed)
├── images/                       # Static images
└── icons/                        # Custom icons
```

## Key Architectural Patterns

### 1. Feature-Based Organization

Each major feature (auth, map, graph) is self-contained with:

- **Components**: Feature-specific UI
- **Hooks**: Feature-specific React hooks
- **Services**: Business logic and external integrations
- **Store**: Feature state management
- **Types**: TypeScript definitions

**Benefits**:

- Easy to locate related code
- Clear feature boundaries
- Facilitates team collaboration
- Simplifies testing

### 2. Layered Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (Components)   │
├─────────────────────────────────────┤
│   Application Layer (Hooks/Stores)  │
├─────────────────────────────────────┤
│   Domain Layer (Services/Utils)     │
├─────────────────────────────────────┤
│   Infrastructure (lib/ArcGIS/API)   │
└─────────────────────────────────────┘
```

### 3. State Management Strategy

**Zustand** for:

- UI state (sidebar open/closed, active panel)
- Map state (current extent, selected features)
- Graph state (selected nodes, filter state)
- Auth state (user info, session)

**TanStack Query** for:

- Future API data fetching
- Caching strategies
- Background updates
- Optimistic updates

**Local Component State** for:

- Form inputs
- Temporary UI state
- Animation states

### 4. ArcGIS Integration Pattern

```typescript
// Abstraction layer for ArcGIS SDK
lib/arcgis/
  ├── config.ts          // Portal URL, API keys
  ├── auth.ts            // OAuth flow, token management
  ├── map-factory.ts     // Create map instances
  └── layer-factory.ts   // Create layers from config

// Feature-level usage
features/map/
  ├── hooks/
  │   └── useMapView.ts  // React hook wrapping ArcGIS MapView
  └── services/
      └── map-service.ts // Business logic for map operations
```

**Benefits**:

- Decouples ArcGIS from React components
- Easier to test
- Centralized configuration
- Easier SDK version upgrades

### 5. Component Composition

```typescript
// Atomic Design inspired structure
ui/              // Atoms (buttons, inputs)
shared/          // Molecules (composed UI elements)
layout/          // Organisms (header, sidebar)
features/*/components/  // Feature-specific compositions
```

## Configuration Management

### Environment Variables

```env
# .env.local (development)
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.com
NEXT_PUBLIC_ARCGIS_CLIENT_ID=your-client-id
NEXT_PUBLIC_BASE_PATH=/

# .env.production
NEXT_PUBLIC_BASE_PATH=/net-frontend
```

### Static Export Configuration

```typescript
// next.config.ts
export default {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for IIS
};
```

## Data Flow

### 1. Authentication Flow

```
User → Login Component → Auth Service → Portal for ArcGIS
                              ↓
                         Auth Store (Zustand)
                              ↓
                    Protected Routes (Middleware)
```

### 2. Map Interaction Flow

```
User Interaction → Map Component → useMapView Hook
                                        ↓
                                  Map Service
                                        ↓
                              ArcGIS SDK (lib/arcgis)
                                        ↓
                              Map Store (Zustand)
                                        ↓
                          Graph Component (sync)
```

### 3. Graph-Map Synchronization

```
Graph Selection → Graph Store → Event Bus/Effect
                                      ↓
                              Map Service (highlight)
                                      ↓
                              Map View Update
```

## Styling Strategy

### Tailwind CSS v4

- Utility-first approach
- Custom design tokens in `globals.css`
- Responsive design utilities

### Component-Specific Styles

- ArcGIS map styles in `styles/map.css`
- D3 graph styles in `styles/graph.css`
- Scoped to avoid conflicts

### shadcn/ui Theming

- CSS variables for theming
- Dark mode support (future)
- Consistent design system

## Performance Considerations

### Code Splitting

```typescript
// Lazy load heavy components
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

const SocialMediaGraph = dynamic(() => import('@/components/graph/SocialMediaGraph'), {
  ssr: false
});
```

### ArcGIS Optimization

- Load only required modules
- Layer visibility management
- Feature layer query optimization
- Debounced map events

### D3 Optimization

- Canvas rendering for large graphs (if needed)
- Virtualization for large datasets
- Memoized calculations

## Security Considerations

### Authentication

- OAuth 2.0 with Portal for ArcGIS
- Token stored securely (httpOnly cookies if possible)
- Token refresh mechanism
- Logout cleanup

### Static Export Security

- No sensitive data in client bundle
- Environment variables at build time
- CSP headers (configured in IIS)

## Deployment Strategy

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build  # Creates 'out' directory

# Preview production build
npx serve out
```

### IIS Deployment

1. Build static export
2. Copy `out/` directory to IIS virtual directory
3. Configure web.config for SPA routing
4. Set base path for different environments

### Multi-Environment Setup

```
IIS
├── /net-frontend-test  (test environment)
└── /net-frontend       (production)
```

## Testing Strategy (Future)

### Unit Tests

- Utility functions
- Custom hooks
- Services (mocked dependencies)

### Integration Tests

- Feature workflows
- Component interactions
- Store updates

### E2E Tests

- Critical user paths
- Authentication flow
- Map-graph interaction

## Development Workflow

### Branch Strategy

- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - feature branches
- `hotfix/*` - urgent fixes

### Code Quality Gates

1. ESLint (no errors)
2. TypeScript compilation (no errors)
3. Prettier formatting
4. Pre-commit hooks (Husky)

### Commit Convention

Follow Angular commit message format (as per user rules):

```
feat(map): add layer visibility controls
fix(auth): resolve token refresh issue
docs(architecture): update folder structure
```

## Future Enhancements

### Phase 2 Considerations

- Real-time data updates (WebSockets)
- Advanced map interactions (draw, measure)
- User preferences persistence
- Analytics integration
- Offline capabilities
- Advanced filtering and search
- Export capabilities (PDF, images)
- Multi-language support (i18n)

### Scalability Paths

- Migrate to API-driven data (replace static JSON)
- Add backend service (Node.js/Python)
- Database integration
- User management system
- Advanced analytics dashboard

## Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [D3.js Documentation](https://d3js.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

### Tools

- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: 2025-10-03
**Version**: 1.0.0
**Author**: Architecture Team
