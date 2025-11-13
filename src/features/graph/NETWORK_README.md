# Network Graph Feature - Red Social

Visualización interactiva de redes sociales utilizando D3.js force-directed graph.

## 📁 Estructura de Archivos

```
src/features/graph/
├── components/
│   ├── NetworkGraph.tsx          # Visualización principal con D3.js
│   ├── NetworkControls.tsx       # Controles de zoom y layout
│   ├── NetworkFilters.tsx        # Filtros avanzados
│   └── NodeDetailsPanel.tsx      # Panel de detalles de nodo
└── store/
    └── network-store.ts          # Estado global con Zustand
```

## 🎯 Componentes

### NetworkGraph

Grafo de fuerza dirigida con D3.js que visualiza nodos y sus conexiones.

**Características:**

- Force simulation (link, charge, center, collision)
- Drag and drop de nodos
- Zoom/Pan con límites (0.1x - 10x)
- Coloreado de nodos por tipo
- Selección de nodos con click
- Hover effects
- Etiquetas de texto
- Responsive

**Props:**

```typescript
interface NetworkGraphProps {
  width?: number; // Default: 800
  height?: number; // Default: 600
  className?: string;
}
```

**Uso:**

```tsx
import { NetworkGraph } from '@/features/graph/components/NetworkGraph';

<NetworkGraph width={1920} height={1080} />;
```

**Notas:**

- Los nodos y edges se obtienen del `network-store`
- El tamaño del nodo se calcula como: `radius = sqrt(degree) + 5`
- Colores por tipo usando `d3.scaleOrdinal(d3.schemeCategory10)`
- La simulación se pausa cuando `isPaused` es true en el store

---

### NetworkControls

Panel de controles flotante para manipular el grafo.

**Características:**

- Búsqueda por nombre de nodo
- Controles de zoom (In, Out, Reset)
- Pause/Resume de la simulación
- Selector de layout (force/circular/hierarchical)
- Tooltips en todos los botones
- Animación de entrada

**Props:**

```typescript
interface NetworkControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  className?: string;
}
```

**Uso:**

```tsx
import { NetworkControls } from '@/features/graph/components/NetworkControls';

<NetworkControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetView={handleResetView} />;
```

**Estado conectado:**

- `layoutType`: Tipo de layout actual
- `isPaused`: Estado de pausa de la simulación
- `filters.searchTerm`: Término de búsqueda actual

---

### NodeDetailsPanel

Panel lateral deslizable que muestra información del nodo seleccionado.

**Características:**

- Información del nodo (ID, label, type, community)
- Métricas calculadas (degree, connections, incoming/outgoing)
- Lista de conexiones con click para navegar
- Top 3 conexiones más fuertes
- Peso promedio de conexiones
- Animación de entrada/salida
- Scroll interno

**Props:**

```typescript
interface NodeDetailsPanelProps {
  edges: Edge[];
  nodes: Node[];
  className?: string;
}
```

**Uso:**

```tsx
import { NodeDetailsPanel } from '@/features/graph/components/NodeDetailsPanel';

<NodeDetailsPanel nodes={allNodes} edges={allEdges} />;
```

**Métricas mostradas:**

- **Grado**: Total de conexiones del nodo
- **Conexiones**: Cantidad de edges conectados
- **Entrantes**: Edges donde el nodo es target
- **Salientes**: Edges donde el nodo es source
- **Peso promedio**: Promedio de pesos de todas las conexiones

**Colores por tipo de nodo:**

```typescript
usuario: 'bg-blue-500/20 text-blue-400';
hashtag: 'bg-purple-500/20 text-purple-400';
mencion: 'bg-green-500/20 text-green-400';
url: 'bg-orange-500/20 text-orange-400';
```

---

### NetworkFilters

Panel de filtros avanzados para el grafo.

**Características:**

- Filtro por tipo de nodo (multi-select con badges)
- Slider de rango de grado (min/max)
- Selector de comunidades (dropdown con checkboxes)
- Contador de filtros activos
- Botón para limpiar todos los filtros
- Animación de entrada

**Props:**

```typescript
interface NetworkFiltersProps {
  className?: string;
  availableTypes?: string[]; // Default: ['usuario', 'hashtag', 'mencion', 'url']
  availableCommunities?: number[]; // Default: [1, 2, 3, 4, 5]
}
```

**Uso:**

```tsx
import { NetworkFilters } from '@/features/graph/components/NetworkFilters';

<NetworkFilters
  availableTypes={['usuario', 'hashtag', 'mencion']}
  availableCommunities={[1, 2, 3]}
/>;
```

**Filtros disponibles:**

- **Tipo de Nodo**: Selección múltiple con badges interactivos
- **Rango de Grado**: Sliders con valores min y max (0-100)
- **Comunidades**: Dropdown con checkboxes

---

## 📊 Network Store (Zustand)

Estado global para la red social.

### Interfaces

```typescript
interface Node {
  id: string;
  label: string;
  type: string;
  degree: number;
  community?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface NetworkFilters {
  nodeTypes: string[];
  degreeRange: [number, number];
  communities: number[];
  searchTerm: string;
}

type LayoutType = 'force' | 'circular' | 'hierarchical';
```

### Estado

```typescript
{
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  hoveredNode: Node | null;
  filters: NetworkFilters;
  layoutType: LayoutType;
  zoomLevel: number;
  isPaused: boolean;
}
```

### Acciones

```typescript
// Setters
setNodes: (nodes: Node[]) => void;
setEdges: (edges: Edge[]) => void;
setSelectedNode: (node: Node | null) => void;
setHoveredNode: (node: Node | null) => void;
setZoomLevel: (level: number) => void;

// Filtros
updateFilters: (filters: Partial<NetworkFilters>) => void;
resetFilters: () => void;

// Layout y simulación
setLayoutType: (type: LayoutType) => void;
togglePause: () => void;
```

### Persistencia

Se persisten en `localStorage`:

- `layoutType`
- `filters`

**Uso:**

```tsx
import { useNetworkStore } from '@/features/graph/store/network-store';

function MyComponent() {
  const { nodes, selectedNode, setSelectedNode, isPaused, togglePause } = useNetworkStore();

  return <div onClick={() => setSelectedNode(nodes[0])}>{selectedNode?.label}</div>;
}
```

---

## 🎨 Estilos

### Tema Oscuro

- Background: `#0F1419`
- Panels: `#1E2533`
- Borders: `white/10`
- Text: `white` / `gray-400`

### Custom Slider Styles

Los sliders de rango tienen estilos personalizados en `globals.css`:

```css
input[type='range'].slider-thumb::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
}
```

---

## 📄 Página /red

Integración completa de todos los componentes.

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│ [Toggle] [NetworkControls]                          │
│                                                       │
│ [Filters]      NETWORK GRAPH (D3.js)    [Details]   │
│  Panel                                     Panel     │
│                                                       │
│ [Stats Badge]                                        │
└─────────────────────────────────────────────────────┘
```

**Características:**

- Grafo en pantalla completa
- Panel de filtros colapsable (izquierda)
- Controles flotantes (top-left)
- Panel de detalles automático (derecha, al seleccionar nodo)
- Badge de estadísticas (bottom-left)
- Responsive
- Dark theme

**Código de ejemplo:**

```tsx
'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { NetworkGraph } from '@/features/graph/components/NetworkGraph';
import { NetworkControls } from '@/features/graph/components/NetworkControls';
import { NetworkFilters } from '@/features/graph/components/NetworkFilters';
import { NodeDetailsPanel } from '@/features/graph/components/NodeDetailsPanel';

export default function RedPage() {
  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-hidden bg-[#0F1419]">
        <NetworkGraph width={1920} height={1080} />

        <div className="absolute top-4 left-4 z-10">
          <NetworkControls {...handlers} />
        </div>

        <NetworkFilters className="absolute top-20 left-4 z-10" />

        <NodeDetailsPanel nodes={nodes} edges={edges} />
      </div>
    </MainLayout>
  );
}
```

---

## 🔧 Integración con D3.js

### Force Simulation

```typescript
const simulation = d3
  .forceSimulation(nodes)
  .force(
    'link',
    d3
      .forceLink(edges)
      .id((d: any) => d.id)
      .distance(100)
  )
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(20));
```

### Zoom Behavior

```typescript
const zoom = d3
  .zoom()
  .scaleExtent([0.1, 10])
  .on('zoom', (event) => {
    g.attr('transform', event.transform);
  });

svg.call(zoom);
```

### Drag Behavior

```typescript
const drag = d3
  .drag()
  .on('start', (event, d: any) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (event, d: any) => {
    d.fx = event.x;
    d.fy = event.y;
  })
  .on('end', (event, d: any) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  });
```

---

## 🚀 Próximos Pasos

- [ ] Implementar layouts circular y hierarchical
- [ ] Agregar mini-map de navegación
- [ ] Exportar grafo como imagen (PNG/SVG)
- [ ] Agregar métricas de centralidad
- [ ] Implementar clustering automático
- [ ] Agregar animaciones de transición entre layouts
- [ ] Timeline de evolución de la red
- [ ] Comparación de dos nodos

---

## 📚 Referencias

- [D3.js Documentation](https://d3js.org/)
- [D3 Force Simulation](https://github.com/d3/d3-force)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Recharts Documentation](https://recharts.org/)
