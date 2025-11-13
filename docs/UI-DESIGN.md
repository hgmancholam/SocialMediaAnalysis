# UI Design - Net DNI

## Información General

**Nombre de la Aplicación**: Net DNI  
**Configuración**: Definida en `src/config/site.ts` como constante global  
**Estilo**: Moderno, limpio, oscuro con acentos azules  
**Responsive**: Diseño adaptable a diferentes tamaños de pantalla

---

## 🎨 Paleta de Colores y Temas

### Colores Principales

```css
/* Tema Oscuro Principal */
--background-primary: #0f1419 (Gris carbón muy oscuro) --background-secondary: #1a1f2e
  (Gris azulado oscuro) --background-tertiary: #232936 (Gris medio) --background-card: #1e2533
  (Gris oscuro para tarjetas) /* Acentos */ --accent-primary: #3b82f6 (Azul brillante)
  --accent-secondary: #60a5fa (Azul claro) --accent-hover: #2563eb (Azul hover) /* Estados */
  --success: #10b981 (Verde) --warning: #f59e0b (Ámbar) --error: #ef4444 (Rojo) /* Texto */
  --text-primary: #ffffff (Blanco) --text-secondary: #9ca3af (Gris claro) --text-muted: #6b7280
  (Gris medio) /* Gráficos */ --chart-blue: #3b82f6 --chart-cyan: #06b6d4 --chart-green: #10b981
  --chart-yellow: #f59e0b --chart-purple: #8b5cf6 --chart-pink: #ec4899 /* Nodos de Red */
  --node-person: #3b82f6 (Azul) --node-organization: #10b981 (Verde) --node-event: #8b5cf6 (Púrpura)
  --node-highlight: #f59e0b (Amarillo dorado);
```

### Tipografía

```css
--font-primary:
  'Inter', sans-serif --font-mono: 'Fira Code',
  monospace /* Tamaños */ --text-xs: 0.75rem (12px) --text-sm: 0.875rem (14px) --text-base: 1rem
    (16px) --text-lg: 1.125rem (18px) --text-xl: 1.25rem (20px) --text-2xl: 1.5rem (24px)
    --text-3xl: 1.875rem (30px);
```

---

## 📱 Vista 1: Dashboard con Mapa (Pantalla Principal)

### Layout General

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (Top Bar)                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                                                                         │
│           MAPA (ArcGIS Map Container)                    PANEL         │
│                                                          LATERAL        │
│           [Barra de búsqueda flotante]                  (Colapsable)   │
│                                                                         │
│                                                                         │
│           [Tarjeta flotante dataset info]                              │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  MAP CONTROLS (Zoom, Layers) - Flotantes                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. **Header / Top Bar**

**Ubicación**: Superior, ancho completo  
**Altura**: 64px  
**Background**: `--background-secondary` con sombra sutil

**Elementos**:

```typescript
interface HeaderComponent {
  // Izquierda
  logo: {
    icon: 'Logo triangular Net DNI';
    text: 'Net DNI';
    color: '--accent-primary';
  };

  // Centro
  navigation?: {
    items: [
      { label: 'Dashboard'; path: '/'; icon: 'LayoutGrid' },
      { label: 'Mapa'; path: '/map'; icon: 'Map' },
      { label: 'Visualizaciones'; path: '/visualizations'; icon: 'Share2' },
    ];
  };

  // Derecha
  userSection: {
    notifications: {
      icon: 'Bell';
      badge?: number;
      action: 'openNotifications()';
    };
    userProfile: {
      avatar: string | JSX.Element; // URL o componente
      name: 'Juan Pérez';
      role: 'Administrador';
      dropdown: {
        items: [
          { label: 'Mi Perfil'; action: 'viewProfile()' },
          { label: 'Configuración'; action: 'openSettings()' },
          { label: 'Cerrar Sesión'; action: 'logout()' },
        ];
      };
    };
  };
}
```

**Componente React**:

- Path: `src/components/layout/Header.tsx`
- Sticky position
- Z-index: 50
- Elevation: sombra md

---

#### 2. **Barra de Búsqueda en Mapa**

**Ubicación**: Flotante sobre mapa, superior izquierda  
**Dimensiones**: 360px x 48px  
**Background**: `--background-card` con blur backdrop

**Especificaciones**:

```typescript
interface MapSearchBar {
  input: {
    placeholder: "Buscar en el mapa";
    icon: "Search" (lucide-react);
    width: "100%";
    onSearch: (query: string) => void;
    autocomplete: true;
    suggestions?: GeocodingSuggestion[];
  };

  style: {
    borderRadius: "24px";
    backdropFilter: "blur(10px)";
    backgroundColor: "rgba(30, 37, 51, 0.9)";
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)";
    padding: "12px 20px";
  };

  interactions: {
    onFocus: "expandSuggestions()";
    onSelect: "zoomToLocation()";
    onClear: "clearSearch()";
  };
}
```

**Componente React**:

- Path: `src/features/map/components/MapSearchBar.tsx`
- Floating position: absolute
- Responsive: se oculta en móvil < 768px

---

#### 3. **Tarjeta de Información del Dataset (Flotante)**

**Ubicación**: Inferior izquierda sobre mapa  
**Dimensiones**: 320px x variable  
**Background**: `--background-card` con blur

**Especificaciones**:

```typescript
interface DatasetInfoCard {
  header: {
    title: 'Análisis Demográfico 2024';
    subtitle: 'Dataset con información poblacional actualizada por regiones.';
    icon?: 'Database';
  };

  stats: {
    totalRecords: {
      label: 'Total Registros';
      value: '1,234,567';
      format: 'number';
    };
    lastUpdate: {
      label: 'Actualizado';
      value: 'Hace 2h';
      format: 'relative-time';
    };
  };

  style: {
    borderRadius: '16px';
    padding: '24px';
    backdropFilter: 'blur(10px)';
    backgroundColor: 'rgba(30, 37, 51, 0.95)';
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)';
    border: '1px solid rgba(59, 130, 246, 0.1)';
  };

  states: {
    collapsed: boolean;
    expandable: boolean;
  };
}
```

**Componente React**:

- Path: `src/features/map/components/DatasetInfoCard.tsx`
- Position: absolute bottom-left
- Animation: fade-in, slide-up
- Colapsable con animación

---

#### 4. **Panel Lateral de Analytics (Expandible)**

**Ubicación**: Derecha, altura completa  
**Dimensiones**:

- Colapsado: 0px
- Expandido: 420px (desktop), 100% (mobile)
- Redimensionable: min 320px, max 600px

**Especificaciones**:

```typescript
interface AnalyticsSidePanel {
  header: {
    tabs: [
      { id: 'resumen'; label: 'Resumen'; icon: 'BarChart3' },
      { id: 'detalles'; label: 'Detalles'; icon: 'FileText' },
      { id: 'relaciones'; label: 'Relaciones'; icon: 'Share2' },
    ];
    activeTab: string;
  };

  content: {
    resumen: {
      charts: [DistribucionPorTipoChart, VolumenPorRegionChart];
    };
    detalles: {
      info: NodeDetailInfo;
    };
    relaciones: {
      graph: NetworkGraphComponent;
    };
  };

  controls: {
    toggleButton: {
      position: 'left-edge';
      icon: 'ChevronLeft' | 'ChevronRight';
      action: 'togglePanel()';
    };
    resizeHandle: {
      position: 'left-border';
      cursor: 'col-resize';
      onDrag: 'resizePanel(width)';
    };
  };

  style: {
    backgroundColor: '--background-secondary';
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)';
    overflowY: 'auto';
    transition: 'width 0.3s ease';
  };
}
```

**Componente React**:

- Path: `src/components/layout/AnalyticsSidePanel.tsx`
- Zustand store: `usePanelStore()`
- Resize library: `react-resizable-panels`

---

#### 5. **Gráfico: Distribución por Tipo (Barras)**

**Ubicación**: Panel lateral - Sección Resumen  
**Dimensiones**: 100% width x 280px height

**Especificaciones**:

```typescript
interface DistribucionPorTipoChart {
  type: 'bar-chart';

  data: {
    categories: ['A', 'B', 'C', 'D'];
    values: [800, 600, 950, 1100];
    colors: [
      '--chart-blue',
      '--chart-blue',
      '--chart-blue',
      '--accent-primary', // Destacado
    ];
  };

  header: {
    title: 'Distribución por Tipo';
    subtitle: 'Últimos 30 días +5.2%';
    totalValue: '1,234';
    trend: {
      value: '+5.2%';
      direction: 'up';
      color: '--success';
    };
  };

  visualization: {
    library: 'recharts' | 'd3';
    orientation: 'vertical';
    barWidth: 48;
    spacing: 16;
    animation: true;
    interactive: {
      hover: 'showTooltip(category, value)';
      click: 'filterByCategory(category)';
    };
  };

  axes: {
    xAxis: {
      show: true;
      labels: true;
      gridLines: false;
    };
    yAxis: {
      show: false;
      gridLines: true;
      gridColor: 'rgba(255, 255, 255, 0.05)';
    };
  };
}
```

**Componente React**:

- Path: `src/features/graph/components/DistribucionPorTipoChart.tsx`
- Library: Recharts o D3.js
- Responsive
- Tooltip con información detallada

---

#### 6. **Gráfico: Volumen por Región (Barras Horizontales)**

**Ubicación**: Panel lateral - Sección Resumen  
**Dimensiones**: 100% width x 240px height

**Especificaciones**:

```typescript
interface VolumenPorRegionChart {
  type: 'horizontal-bar-chart';

  data: {
    regions: [
      { name: 'Norte'; value: 3200; percentage: 85 },
      { name: 'Sur'; value: 1800; percentage: 48 },
      { name: 'Este'; value: 2400; percentage: 64 },
      { name: 'Oeste'; value: 1200; percentage: 32 },
    ];
    maxValue: 3800; // Para normalizar barras
  };

  header: {
    title: 'Volumen por Región';
    subtitle: 'Últimos 30 días -1.8%';
    totalValue: '5,678';
    trend: {
      value: '-1.8%';
      direction: 'down';
      color: '--error';
    };
  };

  visualization: {
    layout: 'stacked-horizontal';
    bars: {
      filled: {
        color: '--accent-primary';
        borderRadius: '4px';
      };
      background: {
        color: 'rgba(255, 255, 255, 0.1)';
        borderRadius: '4px';
      };
    };
    labels: {
      region: {
        position: 'left';
        color: '--text-primary';
      };
      value: {
        position: 'right';
        format: 'number';
      };
    };
  };

  interactions: {
    hover: 'highlightRegion(region)';
    click: 'filterByRegion(region)';
  };
}
```

**Componente React**:

- Path: `src/features/graph/components/VolumenPorRegionChart.tsx`
- Custom D3 o Recharts
- Animation on load

---

#### 7. **Controles de Mapa (Flotantes)**

**Ubicación**: Derecha del mapa, verticalmente centrados  
**Dimensiones**: 48px x variable

**Especificaciones**:

```typescript
interface MapControlsFloating {
  position: 'absolute-right';

  controls: [
    {
      type: 'zoom-in';
      icon: 'Plus';
      action: 'mapView.zoom += 1';
      tooltip: 'Acercar';
    },
    {
      type: 'zoom-out';
      icon: 'Minus';
      action: 'mapView.zoom -= 1';
      tooltip: 'Alejar';
    },
    {
      type: 'drag-toggle';
      icon: 'Hand';
      action: 'toggleDragMode()';
      tooltip: 'Modo arrastre';
      togglable: true;
    },
    {
      type: 'fullscreen';
      icon: 'Maximize';
      action: 'toggleFullscreen()';
      tooltip: 'Pantalla completa';
    },
  ];

  style: {
    container: {
      backgroundColor: '--background-card';
      borderRadius: '12px';
      padding: '8px';
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)';
      gap: '8px';
    };
    button: {
      width: '40px';
      height: '40px';
      borderRadius: '8px';
      hover: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)';
      };
      active: {
        backgroundColor: '--accent-primary';
        color: '--text-primary';
      };
    };
  };
}
```

**Componente React**:

- Path: `src/features/map/components/MapControls.tsx`
- Position: absolute right
- Z-index: 10

---

## 📊 Vista 2: Análisis de Red (Gráfico de Nodos)

### Layout General

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (igual que vista anterior)                                     │
├──────────────┬──────────────────────────────────────┬───────────────────┤
│  SIDEBAR     │                                      │   PANEL          │
│  (Menú)      │       GRÁFICO DE RED                 │   DETALLES       │
│              │       (Force-Directed Graph)         │   (Lateral)      │
│  - Dashboard │                                      │                  │
│  - Mapa      │       [Nodos y Aristas]              │   Info del Nodo  │
│  - Visual.   │                                      │   Seleccionado   │
│              │                                      │                  │
├──────────────┤                                      │                  │
│  FILTROS     │                                      │                  │
│  Y           │                                      │                  │
│  CONTROLES   │                                      │                  │
│              │                                      │                  │
│  [Buscar]    │                                      │                  │
│  [Checkboxes]│                                      │                  │
│  [Slider]    │                                      │                  │
│              │                                      │                  │
│  [Botones]   │                                      │                  │
└──────────────┴──────────────────────────────────────┴───────────────────┘
```

### Componentes Específicos

#### 8. **Sidebar de Navegación**

**Ubicación**: Izquierda, altura completa  
**Dimensiones**: 240px width (expandido), 64px (colapsado)  
**Background**: `--background-secondary`

**Especificaciones**:

```typescript
interface NavigationSidebar {
  header: {
    logo: 'Net DNI';
    collapseButton?: {
      icon: 'PanelLeftClose' | 'PanelLeftOpen';
      action: 'toggleSidebar()';
    };
  };

  menuItems: [
    {
      id: 'dashboard';
      label: 'Dashboard';
      icon: 'LayoutGrid';
      path: '/';
      active: boolean;
    },
    {
      id: 'map';
      label: 'Mapa';
      icon: 'Map';
      path: '/map';
      active: boolean;
    },
    {
      id: 'visualizations';
      label: 'Visualizaciones';
      icon: 'Share2';
      path: '/visualizations';
      active: boolean;
      badge?: number; // Opcional
    },
  ];

  style: {
    width: '240px';
    backgroundColor: '--background-secondary';
    borderRight: '1px solid rgba(255, 255, 255, 0.1)';
    transition: 'width 0.3s ease';
    collapsed: {
      width: '64px';
      hideLabels: true;
    };
  };

  interactions: {
    itemHover: 'showTooltip(label)';
    itemClick: 'navigateTo(path)';
  };
}
```

**Componente React**:

- Path: `src/components/layout/Sidebar.tsx`
- Next.js Link para navegación
- Active state con usePathname()

---

#### 9. **Panel de Filtros y Controles**

**Ubicación**: Sidebar izquierda, debajo de navegación  
**Dimensiones**: 100% width x variable height  
**Background**: `--background-secondary`

**Especificaciones**:

```typescript
interface FilterControlsPanel {
  title: 'Filtros y Controles';

  sections: [
    {
      id: 'search';
      component: NodeSearchInput;
      props: {
        placeholder: 'Buscar por ID o nombre...';
        icon: 'Search';
        onSearch: (query: string) => void;
      };
    },
    {
      id: 'entity-filters';
      title: 'Filtrar por tipo de entidad';
      component: EntityTypeCheckboxes;
      options: [
        { id: 'person'; label: 'Persona'; checked: true; color: '--node-person' },
        { id: 'organization'; label: 'Organización'; checked: true; color: '--node-organization' },
        { id: 'event'; label: 'Evento'; checked: false; color: '--node-event' },
      ];
    },
    {
      id: 'connection-strength';
      title: 'Fuerza de Conexión';
      component: ConnectionStrengthSlider;
      props: {
        min: 0;
        max: 100;
        defaultValue: 50;
        labels: ['Débil', 'Fuerte'];
        onChange: (value: number) => void;
      };
    },
    {
      id: 'actions';
      component: FilterActionButtons;
      buttons: [
        {
          label: 'Aplicar';
          variant: 'primary';
          action: 'applyFilters()';
        },
        {
          label: 'Reiniciar';
          variant: 'secondary';
          action: 'resetFilters()';
        },
      ];
    },
  ];

  footer: {
    newVisualizationButton: {
      label: 'Nueva Visualización';
      icon: 'Plus';
      variant: 'accent';
      fullWidth: true;
      action: 'createNewVisualization()';
    };
  };
}
```

**Componente React**:

- Path: `src/features/graph/components/FilterControlsPanel.tsx`
- Múltiples sub-componentes
- Estado en Zustand store

---

#### 10. **Gráfico de Red (Node-Edge Graph) - Principal**

**Ubicación**: Centro, área principal  
**Dimensiones**: 100% disponible (responsive)  
**Background**: Gradiente oscuro verde-azulado

**Especificaciones**:

```typescript
interface NetworkGraph {
  type: 'force-directed-graph';
  library: 'd3-force' | 'vis-network' | 'cytoscape';

  data: {
    nodes: Node[];
    edges: Edge[];
  };

  nodeTypes: {
    person: {
      color: '--node-person';
      shape: 'circle';
      size: (connections: number) => number; // Tamaño basado en grado
    };
    organization: {
      color: '--node-organization';
      shape: 'circle';
      size: (connections: number) => number;
    };
    event: {
      color: '--node-event';
      shape: 'circle';
      size: (connections: number) => number;
    };
  };

  edgeStyle: {
    color: 'rgba(255, 255, 255, 0.2)';
    width: (strength: number) => number; // 1-5px
    opacity: (strength: number) => number; // 0.2-0.8
    curve: 'curveBundle'; // Para mejor estética
  };

  visualization: {
    forces: {
      charge: -300; // Repulsión entre nodos
      link: {
        distance: 100;
        strength: 0.5;
      };
      collision: 30; // Radio de colisión
      center: {
        x: '50%';
        y: '50%';
      };
    };

    zoom: {
      enabled: true;
      scaleExtent: [0.1, 4];
      onZoom: 'updateTransform()';
    };

    drag: {
      enabled: true;
      onDrag: 'updateNodePosition()';
      onDragEnd: 'restartSimulation()';
    };
  };

  interactions: {
    nodeHover: {
      action: 'highlightConnections(nodeId)';
      style: {
        scale: 1.2;
        opacity: 1;
        showLabel: true;
      };
    };

    nodeClick: {
      action: 'selectNode(nodeId)';
      effect: 'showDetailsPanel(nodeId)';
    };

    edgeHover: {
      action: 'highlightEdge(edgeId)';
      style: {
        width: '*2';
        opacity: 0.8;
      };
    };

    canvasClick: {
      action: 'deselectAll()';
    };
  };

  legend: {
    position: 'bottom-left';
    items: [
      {
        type: 'Persona';
        color: '--node-person';
        shape: 'circle';
      },
      {
        type: 'Organización';
        color: '--node-organization';
        shape: 'circle';
      },
      {
        type: 'Evento';
        color: '--node-event';
        shape: 'circle';
      },
    ];
  };

  nodeInfluence: {
    // Tamaño de nodo indica influencia
    lowInfluence: {
      radius: 6;
      label: 'Baja Influencia';
    };
    highInfluence: {
      radius: 16;
      label: 'Alta Influencia';
    };
  };
}
```

**Nodos de Ejemplo**:

```typescript
interface Node {
  id: string; // "N-472-AC"
  label: string; // "Juan Pérez"
  type: 'person' | 'organization' | 'event';
  connections: number; // 12
  data: {
    // Datos específicos del nodo
    [key: string]: any;
  };
  position?: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  strength: number; // 0-100
  type?: string; // "colaboracion", "participacion", etc.
}
```

**Componente React**:

- Path: `src/features/graph/components/NetworkGraph.tsx`
- D3.js para renderizado
- Canvas o SVG
- Web Workers para cálculos pesados
- Memoización para performance

---

#### 11. **Panel de Detalles del Nodo (Lateral Derecha)**

**Ubicación**: Derecha, altura completa  
**Dimensiones**: 380px width (fijo o redimensionable)  
**Background**: `--background-secondary`

**Especificaciones**:

```typescript
interface NodeDetailsPanel {
  header: {
    title: 'Detalles del Nodo';
    closeButton: {
      icon: 'X';
      action: 'closePanel()';
    };
  };

  content: {
    empty: {
      message: 'Seleccione un nodo o una arista para ver más detalles.';
      icon: 'InfoCircle';
    };

    nodeSelected: {
      sections: [
        {
          id: 'basic-info';
          title: 'Información Básica';
          fields: [
            { label: 'ID'; value: 'N-472-AC' },
            { label: 'Nombre'; value: 'Juan Pérez' },
            { label: 'Categoría'; value: 'Persona'; badge: true },
            { label: 'Conexiones'; value: '12' },
          ];
        },
        {
          id: 'connections-list';
          title: 'Conexiones';
          component: ConnectionsList;
          data: [
            { targetId: 'N-123'; targetName: 'María García'; strength: 85 },
            { targetId: 'O-456'; targetName: 'Tech Corp'; strength: 70 },
          ];
        },
        {
          id: 'activity-timeline';
          title: 'Línea de Tiempo';
          component: ActivityTimeline;
        },
      ];
    };
  };

  legend: {
    title: 'Leyenda';
    sections: [
      {
        title: 'TIPO DE ENTIDAD';
        items: [
          { color: '--node-person'; label: 'Persona' },
          { color: '--node-organization'; label: 'Organización' },
          { color: '--node-event'; label: 'Evento' },
        ];
      },
      {
        title: 'TAMAÑO DE NODO';
        items: [
          { size: 'small'; label: 'Baja Influencia' },
          { size: 'large'; label: 'Alta Influencia' },
        ];
      },
    ];
  };

  style: {
    backgroundColor: '--background-secondary';
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)';
    overflowY: 'auto';
    padding: '24px';
  };
}
```

**Componente React**:

- Path: `src/features/graph/components/NodeDetailsPanel.tsx`
- Conditional rendering basado en selección
- Animación de entrada/salida

---

## 🔧 Componentes Compartidos (Shared)

### 12. **Button Component**

```typescript
interface ButtonComponent {
  variants: {
    primary: {
      backgroundColor: '--accent-primary';
      color: '--text-primary';
      hover: {
        backgroundColor: '--accent-hover';
      };
    };
    secondary: {
      backgroundColor: 'transparent';
      border: '1px solid rgba(255, 255, 255, 0.2)';
      color: '--text-secondary';
      hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)';
      };
    };
    ghost: {
      backgroundColor: 'transparent';
      color: '--text-secondary';
      hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)';
      };
    };
  };

  sizes: {
    sm: { height: '32px'; padding: '0 12px'; fontSize: '--text-sm' };
    md: { height: '40px'; padding: '0 16px'; fontSize: '--text-base' };
    lg: { height: '48px'; padding: '0 20px'; fontSize: '--text-lg' };
  };

  states: {
    loading: boolean;
    disabled: boolean;
  };
}
```

**Path**: `src/components/ui/Button.tsx`

---

### 13. **Card Component**

```typescript
interface CardComponent {
  variants: {
    default: {
      backgroundColor: '--background-card';
      border: '1px solid rgba(255, 255, 255, 0.1)';
      borderRadius: '16px';
    };
    elevated: {
      backgroundColor: '--background-card';
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)';
      borderRadius: '16px';
    };
    glass: {
      backgroundColor: 'rgba(30, 37, 51, 0.9)';
      backdropFilter: 'blur(10px)';
      borderRadius: '16px';
      border: '1px solid rgba(59, 130, 246, 0.2)';
    };
  };

  padding: {
    none: '0';
    sm: '16px';
    md: '24px';
    lg: '32px';
  };
}
```

**Path**: `src/components/ui/Card.tsx`

---

### 14. **Input Component**

```typescript
interface InputComponent {
  types: ['text', 'search', 'email', 'password', 'number'];

  variants: {
    default: {
      backgroundColor: '--background-tertiary';
      border: '1px solid rgba(255, 255, 255, 0.1)';
      color: '--text-primary';
      placeholder: '--text-muted';
    };
    filled: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)';
      border: 'none';
    };
  };

  states: {
    focused: {
      borderColor: '--accent-primary';
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)';
    };
    error: {
      borderColor: '--error';
    };
    disabled: {
      opacity: 0.5;
      cursor: 'not-allowed';
    };
  };

  sizes: {
    sm: { height: '36px'; padding: '0 12px' };
    md: { height: '44px'; padding: '0 16px' };
    lg: { height: '52px'; padding: '0 20px' };
  };

  icons: {
    left?: LucideIcon;
    right?: LucideIcon;
  };
}
```

**Path**: `src/components/ui/Input.tsx`

---

### 15. **Badge Component**

```typescript
interface BadgeComponent {
  variants: {
    default: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)';
      color: '--accent-primary';
    };
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)';
      color: '--success';
    };
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)';
      color: '--warning';
    };
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)';
      color: '--error';
    };
  };

  sizes: {
    sm: { height: '20px'; padding: '0 8px'; fontSize: '--text-xs' };
    md: { height: '24px'; padding: '0 10px'; fontSize: '--text-sm' };
  };
}
```

**Path**: `src/components/ui/Badge.tsx`

---

### 16. **Tooltip Component**

```typescript
interface TooltipComponent {
  position: ['top', 'right', 'bottom', 'left'];

  style: {
    backgroundColor: '--background-card';
    color: '--text-primary';
    padding: '8px 12px';
    borderRadius: '8px';
    fontSize: '--text-sm';
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)';
    maxWidth: '240px';
  };

  animation: {
    enter: 'fadeIn 0.2s ease';
    exit: 'fadeOut 0.15s ease';
  };

  arrow: {
    size: '6px';
    color: '--background-card';
  };
}
```

**Path**: `src/components/ui/Tooltip.tsx`  
**Library**: Radix UI Tooltip o Headless UI

---

## 🎯 Ejemplo Adicional: Mini Gráfico de Red

### 17. **Network Mini Graph (Tarjeta de Resumen)**

**Ubicación**: Panel lateral, sección Relaciones  
**Dimensiones**: 320px x 240px  
**Uso**: Vista previa rápida de conexiones

**Especificaciones**:

```typescript
interface NetworkMiniGraph {
  type: "mini-network-preview";

  data: {
    centerNode: {
      id: "N-472-AC";
      label: "Juan Pérez";
      type: "person";
    };
    connectedNodes: Node[]; // Máximo 10 nodos más cercanos
    edges: Edge[];
  };

  visualization: {
    layout: "radial"; // Nodo central en el medio
    centerNode: {
      size: 20;
      color: "--node-highlight";
      stroke: "--accent-primary";
      strokeWidth: 3;
    };

    connectedNodes: {
      size: 12;
      color: (type) => getNodeColor(type);
      opacity: 0.8;
    };

    edges: {
      color: "rgba(255, 255, 255, 0.2)";
      width: 1.5;
      opacity: 0.5;
    };
  };

  interactions: {
    disabled: true; // Solo visualización, no interactivo
    // O alternativamente:
    onClick: "expandToFullGraph()";
  };

  header: {
    title: "Red de Conexiones";
    subtitle: "12 conexiones directas";
    expandButton: {
      label: "Ver en detalle";
      icon: "Maximize2";
      action: "navigateToFullGraph(nodeId)";
    };
  };
}
```

**Componente React**:

- Path: `src/features/graph/components/NetworkMiniGraph.tsx`
- D3.js force simulation simplificado
- SVG rendering
- Estático o animación sutil

---

## 📐 Interacciones y Estados

### Estados de la Aplicación (Zustand Stores)

```typescript
// Panel State
interface PanelStore {
  isAnalyticsPanelOpen: boolean;
  analyticsPanelWidth: number;
  activeTab: 'resumen' | 'detalles' | 'relaciones';

  toggleAnalyticsPanel: () => void;
  setAnalyticsPanelWidth: (width: number) => void;
  setActiveTab: (tab: string) => void;
}

// Map State
interface MapStore {
  mapView: __esri.MapView | null;
  selectedFeatures: string[];
  searchQuery: string;

  setMapView: (view: __esri.MapView) => void;
  selectFeature: (id: string) => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
}

// Graph State
interface GraphStore {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  filters: {
    entityTypes: string[];
    connectionStrength: number;
    searchQuery: string;
  };

  selectNode: (id: string) => void;
  selectEdge: (id: string) => void;
  clearSelection: () => void;
  updateFilters: (filters: Partial<GraphFilters>) => void;
}

// UI State
interface UIStore {
  isSidebarCollapsed: boolean;
  isNodeDetailsPanelOpen: boolean;
  theme: 'dark' | 'light';

  toggleSidebar: () => void;
  toggleNodeDetailsPanel: () => void;
  setTheme: (theme: string) => void;
}
```

---

### Flujos de Interacción

#### Flujo 1: Seleccionar Ubicación en Mapa

```
1. Usuario hace clic en punto del mapa
   ↓
2. MapContainer dispara evento onClick
   ↓
3. useMapClick hook procesa coordenadas
   ↓
4. Se consulta feature en esa ubicación (ArcGIS API)
   ↓
5. mapStore.selectFeature(featureId)
   ↓
6. AnalyticsSidePanel se abre automáticamente
   ↓
7. Se cargan gráficos filtrados por esa ubicación
   ↓
8. Se actualiza DatasetInfoCard con info local
```

#### Flujo 2: Filtrar Gráfico de Red

```
1. Usuario ajusta filtros en FilterControlsPanel
   ↓
2. Usuario hace clic en "Aplicar"
   ↓
3. graphStore.updateFilters(newFilters)
   ↓
4. NetworkGraph re-renderiza con nuevos filtros
   ↓
5. D3 force simulation se reinicia
   ↓
6. Animación de transición entre estados
   ↓
7. Nodos/edges filtrados se desvanecen
   ↓
8. Nuevo layout se estabiliza
```

#### Flujo 3: Seleccionar Nodo en Gráfico

```
1. Usuario hace clic en nodo
   ↓
2. NetworkGraph.onNodeClick(nodeId)
   ↓
3. graphStore.selectNode(nodeId)
   ↓
4. NodeDetailsPanel se abre/actualiza
   ↓
5. Se cargan detalles del nodo (API call)
   ↓
6. NetworkMiniGraph se renderiza
   ↓
7. Nodo y sus conexiones se destacan
   ↓
8. Resto de nodos se atenúan (opacity 0.3)
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  - Header: altura reducida a 56px
  - Sidebar: overlay modal, no visible por defecto
  - MapSearchBar: oculta, reemplazada por botón
  - AnalyticsSidePanel: modal full-screen
  - NetworkGraph: táctil optimizado
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  - Sidebar: 64px colapsado por defecto
  - AnalyticsSidePanel: 320px width
  - FilterControlsPanel: colapsable
}

/* Desktop */
@media (min-width: 1025px) {
  - Layout completo como en mockups
  - AnalyticsSidePanel: redimensionable 420-600px
  - Todos los paneles visibles
}
```

---

## 🎨 Animaciones y Transiciones

### Principios de Animación

```typescript
const animations = {
  // Paneles
  panelSlide: {
    duration: "300ms";
    easing: "ease-in-out";
    property: "transform, width";
  };

  // Tarjetas
  cardHover: {
    duration: "200ms";
    easing: "ease-out";
    transform: "translateY(-2px)";
    boxShadow: "elevated";
  };

  // Gráficos
  chartEntry: {
    duration: "600ms";
    easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    delay: "stagger 100ms";
  };

  // Nodos de red
  nodeEntry: {
    duration: "800ms";
    easing: "ease-out";
    opacity: "0 → 1";
    scale: "0.8 → 1";
  };

  // Modales
  modalEntry: {
    backdrop: {
      duration: "200ms";
      opacity: "0 → 0.5";
    };
    content: {
      duration: "300ms";
      transform: "scale(0.95) → scale(1)";
      opacity: "0 → 1";
    };
  };
};
```

---

## 📊 Estructura de Componentes (Component Tree)

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation (opcional)
│   │   ├── NotificationBell
│   │   └── UserProfileDropdown
│   │
│   ├── Sidebar (condicional por ruta)
│   │   ├── NavigationMenu
│   │   └── FilterControlsPanel (en /visualizations)
│   │
│   └── MainContent
│       ├── Page: Dashboard (/)
│       │   ├── MapContainer
│       │   │   ├── ArcGISMap
│       │   │   ├── MapSearchBar (floating)
│       │   │   ├── DatasetInfoCard (floating)
│       │   │   └── MapControls (floating)
│       │   │
│       │   └── AnalyticsSidePanel (expandible)
│       │       ├── TabNavigation
│       │       ├── ResumenTab
│       │       │   ├── DistribucionPorTipoChart
│       │       │   └── VolumenPorRegionChart
│       │       ├── DetallesTab
│       │       └── RelacionesTab
│       │           └── NetworkMiniGraph
│       │
│       └── Page: Visualizations (/visualizations)
│           ├── NetworkGraph (center)
│           │   ├── D3ForceSimulation
│           │   ├── NodesLayer
│           │   ├── EdgesLayer
│           │   └── Legend
│           │
│           └── NodeDetailsPanel (right)
│               ├── NodeInfo
│               ├── ConnectionsList
│               └── ActivityTimeline
│
└── SharedComponents
    ├── Button
    ├── Card
    ├── Input
    ├── Badge
    ├── Tooltip
    └── ...
```

---

## 🗂️ Archivos a Crear

### Layouts

```
src/components/layout/
├── Header.tsx
├── Sidebar.tsx
├── AnalyticsSidePanel.tsx
└── NodeDetailsPanel.tsx (podría ir en features/graph)
```

### Map Feature

```
src/features/map/components/
├── MapContainer.tsx (ya existe)
├── MapSearchBar.tsx
├── DatasetInfoCard.tsx
└── MapControls.tsx
```

### Graph Feature

```
src/features/graph/components/
├── NetworkGraph.tsx
├── NetworkMiniGraph.tsx
├── DistribucionPorTipoChart.tsx
├── VolumenPorRegionChart.tsx
├── FilterControlsPanel.tsx
├── NodeDetailsPanel.tsx
├── ConnectionsList.tsx
└── Legend.tsx
```

### Shared UI

```
src/components/ui/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Badge.tsx
├── Tooltip.tsx
├── Tabs.tsx
├── Slider.tsx
├── Checkbox.tsx
└── Dropdown.tsx
```

### Stores

```
src/store/
├── panel-store.ts
├── graph-store.ts
└── ui-store.ts (ya existe)
```

### Hooks

```
src/features/graph/hooks/
├── useNetworkGraph.ts
├── useNodeSelection.ts
└── useGraphFilters.ts

src/features/map/hooks/
├── useMapClick.ts (ya existe)
├── useMapView.ts (ya existe)
└── useMapSearch.ts
```

### Types

```
src/features/graph/types.ts
- Node
- Edge
- GraphFilters
- NetworkGraphConfig

src/features/map/types.ts (ya existe)
```

---

## 🎯 Prioridades de Implementación

### Fase 1: Fundamentos (Semana 1)

1. ✅ Setup de constante "Net DNI" en config
2. Header component con navegación
3. Sidebar component
4. Layout principal
5. Shared UI components básicos (Button, Card, Input)

### Fase 2: Vista de Mapa (Semana 2)

1. MapSearchBar component
2. DatasetInfoCard component
3. MapControls component
4. AnalyticsSidePanel estructura
5. Integración con MapContainer existente

### Fase 3: Gráficos Analytics (Semana 3)

1. DistribucionPorTipoChart (Recharts)
2. VolumenPorRegionChart (Recharts)
3. Panel tabs navigation
4. Estados y filtros
5. Responsive design para paneles

### Fase 4: Vista de Red (Semana 4)

1. NetworkGraph con D3.js
2. Force simulation
3. Node/Edge rendering
4. FilterControlsPanel
5. Interacciones básicas

### Fase 5: Detalles y Polish (Semana 5)

1. NodeDetailsPanel
2. NetworkMiniGraph
3. Animaciones y transiciones
4. Mobile responsive
5. Testing y optimización

---

## 📖 Referencias de Diseño

### Inspiración Visual

- **Uber Movement**: Paneles laterales oscuros con mapas
- **ArcGIS Dashboards**: Layout de cards y gráficos
- **GitHub Dark Theme**: Paleta de colores y contraste
- **Observable**: Gráficos de red interactivos
- **Gephi**: Visualización de redes complejas

### Librerías Instaladas

#### 🎨 UI Components & Primitivos (Radix UI)

```bash
✅ @radix-ui/react-dropdown-menu    # Dropdowns accesibles
✅ @radix-ui/react-tabs              # Tabs con keyboard navigation
✅ @radix-ui/react-tooltip           # Tooltips accesibles
✅ @radix-ui/react-slider            # Sliders personalizables
✅ @radix-ui/react-checkbox          # Checkboxes accesibles
✅ @radix-ui/react-dialog            # Modales y diálogos
```

**Uso en el proyecto**:

- UserProfileDropdown (Header)
- AnalyticsSidePanel tabs (Resumen, Detalles, Relaciones)
- Tooltips en controles de mapa
- ConnectionStrengthSlider (FilterControlsPanel)
- EntityTypeCheckboxes (FilterControlsPanel)
- Modales de confirmación

---

#### 📊 Gráficos y Visualizaciones

```bash
✅ recharts                          # Gráficos estadísticos React
✅ d3 (ya instalado)                 # Visualizaciones personalizadas
✅ d3-force                          # Force simulation para redes
```

**Uso en el proyecto**:

- **Recharts**: `DistribucionPorTipoChart`, `VolumenPorRegionChart`
- **D3.js + d3-force**: `NetworkGraph` (force-directed graph)
- **D3.js**: `NetworkMiniGraph`

---

#### ✨ Animaciones y Transiciones

```bash
✅ framer-motion                     # Animaciones declarativas
```

**Uso en el proyecto**:

- Slide in/out de paneles laterales
- Fade in de tarjetas flotantes
- Hover states en componentes
- Page transitions
- Layout animations
- Gesture-based interactions

**Ejemplo**:

```typescript
<motion.div
  initial={{ width: 0, opacity: 0 }}
  animate={{ width: 420, opacity: 1 }}
  exit={{ width: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
/>
```

---

#### 📐 Layouts y Paneles

```bash
✅ react-resizable-panels            # Paneles redimensionables
```

**Uso en el proyecto**:

- `AnalyticsSidePanel` (redimensionable 320-600px)
- `NodeDetailsPanel` (redimensionable)
- Split views en visualizaciones

**Ejemplo**:

```typescript
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

<PanelGroup direction="horizontal">
  <Panel defaultSize={70} minSize={50}>
    {/* Contenido principal */}
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={30} minSize={20} maxSize={40}>
    {/* Panel lateral */}
  </Panel>
</PanelGroup>
```

---

#### 🔍 Búsqueda y Command Palette

```bash
✅ cmdk                              # Command menu component
```

**Uso en el proyecto**:

- `MapSearchBar` mejorada con fuzzy search
- Command palette global (Ctrl+K)
- Búsqueda de nodos en `NetworkGraph`

---

#### 🔔 Notificaciones

```bash
✅ sonner                            # Toast notifications
```

**Uso en el proyecto**:

- Feedback de acciones del usuario
- Errores de carga
- Confirmaciones de operaciones

**Ejemplo**:

```typescript
import { toast } from 'sonner';

toast.success('Filtros aplicados correctamente');
toast.error('Error al cargar datos del mapa');
toast.info('Dataset actualizado hace 2h');
```

---

#### 📅 Manejo de Fechas

```bash
✅ date-fns                          # Utilidades de fechas
```

**Uso en el proyecto**:

- Formateo "hace 2h" en `DatasetInfoCard`
- Timeline en `NodeDetailsPanel`
- Filtros de rango de fechas

**Ejemplo**:

```typescript
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

formatDistanceToNow(lastUpdate, { addSuffix: true, locale: es });
// "hace 2 horas"
```

---

#### 📊 Tablas y Virtualization

```bash
✅ @tanstack/react-table            # Tablas headless
✅ @tanstack/react-virtual          # Virtual scrolling
```

**Uso en el proyecto**:

- Lista de conexiones en `NodeDetailsPanel`
- Tablas de datos en sección Detalles
- Listas largas de nodos filtrados

---

#### 🎯 Gestos y Drag

```bash
✅ @use-gesture/react                # Gestures library
```

**Uso en el proyecto**:

- Drag de nodos en `NetworkGraph`
- Pan y zoom táctil en visualizaciones
- Swipe gestures en mobile

---

#### 🗺️ Mapas

```bash
✅ @arcgis/core (ya instalado)       # ArcGIS Maps SDK
```

**Uso en el proyecto**:

- `MapContainer` con ArcGIS integration
- Geocoding y búsqueda geográfica
- Capas y feature layers

---

#### 🎨 Iconos

```bash
✅ lucide-react (ya instalado)       # Iconos modernos
```

**Uso en el proyecto**:

- Todos los iconos de la aplicación
- 1000+ iconos disponibles
- Tree-shakeable

---

### ⚠️ Librerías NO Instaladas

```bash
❌ @visx/visx                        # Incompatible con React 19
```

**Alternativa**: Usar D3.js directamente para visualizaciones personalizadas.

---

## ✅ Checklist de Componentes

### Layout Components

- [ ] Header con logo "Net DNI"
- [ ] Navigation sidebar
- [ ] User profile dropdown
- [ ] Notification bell

### Map View

- [ ] MapSearchBar (floating)
- [ ] DatasetInfoCard (floating)
- [ ] MapControls (floating)
- [ ] AnalyticsSidePanel (expandible)

### Analytics Charts

- [ ] DistribucionPorTipoChart (barras verticales)
- [ ] VolumenPorRegionChart (barras horizontales)
- [ ] Tabs navigation (Resumen, Detalles, Relaciones)
- [ ] NetworkMiniGraph (preview)

### Graph View

- [ ] NetworkGraph (D3 force-directed)
- [ ] FilterControlsPanel
- [ ] NodeSearchInput
- [ ] EntityTypeCheckboxes
- [ ] ConnectionStrengthSlider
- [ ] NodeDetailsPanel
- [ ] Legend component

### Shared Components

- [ ] Button (variants)
- [ ] Card (variants)
- [ ] Input (con iconos)
- [ ] Badge
- [ ] Tooltip
- [ ] Tabs
- [ ] Slider
- [ ] Checkbox
- [ ] Dropdown

### State Management

- [ ] panel-store (Zustand)
- [ ] graph-store (Zustand)
- [ ] Hooks personalizados

### Responsive

- [ ] Mobile breakpoints
- [ ] Tablet layout
- [ ] Desktop full layout
- [ ] Touch interactions

---

## 🎨 Assets Necesarios

### Iconos (Lucide React)

- LayoutGrid, Map, Share2 (navegación)
- Search, Bell, User (header)
- Plus, Minus, Hand, Maximize (controles mapa)
- BarChart3, FileText, Share2 (tabs)
- ChevronLeft, ChevronRight (colapsar)
- X, Info, Filter (acciones)

### Imágenes

- Logo Net DNI (SVG triangular azul)
- Avatar placeholder
- Empty state illustrations

### Fonts

- Inter (Google Fonts)
- Fira Code (opcional para código)

---

## 🚀 Siguientes Pasos

Con esta documentación completa, ahora puedes:

1. **Revisar y aprobar** el diseño propuesto
2. **Comenzar implementación** por fases
3. **Iterar** basándose en feedback
4. **Usar Copilot** para generar componentes específicos:
   - "Crea el componente Header basado en UI-DESIGN.md"
   - "Genera NetworkGraph con D3.js según especificaciones"
   - "Implementa AnalyticsSidePanel con tabs"

---

**Documentación creada**: 12 de Noviembre, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Completa y lista para implementación
