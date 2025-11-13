# Implementación de Capa de Usuarios Influyentes

## Resumen

Se ha implementado una nueva capa de visualización geográfica que muestra automáticamente los usuarios georeferenciados con puntos de tamaño variable según su nivel de influencia en redes sociales.

## Características Implementadas

### 1. Servicio de Cálculo de Influencia (`user-influence-service.ts`)

**Ubicación:** `src/features/map/services/user-influence-service.ts`

**Funcionalidades:**

- Cálculo de puntuación de influencia basado en:
  - Seguidores (50% de peso)
  - Actividad de tweets (20% de peso)
  - Inclusión en listas (15% de peso)
  - Cuentas seguidas (10% de peso)
  - Bonus de 20% para cuentas verificadas

- Normalización de scores a escala 0-1 para visualización uniforme
- Cálculo de tamaños de punto (8-40 píxeles)
- Gradiente de colores:
  - **Amarillo → Naranja**: Baja influencia (0-0.33)
  - **Naranja → Rojo-Naranja**: Media influencia (0.33-0.66)
  - **Rojo-Naranja → Rojo Oscuro**: Alta influencia (0.66-1.0)

### 2. Extensión del Servicio de Mapa (`map-service.ts`)

**Nuevos métodos añadidos:**

- `createInfluenceLayer(users: User[])`: Crea la capa con todos los usuarios georeferenciados
- `getInfluenceLayer()`: Obtiene referencia a la capa de influencia
- `toggleInfluenceLayerVisibility()`: Alterna visibilidad de la capa
- `removeInfluenceLayer()`: Elimina la capa del mapa
- `getInfluenceData()`: Obtiene datos de influencia calculados

**Características de la capa:**

- ID único: `'users-influence-layer'`
- Título: `'Usuarios Influyentes'`
- Visible por defecto: `true`
- Popups interactivos con información detallada del usuario

### 3. Integración en la Página del Mapa (`page.tsx`)

**Carga automática:**

- La capa se carga automáticamente cuando el mapa y el dataset están listos
- Notificación toast con el número de usuarios visualizados
- Manejo de errores con mensajes informativos

### 4. Información Mostrada en Popups

Cada punto de usuario muestra:

- Nombre y username (@username)
- Puntuación de influencia
- Número de seguidores
- Número de cuentas seguidas
- Total de tweets
- Inclusión en listas
- Coordenadas geográficas (latitud/longitud)

### 5. Control de Capas

La capa de usuarios influyentes:

- ✅ Aparece automáticamente en la lista de capas (`LayersControl`)
- ✅ Se puede ocultar/mostrar con el botón de visibilidad
- ✅ Se puede eliminar del mapa
- ✅ Se identifica como capa dinámica (no es parte del WebMap base)

## Algoritmo de Influencia

```typescript
influenceScore = followers * 0.5 + following * 0.1 + tweets * 0.2 + listed * 0.15;

if (verified) {
  influenceScore *= 1.2; // 20% bonus
}
```

## Visualización

### Tamaños de Punto

- **Mínimo:** 8 píxeles (menor influencia)
- **Máximo:** 40 píxeles (mayor influencia)
- Cálculo proporcional basado en el score normalizado

### Esquema de Colores

| Nivel de Influencia | Score Normalizado | Color RGB (aprox)          |
| ------------------- | ----------------- | -------------------------- |
| Baja                | 0.0 - 0.33        | Amarillo → Naranja         |
| Media               | 0.33 - 0.66       | Naranja → Rojo-Naranja     |
| Alta                | 0.66 - 1.0        | Rojo-Naranja → Rojo Oscuro |

### Estilo de Puntos

- **Relleno:** Color gradiente según influencia
- **Borde:** Blanco semi-transparente (2px)
- **Opacidad:** 100%

## Archivos Modificados

1. **Nuevo:** `src/features/map/services/user-influence-service.ts`
2. **Modificado:** `src/features/map/services/map-service.ts`
3. **Modificado:** `src/app/mapa/page.tsx`
4. **Modificado:** `src/features/map/index.ts`

## Uso

### Carga Automática

La capa se carga automáticamente al renderizar la página del mapa con el dataset.

### Uso Programático

```typescript
import { mapService } from '@/features/map';
import { useDataset } from '@/lib/data/useDataset';

// En tu componente
const { dataset } = useDataset();

// Crear capa de influencia
await mapService.createInfluenceLayer(dataset.users);

// Obtener datos de influencia
const influenceData = mapService.getInfluenceData();

// Toggle visibilidad
mapService.toggleInfluenceLayerVisibility();

// Remover capa
mapService.removeInfluenceLayer();
```

### Uso del Servicio de Influencia

```typescript
import {
  getUsersWithInfluence,
  getTopInfluentialUsers,
  calculatePointSize,
  getInfluenceColor,
} from '@/features/map';

// Calcular influencia de usuarios
const usersWithInfluence = getUsersWithInfluence(users);

// Obtener top 10
const topUsers = getTopInfluentialUsers(usersWithInfluence, 10);

// Calcular tamaño de punto
const size = calculatePointSize(0.8); // 34.4 píxeles

// Obtener color
const color = getInfluenceColor(0.8); // [234, 68, 24, 255]
```

## Configuración Personalizada

```typescript
import { userInfluenceService } from '@/features/map';

// Configurar pesos personalizados
userInfluenceService.setConfig({
  followerWeight: 0.6,
  followingWeight: 0.05,
  tweetWeight: 0.25,
  listedWeight: 0.1,
  verifiedBonus: 1.5, // 50% bonus
});

// Calcular con nueva configuración
const influence = userInfluenceService.calculateInfluence(users);
```

## Optimizaciones

- **Cache:** Los datos de influencia se cachean para evitar recálculos
- **Normalización:** Los scores se normalizan automáticamente para consistencia visual
- **Filtrado:** Solo se procesan usuarios con coordenadas geográficas válidas
- **Batch Loading:** Los gráficos se cargan en batch para mejor rendimiento

## Próximas Mejoras Sugeridas

1. **Clustering:** Agrupar puntos cercanos en niveles de zoom bajo
2. **Filtros:** Permitir filtrar por rango de influencia
3. **Análisis Temporal:** Evolución de influencia en el tiempo
4. **Heatmap:** Visualización alternativa con mapa de calor
5. **Comparación:** Comparar influencia entre regiones geográficas

## Notas Técnicas

- La capa utiliza `GraphicsLayer` de ArcGIS para renderizado eficiente
- Los popups son nativos de ArcGIS con HTML personalizado
- La capa se integra automáticamente con el sistema de control de capas existente
- Compatible con el sistema de WebMap de ArcGIS Online
