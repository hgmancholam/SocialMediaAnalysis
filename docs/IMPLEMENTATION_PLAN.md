# Plan de Implementación - Net DNI

**Proyecto**: Net DNI - Visualización de Datos de Redes Sociales  
**Fecha de Inicio**: Noviembre 12, 2025  
**Duración Estimada**: 5 semanas  
**Enfoque**: UX-First Development

---

## 📋 Resumen Ejecutivo

Este plan detalla la implementación completa de Net DNI siguiendo un enfoque **UX-First**, priorizando la experiencia de usuario en cada componente. La aplicación será desarrollada en 5 fases incrementales, cada una con entregables específicos y verificables.

### Estado Actual

- ✅ **Arquitectura completa** definida
- ✅ **Librerías UX** instaladas (Radix UI, Framer Motion, Recharts, etc.)
- ✅ **Documentación** actualizada con directrices UX
- ✅ **Configuración** del proyecto (Next.js, TypeScript, Tailwind)
- 🔄 **Listo para comenzar** implementación

---

## 🎯 Objetivos por Fase

| Fase       | Duración | Objetivo Principal | Entregables                                        | Estado        |
| ---------- | -------- | ------------------ | -------------------------------------------------- | ------------- |
| **Fase 1** | Semana 1 | Fundamentos UI/UX  | Header, Sidebar, Layout, Componentes base          | ✅ Completada |
| **Fase 2** | Semana 2 | Vista de Mapa      | MapContainer, Búsqueda, Cards flotantes, Controles | ✅ Completada |
| **Fase 3** | Semana 3 | Analytics          | Gráficos Recharts, Panel lateral, Tabs             | ✅ Completada |
| **Fase 4** | Semana 4 | Vista de Red       | NetworkGraph D3, Filtros, Interacciones            | 🔄 Pendiente  |
| **Fase 5** | Semana 5 | Polish & Testing   | Animaciones finales, Mobile, Optimización          | 🔄 Pendiente  |

---

## 📅 FASE 1: Fundamentos UI/UX (Semana 1)

**Objetivo**: Establecer la base de componentes reutilizables y el layout principal de la aplicación.

### Día 1-2: Setup Inicial y Componentes Base

#### Tareas

1. **Setup shadcn/ui**

   ```bash
   npx shadcn@latest init
   ```

   - Configurar con Tailwind CSS v4
   - Seleccionar tema oscuro por defecto
   - Path aliases (@/components)

2. **Instalar componentes base shadcn/ui**

   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add input
   npx shadcn@latest add label
   npx shadcn@latest add separator
   npx shadcn@latest add skeleton
   npx shadcn@latest add dialog
   ```

3. **Crear Componentes UI Personalizados**
   - `src/components/ui/Badge.tsx`
     - Variants: default, success, warning, error
     - Sizes: sm, md
   - `src/components/ui/Tooltip.tsx` (wrapper de Radix)
     - Position: top, right, bottom, left
     - Con animación Framer Motion

4. **Configurar Providers Globales**
   - `src/components/providers/ToastProvider.tsx` (Sonner)
   - `src/app/layout.tsx` - Agregar providers

#### Criterios de Aceptación

- [ ] shadcn/ui instalado y funcionando
- [ ] 8+ componentes base disponibles
- [ ] Badge y Tooltip personalizados creados
- [ ] Toast notifications funcionando
- [ ] Tema oscuro aplicado correctamente

---

### Día 3-4: Header y Sidebar

#### Tareas

1. **Crear Header Component**
   - Path: `src/components/layout/Header.tsx`
   - **Elementos**:
     - Logo "Net DNI" (SVG triangular azul)
     - Navegación: Dashboard, Mapa, Visualizaciones
     - Notification Bell con badge
     - User Profile Dropdown (Radix Dropdown)
   - **UX Features**:
     - Sticky position con backdrop blur
     - Dropdown animado con Framer Motion
     - Tooltips en iconos
     - Active route highlighting
     - Responsive: ocultar navegación en mobile

2. **Crear Sidebar Component**
   - Path: `src/components/layout/Sidebar.tsx`
   - **Elementos**:
     - Logo colapsable
     - Menu items (Dashboard, Mapa, Visualizaciones)
     - Iconos Lucide React
     - Collapse button
   - **UX Features**:
     - Animación slide con Framer Motion
     - Width: 240px expandido, 64px colapsado
     - Hover tooltips cuando colapsado
     - Keyboard navigation
     - Persistir estado en localStorage

3. **Crear Layout Principal**
   - Path: `src/components/layout/MainLayout.tsx`
   - Estructura: Header + Sidebar + Main Content
   - Responsive grid

#### Criterios de Aceptación

- [ ] Header sticky funcionando con blur
- [ ] Dropdown de usuario con Radix UI
- [ ] Notification bell con badge dinámico
- [ ] Sidebar expandible/colapsable
- [ ] Animaciones suaves (300ms)
- [ ] Estado persistido en localStorage
- [ ] Responsive en mobile (sidebar overlay)

---

### Día 5: Store y Hooks Globales

#### Tareas

1. **Crear UI Store (Zustand)**
   - Path: `src/store/ui-store.ts`
   - Estado:
     ```typescript
     {
       isSidebarCollapsed: boolean;
       toggleSidebar: () => void;
       theme: 'dark' | 'light';
       setTheme: (theme) => void;
     }
     ```

2. **Crear Panel Store**
   - Path: `src/store/panel-store.ts`
   - Estado:
     ```typescript
     {
       isAnalyticsPanelOpen: boolean;
       analyticsPanelWidth: number;
       activeTab: 'resumen' | 'detalles' | 'relaciones';
       toggleAnalyticsPanel: () => void;
       setAnalyticsPanelWidth: (width: number) => void;
       setActiveTab: (tab: string) => void;
     }
     ```

3. **Crear Custom Hooks**
   - `src/hooks/useBreakpoint.ts` - Hook para responsive
   - `src/hooks/useToast.ts` - Wrapper de Sonner

#### Criterios de Aceptación

- [ ] ui-store funcionando
- [ ] panel-store funcionando
- [ ] Hooks custom creados y documentados
- [ ] TypeScript types completos
- [ ] Persistencia en localStorage

---

### Entregables Fase 1

- ✅ Sistema de componentes base (shadcn/ui + custom)
- ✅ Header con navegación y user menu
- ✅ Sidebar colapsable con animaciones
- ✅ Layout principal responsive
- ✅ Stores Zustand (UI y Panel)
- ✅ Toast notifications funcionando
- ✅ Tema oscuro aplicado

---

## 📅 FASE 2: Vista de Mapa (Semana 2)

**Objetivo**: Implementar la vista principal del mapa con búsqueda, controles y cards flotantes.

### Día 1-2: Componentes Flotantes del Mapa

#### Tareas

1. **MapSearchBar Component**
   - Path: `src/features/map/components/MapSearchBar.tsx`
   - **Features**:
     - Input con icono Search (Lucide)
     - Autocomplete con cmdk
     - Geocoding con ArcGIS Locator
     - Recent searches (localStorage)
   - **UX**:
     - Blur backdrop
     - Fuzzy search
     - Keyboard shortcuts (Ctrl+K abre)
     - Loading spinner durante búsqueda
     - Toast en errores

2. **DatasetInfoCard Component**
   - Path: `src/features/map/components/DatasetInfoCard.tsx`
   - **Contenido**:
     - Título: "Análisis Demográfico 2024"
     - Total registros (formato: 1,234,567)
     - Última actualización (date-fns: "hace 2h")
     - Icono Database
   - **UX**:
     - Card flotante bottom-left
     - Collapsible con animación
     - Blur backdrop
     - Slide up animation al montar
     - Skeleton mientras carga

3. **MapControls Component**
   - Path: `src/features/map/components/MapControls.tsx`
   - **Controles**:
     - Zoom In (+)
     - Zoom Out (-)
     - Drag Toggle (Hand icon)
     - Fullscreen (Maximize icon)
   - **UX**:
     - Floating right con backdrop blur
     - Tooltips Radix UI
     - Active state visual
     - Hover effects
     - Disabled states cuando procede

#### Criterios de Aceptación

- [ ] MapSearchBar con autocomplete funcionando
- [ ] Geocoding integrado con ArcGIS
- [ ] DatasetInfoCard con datos reales
- [ ] date-fns formateando "hace X tiempo"
- [ ] MapControls con todos los botones
- [ ] Tooltips en todos los controles
- [ ] Animaciones suaves en todos los componentes
- [ ] Responsive: componentes se adaptan

---

### Día 3-4: Panel Lateral Analytics

#### Tareas

1. **AnalyticsSidePanel Component**
   - Path: `src/components/layout/AnalyticsSidePanel.tsx`
   - **Estructura**:
     - Tabs: Resumen, Detalles, Relaciones (Radix Tabs)
     - Toggle button (chevron left/right)
     - Resize handle (react-resizable-panels)
   - **UX**:
     - Width: 0px (cerrado) → 420px (abierto)
     - Min: 320px, Max: 600px
     - Smooth transition (300ms)
     - Persistir width en localStorage
     - Keyboard shortcut: Ctrl+B toggle

2. **Tab Content Components**
   - `ResumenTab.tsx` - Placeholder para gráficos
   - `DetallesTab.tsx` - Placeholder para info
   - `RelacionesTab.tsx` - Placeholder para mini graph

#### Criterios de Aceptación

- [ ] Panel lateral expandible/colapsable
- [ ] Tabs Radix UI funcionando
- [ ] Redimensionable con react-resizable-panels
- [ ] Animación smooth (Framer Motion)
- [ ] Width persistido en localStorage
- [ ] Keyboard shortcut funcionando
- [ ] Active tab visual feedback

---

### Día 5: Integración con MapContainer

#### Tareas

1. **Mejorar MapContainer Existente**
   - Path: `src/components/map/MapContainer.tsx`
   - **Agregar**:
     - Loading skeleton mientras carga
     - Error boundary con retry button
     - Toast notifications para errores
     - Click handler para features

2. **Crear Map Store**
   - Path: `src/features/map/store/map-store.ts`
   - Estado:
     ```typescript
     {
       mapView: __esri.MapView | null;
       selectedFeatures: string[];
       searchQuery: string;
       isLoading: boolean;
       error: string | null;
     }
     ```

3. **Integrar Todos los Componentes**
   - Página principal: Mapa + SearchBar + DatasetCard + Controls + Panel

#### Criterios de Aceptación

- [ ] MapContainer con loading skeleton
- [ ] Error boundary con mensaje amigable
- [ ] map-store funcionando
- [ ] Click en mapa selecciona features
- [ ] Panel se abre al seleccionar feature
- [ ] Toast notifications en errores
- [ ] Layout responsive completo

---

### Entregables Fase 2

- ✅ MapSearchBar con autocomplete y geocoding
- ✅ DatasetInfoCard flotante con info dinámica
- ✅ MapControls flotantes con tooltips
- ✅ AnalyticsSidePanel redimensionable
- ✅ MapContainer mejorado con UX features
- ✅ map-store con Zustand
- ✅ Vista de mapa completa y funcional

---

## 📅 FASE 3: Gráficos Analytics (Semana 3)

**Objetivo**: Implementar gráficos estadísticos con Recharts en el panel lateral.

### Día 1-2: Gráfico de Distribución por Tipo

#### Tareas

1. **DistribucionPorTipoChart Component**
   - Path: `src/features/graph/components/DistribucionPorTipoChart.tsx`
   - **Features**:
     - Bar Chart vertical (Recharts)
     - Categorías: A, B, C, D
     - Header con trend (+5.2%)
     - Tooltip interactivo
   - **UX**:
     - Animación de entrada (600ms)
     - Hover effects en barras
     - Click to filter by category
     - Loading skeleton
     - Responsive width 100%

2. **Crear Mock Data Service**
   - Path: `src/features/graph/services/analytics-service.ts`
   - Funciones:
     - `getDistribucionPorTipo()`
     - `getVolumenPorRegion()`

#### Criterios de Aceptación

- [ ] Chart Recharts renderizando correctamente
- [ ] Animación de entrada suave
- [ ] Tooltip mostrando valores
- [ ] Click en barra filtra datos
- [ ] Trend indicator con color (verde/rojo)
- [ ] Loading state con skeleton
- [ ] Responsive

---

### Día 3-4: Gráfico de Volumen por Región

#### Tareas

1. **VolumenPorRegionChart Component**
   - Path: `src/features/graph/components/VolumenPorRegionChart.tsx`
   - **Features**:
     - Horizontal bar chart (Recharts)
     - Regiones: Norte, Sur, Este, Oeste
     - Background bar + filled bar
     - Header con trend (-1.8%)
   - **UX**:
     - Animación de entrada (600ms)
     - Hover highlight region
     - Click to filter by region
     - Porcentaje visual
     - Loading skeleton

2. **Integrar en AnalyticsSidePanel**
   - ResumenTab: ambos gráficos
   - Layout vertical con spacing

#### Criterios de Aceptación

- [ ] Horizontal bar chart funcionando
- [ ] Animación de entrada
- [ ] Hover effects
- [ ] Click to filter
- [ ] Trend indicator
- [ ] Ambos gráficos en ResumenTab
- [ ] Spacing y layout correcto

---

### Día 5: Estado y Filtros

#### Tareas

1. **Crear Analytics Store**
   - Path: `src/features/graph/store/analytics-store.ts`
   - Estado:
     ```typescript
     {
       distribucionData: ChartData[];
       volumenData: ChartData[];
       filters: {
         category?: string;
         region?: string;
       };
       applyFilter: (type, value) => void;
       clearFilters: () => void;
     }
     ```

2. **Conectar Gráficos con Store**
   - Click en barra actualiza filtros
   - Gráficos reflejan filtros activos
   - Toast notification al aplicar filtro

3. **TanStack Query Integration**
   - Hooks para fetch data
   - Loading states
   - Error handling

#### Criterios de Aceptación

- [ ] analytics-store funcionando
- [ ] Filtros aplicándose correctamente
- [ ] Gráficos respondiendo a filtros
- [ ] TanStack Query caching data
- [ ] Toast notifications en acciones
- [ ] Loading states en ambos gráficos

---

### Entregables Fase 3

- ✅ DistribucionPorTipoChart con Recharts
- ✅ VolumenPorRegionChart con Recharts
- ✅ analytics-store con filtros
- ✅ TanStack Query integrado
- ✅ Interacciones click-to-filter
- ✅ Animaciones de entrada
- ✅ ResumenTab completo y funcional

---

## 📅 FASE 4: Vista de Red (Semana 4)

**Objetivo**: Implementar el gráfico de red force-directed con D3.js y controles de filtrado.

### Día 1-2: NetworkGraph Base

#### Tareas

1. **NetworkGraph Component**
   - Path: `src/features/graph/components/NetworkGraph.tsx`
   - **Setup**:
     - Canvas o SVG (decidir por performance)
     - D3 force simulation con d3-force
     - Node types: person, organization, event
     - Edge rendering con strength visual
   - **UX**:
     - Loading skeleton durante init
     - Zoom/Pan con mouse y touch
     - Gradiente de fondo oscuro

2. **Node Rendering**
   - Tamaños dinámicos por conexiones
   - Colores por tipo:
     - Person: #3B82F6
     - Organization: #10B981
     - Event: #8B5CF6
   - Labels visibles en hover

3. **Edge Rendering**
   - Width por strength (1-5px)
   - Opacity por strength (0.2-0.8)
   - Color: rgba(255, 255, 255, 0.2)

#### Criterios de Aceptación

- [ ] D3 force simulation funcionando
- [ ] Nodos renderizando correctamente
- [ ] Edges renderizando correctamente
- [ ] Colores por tipo aplicados
- [ ] Zoom/Pan funcionando
- [ ] Loading skeleton

---

### Día 3: Interacciones del Grafo

#### Tareas

1. **Drag de Nodos**
   - Implementar con @use-gesture/react
   - Nodo sigue el cursor/touch
   - Simulation se reinicia al soltar

2. **Hover Effects**
   - Nodo hover: scale 1.2, mostrar label
   - Highlight conexiones del nodo
   - Atenuar otros nodos (opacity 0.3)
   - Animación con Framer Motion

3. **Click Selection**
   - Click en nodo lo selecciona
   - Visual feedback (borde destacado)
   - Abre NodeDetailsPanel
   - Highlight conexiones

#### Criterios de Aceptación

- [ ] Drag funcionando (mouse y touch)
- [ ] Hover effects suaves
- [ ] Click selecciona nodo
- [ ] Highlight de conexiones
- [ ] Animaciones fluidas (Framer Motion)

---

### Día 4: Filtros y Controles

#### Tareas

1. **FilterControlsPanel Component**
   - Path: `src/features/graph/components/FilterControlsPanel.tsx`
   - **Elementos**:
     - Search input (cmdk)
     - Entity type checkboxes (Radix Checkbox)
       - Person, Organization, Event
     - Connection strength slider (Radix Slider)
     - Botones: Aplicar, Reiniciar
   - **UX**:
     - Toast notification al aplicar
     - Loading state en botón Aplicar
     - Badge con count de filtros activos

2. **Graph Store**
   - Path: `src/features/graph/store/graph-store.ts`
   - Estado:
     ```typescript
     {
       nodes: Node[];
       edges: Edge[];
       selectedNodeId: string | null;
       filters: GraphFilters;
       applyFilters: (filters) => void;
       clearFilters: () => void;
       selectNode: (id) => void;
     }
     ```

3. **Integrar Filtros con NetworkGraph**
   - Filtrar nodos/edges según criterios
   - Animación de transición entre estados
   - Re-run simulation con nuevos datos

#### Criterios de Aceptación

- [ ] FilterControlsPanel completo
- [ ] Checkboxes Radix funcionando
- [ ] Slider Radix funcionando
- [ ] Search con cmdk
- [ ] graph-store funcionando
- [ ] Filtros aplicándose correctamente
- [ ] Animación de transición
- [ ] Toast notifications

---

### Día 5: NodeDetailsPanel

#### Tareas

1. **NodeDetailsPanel Component**
   - Path: `src/features/graph/components/NodeDetailsPanel.tsx`
   - **Contenido**:
     - Empty state: "Seleccione un nodo..."
     - Node selected:
       - Basic info (ID, Nombre, Categoría, Conexiones)
       - Lista de conexiones (TanStack Table)
       - Badge por categoría
   - **UX**:
     - Panel lateral derecho (380px)
     - Slide in animation (Framer Motion)
     - Virtual scrolling para lista larga (TanStack Virtual)
     - Close button

2. **ConnectionsList Component**
   - TanStack Table con columnas:
     - Target Name
     - Strength (barra visual)
   - Virtual scrolling si >50 items

#### Criterios de Aceptación

- [ ] NodeDetailsPanel lateral derecho
- [ ] Empty state mostrado
- [ ] Info de nodo seleccionado
- [ ] ConnectionsList con TanStack Table
- [ ] Virtual scrolling funcionando
- [ ] Slide in animation
- [ ] Close button funcional

---

### Entregables Fase 4

- ✅ NetworkGraph con D3 force simulation
- ✅ Drag, Hover, Click interactions
- ✅ FilterControlsPanel completo
- ✅ graph-store con filtros
- ✅ NodeDetailsPanel lateral
- ✅ ConnectionsList con TanStack Table
- ✅ Vista de red completa y funcional

---

## 📅 FASE 5: Polish & Testing (Semana 5)

**Objetivo**: Refinamiento final, animaciones, responsive, testing y optimización.

### Día 1: NetworkMiniGraph

#### Tareas

1. **NetworkMiniGraph Component**
   - Path: `src/features/graph/components/NetworkMiniGraph.tsx`
   - **Features**:
     - Vista preview (320x240px)
     - Layout radial
     - Centro: nodo seleccionado
     - Around: max 10 nodos cercanos
   - **UX**:
     - Animación de entrada
     - Click to expand (navega a vista completa)
     - Non-interactive (solo visual)

2. **Integrar en RelacionesTab**
   - AnalyticsSidePanel → RelacionesTab
   - Mostrar NetworkMiniGraph cuando hay nodo seleccionado

#### Criterios de Aceptación

- [ ] NetworkMiniGraph renderizando
- [ ] Layout radial correcto
- [ ] Animación de entrada
- [ ] Click to expand funcionando
- [ ] Integrado en RelacionesTab

---

### Día 2: Animaciones Finales

#### Tareas

1. **Page Transitions**
   - Framer Motion AnimatePresence
   - Fade entre rutas
   - Duration: 300ms

2. **Loading States Refinamiento**
   - Skeleton en todos los componentes
   - Shimmer effect
   - Spinner consistente

3. **Hover Effects Refinamiento**
   - Cards: translateY(-2px), shadow
   - Buttons: scale(1.02)
   - Links: color transition

4. **Micro-interactions**
   - Button press: scale(0.98)
   - Checkbox: checkmark animation
   - Toggle: slide animation

#### Criterios de Aceptación

- [ ] Page transitions suaves
- [ ] Loading states consistentes
- [ ] Hover effects pulidos
- [ ] Micro-interactions implementadas
- [ ] 60 FPS en todas las animaciones

---

### Día 3: Mobile Responsive

#### Tareas

1. **Mobile Layout Adjustments**
   - Header: altura 56px (vs 64px desktop)
   - Sidebar: overlay modal, no visible por defecto
   - MapSearchBar: oculto, botón flotante abre modal
   - AnalyticsSidePanel: modal full-screen
   - NetworkGraph: touch optimizado

2. **Touch Gestures**
   - Map: pinch to zoom
   - Graph: drag nodes con touch
   - Panels: swipe to close

3. **Breakpoint Testing**
   - Mobile: < 640px
   - Tablet: 641-1024px
   - Desktop: > 1025px

#### Criterios de Aceptación

- [ ] Mobile layout funcionando
- [ ] Sidebar como overlay
- [ ] Panels como modales en mobile
- [ ] Touch gestures funcionando
- [ ] No horizontal scroll
- [ ] All features accesibles en mobile

---

### Día 4: Performance & Optimization

#### Tareas

1. **Code Splitting**

   ```typescript
   const NetworkGraph = lazy(() => import('@/features/graph/components/NetworkGraph'));
   ```

   - Lazy load para NetworkGraph
   - Lazy load para charts pesados

2. **Memoization**
   - memo() en componentes pesados
   - useMemo() para cálculos costosos
   - useCallback() para handlers

3. **Virtual Scrolling**
   - Verificar TanStack Virtual en listas largas
   - ConnectionsList
   - Node list en filtros

4. **Web Workers** (opcional)
   - D3 force simulation en worker
   - Cálculos pesados fuera del main thread

#### Criterios de Aceptación

- [ ] Bundle size < 500KB (inicial)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] No re-renders innecesarios

---

### Día 5: Testing Final

#### Tareas

1. **Manual Testing Checklist**
   - [ ] Todas las rutas funcionan
   - [ ] Login/Logout flow
   - [ ] Map carga correctamente
   - [ ] Search geocoding funciona
   - [ ] Gráficos muestran datos
   - [ ] Filtros aplican correctamente
   - [ ] NetworkGraph interactivo
   - [ ] Drag nodes funciona
   - [ ] Panels redimensionables
   - [ ] Responsive en 3 breakpoints
   - [ ] Touch gestures (mobile)
   - [ ] Keyboard navigation
   - [ ] Toast notifications
   - [ ] Loading states
   - [ ] Error handling

2. **Accessibility Testing**
   - [ ] Screen reader compatible
   - [ ] Keyboard navigation completa
   - [ ] ARIA labels correctos
   - [ ] Color contrast WCAG AA
   - [ ] Focus visible

3. **Browser Testing**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Edge

4. **Bug Fixing**
   - Documentar bugs encontrados
   - Priorizar y resolver

#### Criterios de Aceptación

- [ ] 100% features funcionando
- [ ] 0 bugs críticos
- [ ] Accessibility passing
- [ ] Cross-browser compatible
- [ ] Performance targets alcanzados

---

### Entregables Fase 5

- ✅ NetworkMiniGraph en RelacionesTab
- ✅ Animaciones finales pulidas
- ✅ Mobile responsive completo
- ✅ Performance optimizada
- ✅ Testing completo ejecutado
- ✅ Bug fixing realizado
- ✅ **Aplicación lista para producción** 🚀

---

## 📊 Métricas de Éxito

### Performance Targets

| Métrica                  | Target  | Herramienta             |
| ------------------------ | ------- | ----------------------- |
| First Contentful Paint   | < 1.5s  | Lighthouse              |
| Time to Interactive      | < 3s    | Lighthouse              |
| Largest Contentful Paint | < 2.5s  | Lighthouse              |
| Cumulative Layout Shift  | < 0.1   | Lighthouse              |
| Total Bundle Size        | < 500KB | Webpack Bundle Analyzer |
| Lighthouse Score         | > 90    | Chrome DevTools         |

### UX Metrics

| Métrica              | Target                |
| -------------------- | --------------------- |
| WCAG Compliance      | AA                    |
| Keyboard Navigation  | 100%                  |
| Touch Gestures       | All major gestures    |
| Animation Frame Rate | 60 FPS                |
| Loading States       | All async operations  |
| Error Handling       | All failure scenarios |

---

## 🛠️ Herramientas de Desarrollo

### Durante Desarrollo

```bash
# Dev server con Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Check prettier
npm run format:check
```

### Testing Performance

```bash
# Build production
npm run build

# Analyze bundle
npm run analyze  # Agregar script en package.json

# Lighthouse CI (local)
npx lighthouse http://localhost:3000
```

### Debugging

- React DevTools
- Redux DevTools (Zustand devtools)
- TanStack Query Devtools
- ArcGIS DevTools

---

## 📝 Checklist por Componente

### Cada Componente Debe Tener

- [ ] TypeScript types completos
- [ ] JSDoc comments
- [ ] Props interface documentada
- [ ] Loading state
- [ ] Error handling
- [ ] Accessibility (ARIA)
- [ ] Responsive design
- [ ] Animación apropiada
- [ ] Storybook story (opcional)
- [ ] Tests (opcional para PoC)

---

## 🚨 Riesgos y Mitigación

| Riesgo                     | Probabilidad | Impacto | Mitigación                                 |
| -------------------------- | ------------ | ------- | ------------------------------------------ |
| Performance issues con D3  | Media        | Alto    | Web Workers, Canvas, Memoization           |
| ArcGIS API learning curve  | Alta         | Medio   | Documentación oficial, abstraction layer   |
| Mobile gestures conflictos | Media        | Medio   | Test early, @use-gesture library           |
| Bundle size > target       | Media        | Medio   | Code splitting, tree shaking, lazy loading |
| Cross-browser issues       | Baja         | Alto    | Test en múltiples browsers desde Fase 1    |

---

## 📞 Puntos de Control (Check-ins)

### Fin de Cada Semana

- Review de entregables completados
- Demo de features nuevas
- Identificar blockers
- Ajustar plan si necesario

### Preguntas Clave

1. ¿Se cumplieron los objetivos de la fase?
2. ¿Hay bugs críticos sin resolver?
3. ¿Performance targets alcanzados?
4. ¿UX checklist completo?
5. ¿Necesitamos ajustar el timeline?

---

## 🎯 Definición de "Done"

Una feature está "Done" cuando:

- ✅ Código implementado según spec
- ✅ TypeScript sin errores
- ✅ Linting pasando
- ✅ Loading state implementado
- ✅ Error handling implementado
- ✅ Animaciones suaves (60 FPS)
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Accessibility checklist completo
- ✅ Manual testing exitoso
- ✅ Code reviewed
- ✅ Documentación actualizada
- ✅ Merged a feat/uidesign branch

---

## 📚 Recursos

### Documentación de Librerías

- [Radix UI](https://radix-ui.com/)
- [Framer Motion](https://framer.com/motion)
- [Recharts](https://recharts.org/)
- [D3.js](https://d3js.org/)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Table](https://tanstack.com/table)
- [TanStack Virtual](https://tanstack.com/virtual)
- [cmdk](https://cmdk.paco.me/)
- [Sonner](https://sonner.emilkowal.ski/)
- [date-fns](https://date-fns.org/)

### Inspiración UX

- [Uber Movement](https://movement.uber.com/)
- [ArcGIS Dashboards](https://www.esri.com/en-us/arcgis/products/arcgis-dashboards)
- [Observable](https://observablehq.com/)
- [Gephi](https://gephi.org/)

---

## ✅ Estado del Proyecto

**Fecha Actual**: Noviembre 12, 2025  
**Fase Actual**: Preparación para Fase 1  
**Progreso General**: 10% (Setup completo)

### Completado

- [x] Arquitectura definida
- [x] Librerías UX instaladas
- [x] Documentación completa
- [x] Configuración del proyecto

### Próximo Hito

**Inicio Fase 1**: Semana del 13 de Noviembre, 2025  
**Entregable**: Fundamentos UI/UX completos

---

**Documento creado**: Noviembre 12, 2025  
**Versión**: 1.0.0  
**Autor**: GitHub Copilot  
**Estado**: ✅ Listo para comenzar implementación
