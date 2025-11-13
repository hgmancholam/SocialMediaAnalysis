# Components Directory

This directory contains all React components organized by category.

## Structure

### `/ui`

Base UI components from shadcn/ui. These are the building blocks (atoms) of the application.

**Examples**: Button, Card, Dialog, Input, Select, etc.

**Installation**: Use the shadcn/ui CLI to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### `/map`

Map-related components that interact with ArcGIS Maps SDK.

**Examples**:

- `MapContainer.tsx` - Main map wrapper component
- `MapControls.tsx` - Zoom, home, locate controls
- `LayerPanel.tsx` - Layer visibility and management
- `MapToolbar.tsx` - Map interaction tools

**Guidelines**:

- Keep ArcGIS SDK logic in hooks/services, not directly in components
- Use `useMapView` hook from `features/map/hooks`
- Handle map events through the map service layer

### `/graph`

D3.js-based graph visualization components.

**Examples**:

- `SocialMediaGraph.tsx` - Main graph visualization
- `GraphControls.tsx` - Graph interaction controls
- `GraphLegend.tsx` - Legend for graph elements
- `GraphTooltip.tsx` - Interactive tooltips

**Guidelines**:

- Use D3 for calculations, React for rendering
- Leverage `useGraphData` and `useGraphLayout` hooks
- Keep D3 utilities in `lib/d3/`

### `/layout`

Layout components that structure the application.

**Examples**:

- `Header.tsx` - Application header with navigation and auth
- `Sidebar.tsx` - Navigation sidebar
- `MainLayout.tsx` - Main application layout wrapper
- `Panel.tsx` - Resizable panel component

**Guidelines**:

- Use semantic HTML for accessibility
- Implement responsive design
- Consider mobile layouts

### `/shared`

Shared/common components used across features.

**Examples**:

- `LoadingSpinner.tsx` - Loading indicator
- `ErrorBoundary.tsx` - Error boundary wrapper
- `EmptyState.tsx` - Empty state placeholder

**Guidelines**:

- Keep components generic and reusable
- Avoid feature-specific logic
- Document props thoroughly

## Best Practices

1. **Component Naming**: Use PascalCase (e.g., `MapContainer.tsx`)
2. **Props Interface**: Define props interface above component
3. **TypeScript**: Always type props and return values
4. **Composition**: Prefer composition over prop drilling
5. **Memoization**: Use `React.memo` for expensive components
6. **Accessibility**: Include ARIA labels and keyboard navigation

## Example Component Structure

```typescript
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```
