# Quick Start Guide

Get up and running with Net Frontend in 5 minutes.

## Prerequisites

- Node.js v20.x or higher
- npm v10.x or higher
- ArcGIS Portal credentials (for authentication)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local with your ArcGIS credentials
# (Use your preferred editor)
```

## Configuration

Edit `.env.local`:

```env
# Required: ArcGIS Portal URL
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.arcgis.com

# Required: ArcGIS Client ID (from OAuth app)
NEXT_PUBLIC_ARCGIS_CLIENT_ID=your-client-id

# Optional: ArcGIS API Key
NEXT_PUBLIC_ARCGIS_API_KEY=your-api-key

# Optional: Base path (leave empty for development)
NEXT_PUBLIC_BASE_PATH=
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Overview

```
src/
├── app/           # Next.js pages and routes
├── components/    # React components
├── features/      # Feature modules (auth, map, graph)
├── lib/           # Core libraries (ArcGIS, D3, utils)
├── hooks/         # Custom React hooks
├── store/         # State management (Zustand)
├── types/         # TypeScript types
├── config/        # Configuration files
└── data/          # Static data (JSON)
```

## Next Steps

### 1. Review Documentation

- **[README.md](../README.md)** - Project overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development patterns

### 2. Set Up ArcGIS OAuth

1. Log in to your Portal for ArcGIS
2. Go to **Organization** → **Settings** → **OAuth 2.0**
3. Create new application:
   - Name: Net Frontend
   - Redirect URI: `http://localhost:3000/auth/callback`
4. Copy Client ID to `.env.local`

### 3. Verify Your Data

The main dataset is located at:

```
public/data/dataset.json
```

This file contains real Twitter/X data including tweets, users, and sentiment analysis.
See `src/data/README.md` for data structure details.

### 4. Install UI Components

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### 5. Start Developing

Follow the patterns in `DEVELOPMENT_GUIDE.md`:

```typescript
// Example: Create a new feature
src/features/my-feature/
├── components/
├── hooks/
├── services/
├── store/
├── types.ts
└── index.ts
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Check TypeScript

# Code Quality
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run format:check     # Check formatting

# Production
npm run build            # Build for production
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Check for errors
npm run type-check

# Restart TypeScript server in your editor
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ArcGIS SDK Issues

Make sure your `.env.local` has correct Portal URL and credentials.

## Getting Help

1. Check documentation in project root
2. Review README files in each directory
3. Check Next.js and ArcGIS documentation
4. Review example code in `src/data/` directory

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# ... edit files ...

# 3. Check quality
npm run type-check
npm run lint

# 4. Commit (git hooks will run automatically)
git add .
git commit -m "feat(scope): description"

# 5. Push
git push origin feature/my-feature
```

## Build for Production

```bash
# Build static export
npm run build

# Output will be in 'out/' directory
# Copy to your IIS server
```

## Key Files to Know

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Environment variables (gitignored)
- `.env.example` - Environment template
- `src/config/` - Application configuration
- `src/lib/arcgis/config.ts` - ArcGIS configuration

## Architecture Highlights

- **Feature-based**: Code organized by feature, not by type
- **Type-safe**: Full TypeScript coverage
- **State management**: Zustand for UI, TanStack Query for server state
- **Static export**: Optimized for IIS deployment
- **Clean architecture**: Clear separation of concerns

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ArcGIS SDK Documentation](https://developers.arcgis.com/javascript/latest/)
- [D3.js Documentation](https://d3js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Ready to start?** Run `npm run dev` and open http://localhost:3000

For detailed information, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).
