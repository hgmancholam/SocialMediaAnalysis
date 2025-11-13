/**
 * Network Stats Card Component
 *
 * Displays network graph statistics from the dataset
 */

'use client';

import { useNetworkData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2, Users, Link as LinkIcon, TrendingUp } from 'lucide-react';

export function NetworkStatsCard() {
  const { stats, isLoading, error } = useNetworkData();

  if (isLoading) {
    return (
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Cargando Red Social...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-3/4 bg-white/10" />
          <Skeleton className="h-4 w-1/2 bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1E2533] border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Error al cargar Red
          </CardTitle>
          <CardDescription className="text-red-300">{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return <>Comportamiento no esperado</>;
  }

  return (
    <Card className="bg-[#1E2533] border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Share2 className="h-5 w-5 text-[#10B981]" />
          Red Social de Interacciones
        </CardTitle>
        <CardDescription className="text-gray-400">
          Análisis de la red de usuarios y sus interacciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="h-4 w-4" />
              <span>Nodos</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalNodes.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <LinkIcon className="h-4 w-4" />
              <span>Conexiones</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalEdges.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Grado Prom.</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.avgDegree.toFixed(1)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Share2 className="h-4 w-4" />
              <span>Densidad</span>
            </div>
            <p className="text-2xl font-bold text-white">{(stats.density * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Distribución de Sentimiento en la Red
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {stats.sentimentCounts.positive}
              </div>
              <div className="text-xs text-gray-400">Positivo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{stats.sentimentCounts.neutral}</div>
              <div className="text-xs text-gray-400">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{stats.sentimentCounts.negative}</div>
              <div className="text-xs text-gray-400">Negativo</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Usuarios Más Conectados</h4>
          <div className="space-y-2">
            {stats.topNodes.slice(0, 5).map((node, index) => (
              <div key={node.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-mono w-4">{index + 1}.</span>
                  <span className="text-gray-300">{node.label}</span>
                </div>
                <span className="text-white font-medium">{node.degree} tweets</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
