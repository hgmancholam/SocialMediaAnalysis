# Graph Components - Analytics Charts

Componentes de gráficos implementados en la Fase 3 del proyecto Net DNI usando **Recharts**.

## 📁 Estructura

```
src/features/graph/
├── components/
│   └── charts/
│       ├── TimeSeriesChart.tsx    # Gráfico de línea temporal
│       ├── BarChart.tsx           # Gráfico de barras
│       └── PieChart.tsx           # Gráfico circular/donut
src/components/ui/
└── date-range-picker.tsx          # Selector de rango de fechas
src/app/visualizaciones/
└── page.tsx                        # Página dashboard analytics
```

## 🎨 Componentes

### TimeSeriesChart

Gráfico de línea para visualización de datos temporales.

**Características:**

- 📈 Múltiples series (líneas)
- 🎯 Tooltip interactivo
- 📊 Legend configurable
- 🔍 Brush para zoom/pan
- 📅 Formateo de fechas con date-fns (español)
- ✨ Animaciones de entrada (600ms)
- 📱 Totalmente responsive

**Props:**

```typescript
interface TimeSeriesChartProps {
  data: DataPoint[]; // Array de datos con fecha
  series: {
    // Configuración de series
    key: string; // Key del data point
    name: string; // Nombre display
    color: string; // Color hex
  }[];
  height?: number; // Altura en px (default: 300)
  showBrush?: boolean; // Mostrar brush zoom (default: false)
  showLegend?: boolean; // Mostrar legend (default: true)
  xAxisLabel?: string; // Label eje X
  yAxisLabel?: string; // Label eje Y
}
```

**Uso:**

```tsx
const data = [
  { date: '2024-11-01', ventas: 245, visitas: 1200 },
  { date: '2024-11-02', ventas: 312, visitas: 1450 },
  // ...
];

<TimeSeriesChart
  data={data}
  series={[
    { key: 'ventas', name: 'Ventas', color: '#3B82F6' },
    { key: 'visitas', name: 'Visitas', color: '#10B981' },
  ]}
  height={350}
  showBrush={true}
/>;
```

---

### BarChart

Gráfico de barras para comparaciones.

**Características:**

- 📊 Modo Stacked o Grouped
- 🎯 Tooltip interactivo
- 📊 Legend configurable
- ↔️ Layout horizontal o vertical
- ✨ Animaciones de entrada (600ms)
- 📱 Totalmente responsive
- 🎨 Colores temáticos

**Props:**

```typescript
interface BarChartProps {
  data: Array<Record<string, string | number>>;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number; // Default: 300
  stacked?: boolean; // Default: false
  showLegend?: boolean; // Default: true
  xAxisKey?: string; // Default: 'name'
  xAxisLabel?: string;
  yAxisLabel?: string;
  layout?: 'vertical' | 'horizontal'; // Default: 'horizontal'
}
```

**Uso:**

```tsx
const data = [
  { name: 'Twitter', interacciones: 1250, engagement: 850 },
  { name: 'Facebook', interacciones: 980, engagement: 720 },
  { name: 'Instagram', interacciones: 1100, engagement: 890 },
];

// Barras agrupadas
<BarChart
  data={data}
  bars={[
    { key: 'interacciones', name: 'Interacciones', color: '#3B82F6' },
    { key: 'engagement', name: 'Engagement', color: '#10B981' },
  ]}
  stacked={false}
/>

// Barras horizontales
<BarChart
  data={data}
  bars={[{ key: 'usuarios', name: 'Usuarios', color: '#8B5CF6' }]}
  layout="horizontal"
  showLegend={false}
/>
```

---

### PieChart

Gráfico circular para distribuciones.

**Características:**

- 🍩 Modo Donut
- 📊 Percentages display
- 🎯 Tooltip interactivo
- 📊 Legend configurable
- ✨ Animaciones de entrada (600ms)
- 📱 Totalmente responsive

**Props:**

```typescript
interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
  height?: number; // Default: 300
  donut?: boolean; // Default: false
  showLegend?: boolean; // Default: true
  showPercentage?: boolean; // Default: true
}
```

**Uso:**

```tsx
const data = [
  { name: 'Twitter', value: 450, color: '#1DA1F2' },
  { name: 'Facebook', value: 320, color: '#4267B2' },
  { name: 'Instagram', value: 280, color: '#E4405F' },
];

<PieChart data={data} height={300} donut={true} showPercentage={true} />;
```

---

### DateRangePicker

Selector de rango de fechas con presets.

**Características:**

- 📅 Radix UI Popover
- 🚀 Presets rápidos (7d, 30d, 90d)
- 📅 date-fns formatting (español)
- ✨ Animaciones suaves
- 🎨 Dark theme

**Props:**

```typescript
interface DateRangePickerProps {
  value?: DateRange; // Rango actual
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}
```

**Uso:**

```tsx
import { DateRange } from 'react-day-picker';

const [dateRange, setDateRange] = useState<DateRange | undefined>({
  from: subDays(new Date(), 30),
  to: new Date(),
});

<DateRangePicker value={dateRange} onChange={setDateRange} />;
```

---

## 🎯 Página /visualizaciones

Dashboard completo de analytics con grid de gráficos.

**Ubicación:** `src/app/visualizaciones/page.tsx`

**Features:**

- 📊 6 gráficos diferentes
- 🎨 Responsive grid (2 columnas en desktop)
- 📅 Filtro de fecha global
- 💾 Botón export datos
- 📈 Cards de stats summary
- 🎨 Dark theme consistente

**Layout:**

```
┌─────────────────────────────────────────┐
│ Header + Filters                        │
├─────────────────────────────────────────┤
│ [TimeSeriesChart - Full Width]          │
├──────────────────────┬──────────────────┤
│ Platform Comparison  │ Distribution     │
├──────────────────────┼──────────────────┤
│ Regional Data        │ Sentiment        │
├──────────────────────┴──────────────────┤
│ [Summary Stats - 4 Cards]               │
└─────────────────────────────────────────┘
```

**Gráficos incluidos:**

1. **Actividad Temporal** - TimeSeriesChart con brush
2. **Comparativa por Plataforma** - BarChart grouped
3. **Distribución por Red Social** - PieChart donut
4. **Distribución Geográfica** - BarChart horizontal
5. **Análisis de Sentimiento** - PieChart regular
6. **Summary Stats** - 4 cards con métricas

---

## 🎨 Customización de Tooltips

Todos los gráficos tienen tooltips personalizados con:

- 🎨 Background: `#1E2533`
- 📦 Border: `white/10`
- 🎯 Shadow: `shadow-xl`
- 🔢 Formato numérico: `toLocaleString('es-CO')`
- 🎨 Colores de las series visibles

---

## 🎯 Integración con AnalyticsSidePanel

Los gráficos están integrados en el panel lateral del mapa:

**ResumenTab actualizado:**

- ✅ Cards de estadísticas generales
- ✅ TimeSeriesChart para actividad temporal
- ✅ PieChart para distribución por red social
- ✅ Datos mock para demostración

---

## 📦 Dependencias

### Recharts

```json
{
  "recharts": "^2.x.x"
}
```

### react-day-picker

```json
{
  "react-day-picker": "^9.x.x"
}
```

### Ya instaladas

- `date-fns` - Formateo de fechas
- `@radix-ui/react-popover` - Popover para date picker
- `lucide-react` - Iconos

---

## 🎨 Colores del Theme

```typescript
const colors = {
  // Primary
  primary: '#3B82F6', // Blue
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red

  // Platforms
  twitter: '#1DA1F2',
  facebook: '#4267B2',
  instagram: '#E4405F',
  tiktok: '#000000',
  linkedin: '#0A66C2',

  // Neutrals
  background: '#0F1419',
  card: '#1E2533',
  border: 'white/10',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
};
```

---

## 📝 Notas Técnicas

### Performance

- Recharts usa virtualización interna
- Animaciones optimizadas (will-change)
- ResponsiveContainer para redimensionamiento eficiente
- Debounce en filtros (considerar para Fase 4)

### Accesibilidad

- Tooltips con información completa
- Legend con iconos visuales
- Contraste de colores WCAG AA
- Labels descriptivos en ejes

### Datos Mock

Los datos actuales son mock para demostración. En producción:

- Conectar con analytics-service
- Implementar TanStack Query para cache
- Agregar loading states
- Manejar errores con error boundaries

---

## 🚀 Próximos Pasos (Fase 4)

- [ ] Conectar con datos reales del dataset
- [ ] Implementar filtros avanzados
- [ ] Agregar export CSV/PNG
- [ ] Implementar analytics-store con Zustand
- [ ] Agregar más tipos de gráficos (Area, Scatter, Radar)
- [ ] Implementar drill-down en gráficos
- [ ] Agregar comparaciones temporales

---

**Última actualización:** Noviembre 12, 2025  
**Fase:** 3 - Gráficos Analytics ✅ Completada
