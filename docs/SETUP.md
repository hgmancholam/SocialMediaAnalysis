# Setup Guide

Complete guide to set up and run the Net Frontend application.

## Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **ArcGIS Portal**: Access to a Portal for ArcGIS instance
- **ArcGIS Client ID**: OAuth application credentials

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd net-frontend

# Install dependencies
npm install

# Initialize Husky for git hooks
npm run prepare
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# ArcGIS Configuration
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.arcgis.com
NEXT_PUBLIC_ARCGIS_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_ARCGIS_API_KEY=your-api-key-here

# Application Configuration
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_APP_NAME=Net Frontend
NEXT_PUBLIC_APP_VERSION=0.1.0

# Map Configuration (Bogotá, Colombia)
NEXT_PUBLIC_MAP_CENTER_LON=-74.0721
NEXT_PUBLIC_MAP_CENTER_LAT=4.7110
NEXT_PUBLIC_MAP_ZOOM=10
NEXT_PUBLIC_MAP_BASEMAP=streets-vector

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 3. ArcGIS Portal Setup

#### Create OAuth Application

1. Log in to your Portal for ArcGIS
2. Navigate to **Organization** → **Settings** → **OAuth 2.0**
3. Click **Add Application**
4. Fill in the details:
   - **Name**: Net Frontend
   - **Redirect URIs**:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.com/net-frontend/auth/callback` (production)
5. Copy the **Client ID** and add it to `.env.local`

## Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Scripts

```bash
# Start development server with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**: Edit files in `src/`

3. **Test locally**: Run `npm run dev` and test in browser

4. **Check code quality**:

   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

5. **Commit changes**: Git hooks will automatically run linting and formatting
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

## Building for Production

### Static Export for IIS

```bash
# Build the application
npm run build

# Output will be in the 'out' directory
```

### Build Configuration

For different environments, create environment-specific files:

#### Development Build

```bash
# Uses .env.local
npm run build
```

#### Production Build (Test Environment)

Create `.env.production.test`:

```env
NEXT_PUBLIC_BASE_PATH=/net-frontend-test
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.arcgis.com
# ... other variables
```

Build:

```bash
NODE_ENV=production npm run build
```

#### Production Build (Production Environment)

Create `.env.production`:

```env
NEXT_PUBLIC_BASE_PATH=/net-frontend
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-portal.arcgis.com
# ... other variables
```

Build:

```bash
NODE_ENV=production npm run build
```

## Deployment to IIS

### Prerequisites

- IIS 10.0 or higher
- URL Rewrite Module installed
- Static file serving enabled

### Deployment Steps

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Copy files to IIS**:
   - Copy the entire `out/` directory to your IIS virtual directory
   - Example: `C:\inetpub\wwwroot\net-frontend\`

3. **Configure IIS**:

   Create a `web.config` file in the deployment directory:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="Static Assets" stopProcessing="true">
             <match url="([\S]+[.](html|htm|svg|js|css|png|gif|jpg|jpeg|ico|json|woff|woff2|ttf|eot))"/>
             <action type="Rewrite" url="/{R:1}"/>
           </rule>
           <rule name="ReactRouter Routes" stopProcessing="true">
             <match url=".*"/>
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true"/>
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true"/>
             </conditions>
             <action type="Rewrite" url="/index.html"/>
           </rule>
         </rules>
       </rewrite>
       <staticContent>
         <mimeMap fileExtension=".json" mimeType="application/json"/>
         <mimeMap fileExtension=".woff" mimeType="application/font-woff"/>
         <mimeMap fileExtension=".woff2" mimeType="application/font-woff2"/>
       </staticContent>
       <httpProtocol>
         <customHeaders>
           <add name="X-Content-Type-Options" value="nosniff"/>
           <add name="X-Frame-Options" value="SAMEORIGIN"/>
           <add name="X-XSS-Protection" value="1; mode=block"/>
         </customHeaders>
       </httpProtocol>
     </system.webServer>
   </configuration>
   ```

4. **Set permissions**:
   - Ensure IIS_IUSRS has read access to the deployment directory

5. **Test the deployment**:
   - Navigate to `http://your-server/net-frontend/`
   - Verify the application loads correctly

### Multiple Environments on Same IIS

```
IIS
├── /net-frontend-test  → Test environment
│   └── (out/ contents with .env.production.test)
└── /net-frontend       → Production environment
    └── (out/ contents with .env.production)
```

## Troubleshooting

### Common Issues

#### 1. ArcGIS SDK Not Loading

**Problem**: Map doesn't load, console shows ArcGIS errors

**Solution**:

- Verify `NEXT_PUBLIC_ARCGIS_API_KEY` is set correctly
- Check network tab for blocked requests
- Ensure CORS is configured on ArcGIS Portal

#### 2. OAuth Redirect Issues

**Problem**: Login redirects to wrong URL

**Solution**:

- Verify redirect URI in Portal matches your configuration
- Check `NEXT_PUBLIC_BASE_PATH` is correct
- Ensure OAuth app includes all redirect URIs

#### 3. Static Export Issues

**Problem**: Build fails or pages don't work

**Solution**:

- Check for dynamic routes (not supported in static export)
- Verify no server-side only features are used
- Review Next.js static export limitations

#### 4. IIS Routing Issues

**Problem**: Direct navigation to routes returns 404

**Solution**:

- Verify `web.config` is in place
- Check URL Rewrite module is installed
- Review IIS error logs

#### 5. Environment Variables Not Working

**Problem**: Config values are undefined

**Solution**:

- Ensure variables start with `NEXT_PUBLIC_`
- Rebuild after changing environment variables
- Check `.env.local` is not gitignored (it should be)

### Debug Mode

Enable debug mode in `.env.local`:

```env
NEXT_PUBLIC_ENABLE_DEBUG=true
```

This will:

- Show additional console logs
- Display error details
- Enable React DevTools integration

## Project Structure

```
net-frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── features/         # Feature modules
│   ├── lib/              # Core libraries
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   ├── config/           # Configuration
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env.example          # Environment template
├── .env.local           # Local environment (gitignored)
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── ARCHITECTURE.md      # Architecture documentation
```

## Next Steps

1. **Review Architecture**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture information
2. **Set up shadcn/ui**: Install UI components as needed
3. **Configure ArcGIS**: Set up your Portal and OAuth application
4. **Add Data**: Place your social media JSON data in `src/data/social-media/`
5. **Start Development**: Begin implementing features following the architecture

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions:

1. Check this setup guide
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Check component README files in each directory
4. Review Next.js and ArcGIS documentation

---

**Last Updated**: 2025-10-03
**Version**: 1.0.0
