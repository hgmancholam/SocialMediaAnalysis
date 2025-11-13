# Net Frontend

> **Visualización geográfica de datos de redes sociales enriquecidas**

Una aplicación web moderna basada en ArcGIS Maps SDK y Next.js que visualiza datos de redes sociales (X/Twitter) relacionados con la vía Bogotá-Villavicencio en Colombia, combinando mapas interactivos con visualizaciones de grafos.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Características Principales

- **Mapas Interactivos**: Integración completa con ArcGIS Maps SDK for JavaScript
- **Visualización de Grafos**: Visualizaciones D3.js de datos de redes sociales
- **Autenticación**: OAuth 2.0 con Portal for ArcGIS
- **Arquitectura Escalable**: Diseño modular basado en features
- **Exportación Estática**: Optimizado para despliegue en IIS
- **TypeScript**: Type-safety completo en toda la aplicación
- **Estado Global**: Zustand + TanStack Query para gestión de estado
- **UI Moderna**: Tailwind CSS + shadcn/ui components

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
# Node.js v20.x o superior
node --version

# npm v10.x o superior
npm --version
```

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd net-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### Configuración

Edita `.env.local` con tu configuración de ArcGIS:

```env
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.arcgis.com
NEXT_PUBLIC_ARCGIS_CLIENT_ID=your-client-id
NEXT_PUBLIC_ARCGIS_API_KEY=your-api-key
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

## 📚 Documentación

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitectura detallada del proyecto
- **[SETUP.md](./docs/SETUP.md)** - Guía completa de configuración y despliegue
- **[DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)** - Guía para desarrolladores
- **[QUICK_START.md](./docs/QUICK_START.md)** - Guía de inicio rápido
- **[PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md)** - Resumen del proyecto
- **[IMPLEMENTATION_CHECKLIST.md](./docs/IMPLEMENTATION_CHECKLIST.md)** - Lista de verificación de implementación
- **[src/components/README.md](./src/components/README.md)** - Documentación de componentes
- **[src/features/README.md](./src/features/README.md)** - Documentación de features
- **[src/lib/README.md](./src/lib/README.md)** - Documentación de librerías
- **[src/data/README.md](./src/data/README.md)** - Formato de datos

## 🏗️ Estructura del Proyecto

```
net-frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes base (shadcn/ui)
│   │   ├── map/         # Componentes de mapa
│   │   ├── graph/       # Componentes de grafos
│   │   ├── layout/      # Componentes de layout
│   │   └── shared/      # Componentes compartidos
│   ├── features/        # Módulos de features
│   │   ├── auth/        # Autenticación
│   │   ├── map/         # Funcionalidad de mapas
│   │   ├── graph/       # Visualización de grafos
│   │   └── social-media/# Datos de redes sociales
│   ├── lib/             # Librerías core
│   │   ├── arcgis/      # Integración ArcGIS
│   │   ├── d3/          # Utilidades D3.js
│   │   ├── api/         # Cliente API
│   │   └── utils/       # Utilidades generales
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Stores Zustand
│   ├── types/           # Tipos TypeScript
│   ├── config/          # Configuración
│   ├── data/            # Datos estáticos
│   └── styles/          # Estilos globales
├── public/              # Assets estáticos
└── docs/                # Documentación adicional
```

## 🛠️ Stack Tecnológico

### Core

- **Next.js 15.5.4** - Framework React con SSG
- **React 19.1.0** - Librería UI
- **TypeScript 5** - Lenguaje tipado

### Mapas y Visualización

- **ArcGIS Maps SDK for JavaScript** - Plataforma de mapas
- **D3.js 7** - Visualización de datos

### Estado y Datos

- **Zustand** - Estado global ligero
- **TanStack Query** - Gestión de estado del servidor

### UI/UX

- **Tailwind CSS v4** - Framework CSS utility-first
- **shadcn/ui** - Componentes accesibles
- **Lucide React** - Sistema de iconos

### Calidad de Código

- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **TypeScript strict mode** - Type safety máximo

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con Turbopack
npm run type-check       # Verificación de tipos TypeScript

# Calidad de Código
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de ESLint
npm run format           # Formatear código con Prettier
npm run format:check     # Verificar formato

# Producción
npm run build            # Build para producción (exportación estática)
npm run start            # Servidor de producción (no aplicable para static export)
```

## 🚢 Despliegue

### Build para IIS

```bash
# Generar exportación estática
npm run build

# Los archivos estarán en el directorio 'out/'
# Copiar contenido de 'out/' a tu directorio IIS
```

### Configuración de Entornos

```bash
# Test
NEXT_PUBLIC_BASE_PATH=/net-frontend-test npm run build

# Producción
NEXT_PUBLIC_BASE_PATH=/net-frontend npm run build
```

Ver [SETUP.md](./docs/SETUP.md) para instrucciones detalladas de despliegue en IIS.

## 🏛️ Arquitectura

La aplicación sigue principios de **Clean Architecture** y **Domain-Driven Design**:

- **Separación de Responsabilidades**: Capas bien definidas
- **Feature-Based**: Módulos autocontenidos por funcionalidad
- **Type-Safe**: TypeScript en toda la aplicación
- **Escalable**: Preparado para crecimiento futuro
- **Mantenible**: Código limpio y documentado

Ver [ARCHITECTURE.md](./docs/ARCHITECTURE.md) para detalles completos.

## 🤝 Contribución

### Workflow de Desarrollo

1. Crear rama de feature: `git checkout -b feature/nombre-feature`
2. Hacer cambios y commits siguiendo [convenciones](#convenciones-de-commits)
3. Ejecutar verificaciones: `npm run type-check && npm run lint`
4. Push y crear Pull Request

### Convenciones de Commits

Seguimos el formato de commits de Angular:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos**:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplo**:

```
feat(map): add layer visibility controls

Implement toggle controls for map layers with persistence
in local storage.

Closes #123
```

## 📋 Roadmap

### Fase 1 - PoC (Actual)

- ✅ Arquitectura base
- ✅ Configuración del proyecto
- ⏳ Integración ArcGIS básica
- ⏳ Visualización de grafos D3.js
- ⏳ Carga de datos estáticos
- ⏳ Autenticación con Portal

### Fase 2 - Mejoras

- ⏳ Interacción mapa-grafo
- ⏳ Filtros avanzados
- ⏳ Exportación de datos
- ⏳ Analytics dashboard

### Fase 3 - Producción

- ⏳ API backend
- ⏳ Datos en tiempo real
- ⏳ Gestión de usuarios
- ⏳ Tests completos

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- **Arquitectura**: Equipo de Desarrollo
- **Desarrollo**: [Tu Organización]

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [D3.js Documentation](https://d3js.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Versión**: 0.1.0  
**Última Actualización**: 2025-10-03  
**Node Version**: v20.x o superior
