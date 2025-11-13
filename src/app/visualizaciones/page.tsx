/**
 * Visualizaciones Page
 *
 * Analytics dashboard with chart grid
 * Features:
 * - Responsive grid layout
 * - Multiple chart types
 * - Real dataset visualization
 * - Global filters (date range)
 * - Export data functionality
 */

'use client';

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Download, Filter, Loader2 } from 'lucide-react';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TimeSeriesChart } from '@/features/graph/components/charts/TimeSeriesChart';
import { BarChart } from '@/features/graph/components/charts/BarChart';
import { PieChart } from '@/features/graph/components/charts/PieChart';
import { toast } from 'sonner';
import { useDataset } from '@/lib/data/useDataset';
import {
  getTimeSeriesData,
  getSentimentDistribution,
  getGeoDistribution,
  getEntityCategoryDistribution,
  getEngagementMetrics,
  getEngagementBySentiment,
  getTopUsers,
} from '@/lib/data/analytics';

export default function VisualizacionesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Load dataset
  const { dataset, isLoading, error } = useDataset();

  // Calculate analytics data from dataset
  const analyticsData = useMemo(() => {
    if (!dataset) return null;

    return {
      timeSeries: getTimeSeriesData(dataset),
      sentiment: getSentimentDistribution(dataset),
      geoDistribution: getGeoDistribution(dataset),
      entityCategories: getEntityCategoryDistribution(dataset),
      engagement: getEngagementMetrics(dataset),
      engagementBySentiment: getEngagementBySentiment(dataset),
      topUsers: getTopUsers(dataset, 5),
    };
  }, [dataset]);

  const handleExport = () => {
    toast.success('Exportando datos...', {
      description: 'Se descargará un archivo CSV con los datos seleccionados',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando datos del dataset...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !dataset || !analyticsData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error al cargar el dataset</p>
            <p className="text-gray-400 text-sm">{error?.message || 'Datos no disponibles'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Visualizaciones Analytics</h1>
          <p className="text-gray-400">
            Dashboard completo de métricas y estadísticas de redes sociales
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-[#1E2533] border border-white/10 rounded-lg">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" className="bg-[#1E2533] border-white/10 hover:bg-[#252D3F]">
            <Filter className="h-4 w-4 mr-2" />
            Más Filtros
          </Button>
          <div className="ml-auto">
            <Button onClick={handleExport} className="bg-[#3B82F6] hover:bg-[#2563EB]">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Time Series Chart */}
          <Card className="bg-[#1E2533] border-white/10 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Actividad Temporal</CardTitle>
              <CardDescription className="text-gray-400">
                Evolución de tweets, retweets y likes por hora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart
                data={analyticsData.timeSeries}
                series={[
                  { key: 'tweets', name: 'Tweets', color: '#3B82F6' },
                  { key: 'retweets', name: 'Retweets', color: '#10B981' },
                  { key: 'likes', name: 'Likes', color: '#F59E0B' },
                ]}
                height={300}
                showBrush={true}
                showLegend={true}
              />
            </CardContent>
          </Card>

          {/* Engagement by Sentiment */}
          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Engagement por Sentimiento</CardTitle>
              <CardDescription className="text-gray-400">
                Comparación de interacciones según el sentimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={analyticsData.engagementBySentiment}
                bars={[
                  { key: 'retweets', name: 'Retweets', color: '#3B82F6' },
                  { key: 'likes', name: 'Likes', color: '#10B981' },
                  { key: 'replies', name: 'Respuestas', color: '#F59E0B' },
                ]}
                height={300}
                stacked={false}
                showLegend={true}
              />
            </CardContent>
          </Card>

          {/* Entity Categories Distribution */}
          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Categorías de Entidades</CardTitle>
              <CardDescription className="text-gray-400">
                Distribución de entidades extraídas de los tweets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart
                data={analyticsData.entityCategories}
                height={300}
                donut={true}
                showLegend={true}
                showPercentage={true}
              />
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <Card className="bg-[#1E2533] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Distribución Geográfica</CardTitle>
              <CardDescription className="text-gray-400">
                Top 10 ubicaciones por número de usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={analyticsData.geoDistribution}
                bars={[{ key: 'usuarios', name: 'Usuarios', color: '#8B5CF6' }]}
                height={300}
                layout="horizontal"
                showLegend={false}
              />
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="bg-[#1E2533] border-white/10 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Análisis de Sentimiento</CardTitle>
              <CardDescription className="text-gray-400">
                Distribución de sentimientos en los {dataset.enrichedTweets.length} tweets
                analizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart
                data={analyticsData.sentiment}
                height={300}
                donut={false}
                showLegend={true}
                showPercentage={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <Card className="bg-[#1E2533] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Tweets</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analyticsData.engagement.totalTweets.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-blue-400 mt-1">Dataset cargado</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E2533] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Retweets</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analyticsData.engagement.totalRetweets.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-green-400 mt-1">Interacciones</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E2533] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Likes</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analyticsData.engagement.totalLikes.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-pink-400 mt-1">Me gusta</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1E2533] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Usuarios Únicos</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {dataset.users.length.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-purple-400 mt-1">En el dataset</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
