import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config/site';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { SessionProvider } from './auth/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  keywords: [...siteConfig.metadata.keywords],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* ArcGIS Maps SDK CSS */}
        <link
          rel="stylesheet"
          href="https://js.arcgis.com/4.33/@arcgis/core/assets/esri/themes/dark/main.css"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#0F1419] text-white`}>
        <SessionProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
