/**
 * Dataset Test Component
 *
 * Simple component to test dataset loading functionality
 */

'use client';

import { useDataset } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Users, MessageSquare, TrendingUp } from 'lucide-react';

export function DatasetTest() {
  const { dataset, stats, isLoading, error } = useDataset();

  if (isLoading) {
    return (
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cargando Dataset...
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
            <Database className="h-5 w-5" />
            Error al cargar Dataset
          </CardTitle>
          <CardDescription className="text-red-300">
            {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dataset || !stats) {
    return null;
  }

  return (
    <Card className="bg-[#1E2533] border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-[#3B82F6]" />
          Dataset Cargado Exitosamente
        </CardTitle>
        <CardDescription className="text-gray-400">
          Estadísticas del dataset de Twitter/X
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Tweets</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalTweets.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Enriquecidos</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalEnrichedTweets.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Database className="h-4 w-4" />
              <span>Con Geo</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.usersWithGeo.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Distribución de Sentimiento
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {stats.sentimentDistribution.positive}
              </div>
              <div className="text-xs text-gray-400">Positivo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">
                {stats.sentimentDistribution.neutral}
              </div>
              <div className="text-xs text-gray-400">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                {stats.sentimentDistribution.negative}
              </div>
              <div className="text-xs text-gray-400">Negativo</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Rango de Fechas
          </h4>
          <p className="text-sm text-gray-300">
            {stats.dateRange.start.toLocaleDateString('es-ES')} -{' '}
            {stats.dateRange.end.toLocaleDateString('es-ES')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
