'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatasetTest } from '@/components/shared/DatasetTest';
import { NetworkStatsCard } from '@/components/shared/NetworkStatsCard';
import { DatasetInsights } from '@/components/shared/DatasetInsights';
import { toast } from 'sonner';
import { BarChart3, Map as MapIcon, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const handleTestToast = () => {
    toast.success('¡Bienvenido a Net DNI!', {
      description: 'Sistema de visualización de datos de redes sociales',
    });
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visualización de datos de redes sociales</p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <MapIcon className="h-8 w-8 text-[#3B82F6] mb-2" />
              <CardTitle className="text-white">Mapa Interactivo</CardTitle>
              <CardDescription className="text-gray-400">
                Visualización geográfica de datos con ArcGIS Maps SDK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/mapa">
                <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">Ir al Mapa</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <Share2 className="h-8 w-8 text-[#10B981] mb-2" />
              <CardTitle className="text-white">Gráfico de Red</CardTitle>
              <CardDescription className="text-gray-400">
                Análisis de relaciones con visualización force-directed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/visualizaciones">
                <Button className="w-full bg-[#10B981] hover:bg-[#059669]">
                  Ver Visualizaciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-[#8B5CF6] mb-2" />
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Gráficos estadísticos y métricas en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleTestToast} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]">
                Probar Notificaciones
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dataset Test */}
        <div className="mb-8">
          <DatasetTest />
        </div>

        {/* Network Stats */}
        <div className="mb-8">
          <NetworkStatsCard />
        </div>

        {/* Dataset Insights - Visualizaciones principales */}
        <div className="mb-8">
          <DatasetInsights />
        </div>
      </div>
    </MainLayout>
  );
}
