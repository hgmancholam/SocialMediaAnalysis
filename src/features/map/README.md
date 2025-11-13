# Map Feature Components

Componentes de la vista de mapa implementados en la Fase 2 del proyecto Net DNI.

## 📁 Estructura

```
src/features/map/
├── components/
│   ├── MapSearchBar.tsx         # Búsqueda con geocoding
│   ├── DatasetInfoCard.tsx      # Información del dataset
│   ├── MapControls.tsx          # Controles del mapa
│   └── AnalyticsSidePanel.tsx   # Panel lateral analytics
├── services/
│   └── geocoding-service.ts     # Servicio ArcGIS Locator
├── hooks/
│   ├── useMapClick.ts           # (Existente)
│   └── useMapView.ts            # (Existente)
├── store/
│   └── map-store.ts             # (Existente)
└── types.ts
```

## 🎨 Componentes

### MapSearchBar

Barra de búsqueda flotante con autocompletado para geocoding.

**Características:**

- ✨ Autocompletado con `cmdk`
- 🌍 Geocoding con ArcGIS Locator API
- 📍 Búsquedas recientes (localStorage)
- ⌨️ Keyboard shortcut: `Ctrl+K`
- 🔍 Fuzzy search
- 🎯 Focus en Colombia (extent limitado)
- 🔄 Loading spinner
- 🎨 Blur backdrop

**Props:**

```typescript
interface MapSearchBarProps {
  onLocationSelect: (location: { x: number; y: number }, address: string) => void;
  className?: string;
}
```

**Uso:**

```tsx
<MapSearchBar
  onLocationSelect={(location, address) => {
    // Navegar el mapa a la ubicación
    console.log('Selected:', location, address);
  }}
/>
```

---

### DatasetInfoCard

Card flotante con información del dataset actual.

**Características:**

- 📊 Metadata del dataset
- 📅 Fecha formateada con `date-fns` (español)
- 🔢 Contador de registros formateado
- 📦 Collapsible/Expandible
- 🎬 Animación slide-up desde abajo
- 🎨 Blur backdrop

**Props:**

```typescript
interface DatasetInfo {
  name: string;
  description?: string;
  recordCount: number;
  lastUpdated: Date;
  source?: string;
  extent?: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

interface DatasetInfoCardProps {
  dataset: DatasetInfo;
  className?: string;
}
```

**Uso:**

```tsx
<DatasetInfoCard
  dataset={{
    name: 'Redes Sociales,
    description: 'Datos de interacciones...',
    recordCount: 15420,
    lastUpdated: new Date('2024-11-10'),
    source: 'Twitter, Facebook',
  }}
/>
```

---

### MapControls

Controles flotantes del mapa (zoom, reset, drag, fullscreen).

**Características:**

- 🔍 Zoom In/Out
- 🏠 Reset view
- 👆 Toggle drag mode
- 🖥️ Fullscreen toggle
- 💡 Tooltips con Radix UI
- 🎨 Animaciones hover
- ✨ Staggered entrance animation

**Props:**

```typescript
interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleDragMode?: () => void;
  onToggleFullscreen?: () => void;
  isDragMode?: boolean;
  isFullscreen?: boolean;
  className?: string;
}
```

**Uso:**

```tsx
<MapControls
  onZoomIn={() => (mapView.zoom += 1)}
  onZoomOut={() => (mapView.zoom -= 1)}
  onResetView={() => mapView.goTo(initialExtent)}
  onToggleDragMode={() => setDragMode(!dragMode)}
  onToggleFullscreen={() => toggleFullscreen()}
  isDragMode={dragMode}
  isFullscreen={isFullscreen}
/>
```

---

### AnalyticsSidePanel

Panel lateral resizable con tabs para analytics.

**Características:**

- 📑 Tabs: Resumen | Detalles | Relaciones
- 📏 Resizable (320-600px)
- 💾 Ancho persistido en Zustand store
- 🎬 Animaciones Framer Motion
- 🎭 Backdrop blur
- ⚡ Skeleton loading
- 🚪 Slide-in from right

**Props:**

```typescript
interface AnalyticsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}
```

**Uso:**

```tsx
const { isAnalyticsPanelOpen, setAnalyticsPanelOpen } = usePanelStore();

<AnalyticsSidePanel
  isOpen={isAnalyticsPanelOpen}
  onClose={() => setAnalyticsPanelOpen(false)}
  isLoading={false}
>
  {/* Custom tab content */}
</AnalyticsSidePanel>;
```

---

## 🔧 Servicios

### GeocodingService

Servicio singleton para geocoding con ArcGIS Locator.

**Métodos:**

#### `geocode(address: string, maxResults?: number): Promise<GeocodingResult[]>`

Convierte dirección a coordenadas.

**Ejemplo:**

```typescript
const results = await geocodingService.geocode('Bogotá, Colombia', 5);
// results: [{ address: '...', location: { x: -74.08, y: 4.60 }, score: 100, ... }]
```

#### `suggest(text: string, maxSuggestions?: number): Promise<string[]>`

Autocompletado de direcciones.

**Ejemplo:**

```typescript
const suggestions = await geocodingService.suggest('Bogo', 5);
// suggestions: ['Bogotá, Colombia', 'Bogotá D.C.', ...]
```

#### `reverseGeocode(longitude: number, latitude: number): Promise<ReverseGeocodeResult | null>`

Convierte coordenadas a dirección.

**Ejemplo:**

```typescript
const result = await geocodingService.reverseGeocode(-74.08, 4.6);
// result: { address: 'Bogotá, Colombia', location: { x: -74.08, y: 4.60 } }
```

**Características:**

- 💾 Cache en memoria
- 🌍 Focus en región de Colombia
- 🚦 Error handling con mensajes en español
- ⚡ Singleton pattern

---

## 🎯 Página /mapa

Página principal que integra todos los componentes.

**Ubicación:** `src/app/mapa/page.tsx`

**Layout:**

```
┌─────────────────────────────────────────────┐
│ Header (MainLayout)                         │
├──────┬──────────────────────────────────────┤
│      │  [Search Bar]                        │
│ Side │                                       │
│ bar  │         MapContainer                 │
│      │                                       │
│      │  [Dataset Card]    [Controls]        │
└──────┴──────────────────────────────────────┘
                                    [Analytics Panel →]
```

**Componentes integrados:**

- MainLayout (Header + Sidebar)
- MapContainer (ArcGIS Map)
- MapSearchBar (top-left, floating)
- DatasetInfoCard (bottom-left, floating)
- MapControls (right-center, floating)
- AnalyticsSidePanel (right side, slide-in)

**Features:**

- ✅ Búsqueda con geocoding
- ✅ Información del dataset
- ✅ Controles de zoom y navegación
- ✅ Panel analytics con tabs
- ✅ Todas las animaciones funcionando
- ✅ Toast notifications
- ✅ Dark theme

---

## 📦 Dependencias Utilizadas

### Componentes UI

- `@radix-ui/react-dialog` - Command dialog
- `@radix-ui/react-tabs` - Tabs del panel
- `cmdk` - Command palette
- `framer-motion` - Animaciones
- `lucide-react` - Iconos

### Utilidades

- `date-fns` - Formateo de fechas
- `zustand` - State management (panel-store)
- `sonner` - Toast notifications

### ArcGIS

- `@arcgis/core/rest/locator` - Geocoding service
- `@arcgis/core/geometry/Point` - Geometrías

---

## 🎨 Temas y Estilos

### Colores

- Background: `#0F1419`
- Card background: `#1E2533`
- Border: `white/10`
- Primary accent: `#3B82F6`
- Text: `white`, `gray-400`

### Animaciones

- Duration: `300ms` (default)
- Easing: `ease-in-out`
- Framer Motion: `spring` (stiffness: 300, damping: 30)

### Blur Backdrops

- Backdrop blur: `backdrop-blur-sm`
- Opacity: `95%` (cards), `60%` (header)

---

## 🚀 Próximos Pasos (Fase 3)

- [ ] Implementar gráficos con Recharts en panel analytics
- [ ] Agregar métricas reales al ResumenTab
- [ ] Implementar DetallesTab con información de features
- [ ] Crear visualización de relaciones en RelacionesTab
- [ ] Integrar con datos reales del dataset
- [ ] Agregar filtros temporales (date-range picker)

---

## 📝 Notas Técnicas

### Geocoding

- El servicio usa **ArcGIS World Geocoding Service** (público)
- Extent limitado a Colombia: `xmin: -79.5, ymin: -4.5, xmax: -66.5, ymax: 13.5`
- Cache en memoria para reducir llamadas API
- Sugerencias mínimo 2 caracteres, geocoding mínimo 3

### Performance

- Debounce de 300ms en búsqueda
- Virtualization ready (TanStack Virtual)
- Lazy loading de componentes (considerar para Fase 3)
- Skeleton loading states

### Accesibilidad

- Keyboard shortcuts documentados
- Tooltips en todos los controles
- ARIA labels en componentes interactivos
- Focus management en modales

---

**Última actualización:** Noviembre 12, 2025  
**Fase:** 2 - Vista de Mapa ✅ Completada
