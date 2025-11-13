/**
 * AnalyticsSidePanel Component
 *
 * Resizable side panel with tabs for analytics
 * Features:
 * - react-resizable-panels (320-600px width)
 * - Radix Tabs (Resumen/Detalles/Relaciones)
 * - Framer Motion transitions
 * - Skeleton loading states
 * - Scroll virtualization support
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Info, Network, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { usePanelStore } from '@/store/panel-store';
import { TimeSeriesChart } from '@/features/graph/components/charts/TimeSeriesChart';
import { RadarChart } from '@/features/graph/components/charts/RadarChart';
import { WordCloud } from '@/features/graph/components/charts/WordCloud';
import { useDataset } from '@/lib/data/useDataset';
import { getTimeSeriesData, getEngagementMetrics, getGeoDistribution } from '@/lib/data/analytics';

interface AnalyticsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  onSearchTerm?: (term: string) => void;
}

export function AnalyticsSidePanel({
  isOpen,
  onClose,
  isLoading = false,
  children,
  onSearchTerm,
}: AnalyticsSidePanelProps) {
  const { analyticsPanelWidth, activeTab, setActiveTab } = usePanelStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{
              width: `${analyticsPanelWidth}px`,
              minWidth: '320px',
              maxWidth: '600px',
            }}
            className="fixed right-0 top-0 bottom-0 z-50 bg-[#1A1F2E] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#3B82F6]" />
                Analytics Panel
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'resumen' | 'detalles' | 'relaciones')
              }
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0">
                <TabsTrigger
                  value="resumen"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] data-[state=active]:bg-transparent"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger
                  value="detalles"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] data-[state=active]:bg-transparent"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Detalles
                </TabsTrigger>
                <TabsTrigger
                  value="relaciones"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] data-[state=active]:bg-transparent"
                >
                  <Network className="h-4 w-4 mr-2" />
                  Relaciones
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <TabsContent value="resumen" className="m-0 p-4">
                      <ResumenTab onSearchTerm={onSearchTerm} onClose={onClose}>
                        {children}
                      </ResumenTab>
                    </TabsContent>
                    <TabsContent value="detalles" className="m-0 p-4">
                      <DetallesTab>{children}</DetallesTab>
                    </TabsContent>
                    <TabsContent value="relaciones" className="m-0 p-4">
                      <RelacionesTab>{children}</RelacionesTab>
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3 bg-white/10" />
        <Skeleton className="h-20 w-full bg-white/10" />
      </div>
      <Separator className="bg-white/10" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4 bg-white/10" />
        <Skeleton className="h-32 w-full bg-white/10" />
      </div>
      <Separator className="bg-white/10" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3 bg-white/10" />
        <Skeleton className="h-24 w-full bg-white/10" />
      </div>
    </div>
  );
}

// Resumen Tab
function ResumenTab({
  children,
  onSearchTerm,
  onClose,
}: {
  children?: React.ReactNode;
  onSearchTerm?: (term: string) => void;
  onClose?: () => void;
}) {
  const { dataset, isLoading } = useDataset();

  if (children) {
    return <>{children}</>;
  }

  if (isLoading || !dataset) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-white/10" />
        <Skeleton className="h-48 w-full bg-white/10" />
      </div>
    );
  }

  // Calculate real statistics from dataset
  const usersWithGeo = dataset.users.filter((u) => u.geo).length;

  // Calculate sentiment distribution
  const sentiments = dataset.enrichedTweets.reduce(
    (acc, tweet) => {
      acc[tweet.sentiment] = (acc[tweet.sentiment] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 } as Record<string, number>
  );

  // Calculate engagement metrics
  const engagementMetrics = getEngagementMetrics(dataset);

  // Get real time series data
  const timeSeriesData = getTimeSeriesData(dataset);

  // Extract entities for word cloud
  const entityCounts = new Map<string, { count: number; category: string }>();
  dataset.enrichedTweets.forEach((tweet) => {
    tweet.entities.forEach((entity) => {
      const existing = entityCounts.get(entity.text);
      if (existing) {
        existing.count++;
      } else {
        entityCounts.set(entity.text, {
          count: 1,
          category: entity.category,
        });
      }
    });
  });

  // Color mapping for entity categories
  const categoryColors: Record<string, string> = {
    Person: '#3B82F6', // blue
    Location: '#10B981', // green
    Organization: '#F59E0B', // orange
    Event: '#8B5CF6', // purple
    PersonType: '#EC4899', // pink
    DateTime: '#6366F1', // indigo
    URL: '#14B8A6', // teal
    Quantity: '#F97316', // orange
  };

  const wordCloudData = Array.from(entityCounts.entries())
    .map(([text, data]) => ({
      text,
      value: data.count,
      category: data.category,
      color: categoryColors[data.category] || '#6B7280',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 40); // Top 40 entities

  // Calculate sentiment totals (still needed for the sentiment distribution section)
  const totalSentiments = sentiments.positive + sentiments.neutral + sentiments.negative;

  // Get geographic distribution for radar chart
  const geoDistribution = getGeoDistribution(dataset);
  const totalUsers = geoDistribution.reduce((sum, loc) => sum + loc.usuarios, 0);

  // Take top 5 locations for radar chart with logarithmic scaling
  const topLocations = geoDistribution.slice(0, 5);

  // Apply logarithmic transformation to make small values visible
  const logValues = topLocations.map((loc) => Math.log10(loc.usuarios + 1));
  const maxLog = Math.max(...logValues);
  const minLog = Math.min(...logValues);
  const logRange = maxLog - minLog || 1;

  const geoRadarData = topLocations.map((location, index) => {
    const logValue = logValues[index];
    // Normalize to 20-100 range so all values are visible
    const normalizedValue = 20 + ((logValue - minLog) / logRange) * 80;
    const actualPercentage = (location.usuarios / totalUsers) * 100;

    return {
      subject: location.name.length > 15 ? location.name.substring(0, 15) + '...' : location.name,
      usuarios: location.usuarios,
      valor: normalizedValue, // Logarithmic normalized value for visualization
      porcentaje: actualPercentage, // Actual percentage for tooltip
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Estadísticas Generales</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col p-3 bg-[#0F1419] rounded-lg">
            <span className="text-xs text-gray-400">Usuarios totales</span>
            <span className="text-2xl font-semibold text-white mt-1">{dataset.users.length}</span>
            <span className="text-xs text-green-400 mt-1">
              Con geo: {usersWithGeo} ({((usersWithGeo / dataset.users.length) * 100).toFixed(1)}
              %)
            </span>
          </div>
          <div className="flex flex-col p-3 bg-[#0F1419] rounded-lg">
            <span className="text-xs text-gray-400">Tweets totales</span>
            <span className="text-2xl font-semibold text-white mt-1">{dataset.tweets.length}</span>
            <span className="text-xs text-blue-400 mt-1">
              Analizados: {dataset.enrichedTweets.length}
            </span>
          </div>
          <div className="flex flex-col p-3 bg-[#0F1419] rounded-lg col-span-2">
            <span className="text-xs text-gray-400">Total Retweets</span>
            <span className="text-2xl font-semibold text-white mt-1">
              {engagementMetrics.totalRetweets.toLocaleString('es-CO')}
            </span>
            <span className="text-xs text-purple-400 mt-1">
              Likes: {engagementMetrics.totalLikes.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Actividad Temporal</h3>
        <div className="bg-[#0F1419] rounded-lg p-3">
          <TimeSeriesChart
            data={timeSeriesData}
            series={[
              { key: 'tweets', name: 'Tweets', color: '#3B82F6' },
              { key: 'retweets', name: 'Retweets', color: '#10B981' },
              { key: 'likes', name: 'Likes', color: '#F59E0B' },
            ]}
            height={200}
            showLegend={true}
          />
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Entidades Principales</h3>
        <div className="bg-[#0F1419] rounded-lg p-3">
          <WordCloud
            data={wordCloudData}
            height={220}
            maxWords={35}
            minSize={11}
            maxSize={24}
            onWordClick={(word) => {
              if (onSearchTerm) {
                onSearchTerm(word.text);
              }
              if (onClose) {
                onClose();
              }
            }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
            <span className="text-gray-400">Personas</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-gray-400">Lugares</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            <span className="text-gray-400">Organizaciones</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            <span className="text-gray-400">Eventos</span>
          </span>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Distribución Geográfica</h3>
        <div className="bg-[#0F1419] rounded-lg p-3">
          <RadarChart
            data={geoRadarData}
            dataKeys={[{ key: 'valor', name: 'Usuarios', color: '#3B82F6' }]}
            height={250}
            showLegend={false}
            domain={[0, 100]}
            showActualValues={true}
          />
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          Top 5 ubicaciones (escala logarítmica normalizada)
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Distribución de Sentimientos</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-[#0F1419] rounded">
            <span className="text-xs text-gray-400">Positivo</span>
            <span className="text-sm text-green-400 font-semibold">
              {sentiments.positive} ({((sentiments.positive / totalSentiments) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-[#0F1419] rounded">
            <span className="text-xs text-gray-400">Neutral</span>
            <span className="text-sm text-blue-400 font-semibold">
              {sentiments.neutral} ({((sentiments.neutral / totalSentiments) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-[#0F1419] rounded">
            <span className="text-xs text-gray-400">Negativo</span>
            <span className="text-sm text-red-400 font-semibold">
              {sentiments.negative} ({((sentiments.negative / totalSentiments) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Detalles Tab
function DetallesTab({ children }: { children?: React.ReactNode }) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Información Detallada</h3>
        <p className="text-sm text-gray-400">
          Selecciona un elemento en el mapa para ver sus detalles.
        </p>
      </div>
    </div>
  );
}

// Relaciones Tab
function RelacionesTab({ children }: { children?: React.ReactNode }) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Red de Relaciones</h3>
        <p className="text-sm text-gray-400">
          La visualización de relaciones se mostrará aquí una vez que se carguen los datos.
        </p>
      </div>
    </div>
  );
}
