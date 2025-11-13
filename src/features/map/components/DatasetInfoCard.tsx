/**
 * DatasetInfoCard Component
 *
 * Floating card with real dataset information
 * Features:
 * - Live dataset statistics
 * - User and tweet counts
 * - Georeference statistics
 * - Collapsible content
 * - Slide-in animation from bottom
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, MapPin, ChevronUp, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDataset } from '@/lib/data/useDataset';

interface DatasetInfoCardProps {
  className?: string;
}

export function DatasetInfoCard({ className }: DatasetInfoCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { dataset, isLoading } = useDataset();

  // Calculate dataset statistics
  const stats = useMemo(() => {
    if (!dataset) return null;

    const usersWithGeo = dataset.users.filter((u) => u.geo).length;
    const tweetsWithGeo = dataset.enrichedTweets.filter((t) => t.geo).length;

    // Calculate sentiment distribution
    const sentiments = dataset.enrichedTweets.reduce(
      (acc, tweet) => {
        acc[tweet.sentiment] = (acc[tweet.sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate geographic extent from users with geo
    const geoUsers = dataset.users.filter((u) => u.geo);
    let extent = null;
    if (geoUsers.length > 0) {
      const lons = geoUsers.map((u) => u.geo!.x);
      const lats = geoUsers.map((u) => u.geo!.y);
      extent = {
        xmin: Math.min(...lons),
        xmax: Math.max(...lons),
        ymin: Math.min(...lats),
        ymax: Math.max(...lats),
      };
    }

    return {
      totalUsers: dataset.users.length,
      usersWithGeo,
      totalTweets: dataset.tweets.length,
      enrichedTweets: dataset.enrichedTweets.length,
      tweetsWithGeo,
      sentiments,
      extent,
    };
  }, [dataset]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={className}
      >
        <Card className="bg-[#1E2533]/95 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Cargando dataset...</CardTitle>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (!dataset || !stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
      className={`
        ${isCollapsed ? 'w-auto min-w-[320px]' : 'w-full max-w-sm'}
        ${className}
      `}
    >
      <Card
        className={`bg-[#1E2533]/95 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden py-1`}
      >
        <CardHeader className={`pb-0 ${isCollapsed ? 'pt-1' : 'pt-0'}`}>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#3B82F6] flex-shrink-0" />
            <CardTitle className="text-sm text-white font-bold">
              Dataset de Redes Sociales
            </CardTitle>
          </div>
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </CardAction>
        </CardHeader>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-3">
                {/* Users Statistics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">👥 Usuarios totales</span>
                    <Badge
                      variant="default"
                      size="sm"
                      className="bg-blue-600 text-white font-semibold"
                    >
                      {stats.totalUsers.toLocaleString('es-CO')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 ml-6">Con geolocalización</span>
                    <span className="text-xs text-gray-300 font-medium">
                      {stats.usersWithGeo} (
                      {((stats.usersWithGeo / stats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Tweets Statistics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">💬 Tweets totales</span>
                    <Badge
                      variant="default"
                      size="sm"
                      className="bg-purple-600 text-white font-semibold"
                    >
                      {stats.totalTweets.toLocaleString('es-CO')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 ml-6">Analizados</span>
                    <span className="text-xs text-gray-300 font-medium">
                      {stats.enrichedTweets}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 ml-6">Con ubicación</span>
                    <span className="text-xs text-gray-300 font-medium">{stats.tweetsWithGeo}</span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Sentiment Distribution */}
                <div className="space-y-2">
                  <span className="text-sm text-gray-300 font-medium">
                    😊 Análisis de sentimiento
                  </span>
                  <div className="space-y-1">
                    {stats.sentiments.positive > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 ml-6">Positivo</span>
                        <span className="text-xs text-green-400 font-medium">
                          {stats.sentiments.positive} (
                          {((stats.sentiments.positive / stats.enrichedTweets) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                    {stats.sentiments.neutral > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 ml-6">Neutral</span>
                        <span className="text-xs text-blue-400 font-medium">
                          {stats.sentiments.neutral} (
                          {((stats.sentiments.neutral / stats.enrichedTweets) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                    {stats.sentiments.negative > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 ml-6">Negativo</span>
                        <span className="text-xs text-red-400 font-medium">
                          {stats.sentiments.negative} (
                          {((stats.sentiments.negative / stats.enrichedTweets) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extent */}
                {stats.extent && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                        <MapPin className="h-4 w-4" />
                        <span>Extensión geográfica</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>
                          <span className="block">Oeste: {stats.extent.xmin.toFixed(4)}</span>
                          <span className="block">Sur: {stats.extent.ymin.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="block">Este: {stats.extent.xmax.toFixed(4)}</span>
                          <span className="block">Norte: {stats.extent.ymax.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
