'use client';

import { useState, useCallback, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NetworkGraph } from '@/features/graph/components/NetworkGraph';
import { NetworkControls } from '@/features/graph/components/NetworkControls';
import { NetworkFilters } from '@/features/graph/components/NetworkFilters';
import { NodeDetailsPanel } from '@/features/graph/components/NodeDetailsPanel';
import { useNetworkStore } from '@/features/graph/store/network-store';
import { useNetworkData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PanelLeftClose, PanelLeftOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedPage() {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(true);
  const { setNodes, setEdges } = useNetworkStore();

  // Load real network data from dataset
  const { filteredNodes, filteredEdges, stats, isLoading, error } = useNetworkData();

  // Update store when network data changes
  useEffect(() => {
    if (filteredNodes && filteredNodes.length > 0) {
      setNodes(filteredNodes);
      setEdges(filteredEdges);
    }
  }, [filteredNodes, filteredEdges, setNodes, setEdges]);

  // Zoom handlers - these would be implemented by NetworkGraph
  const handleZoomIn = useCallback(() => {
    // This will be handled by the NetworkGraph component internally
    console.log('Zoom in');
  }, []);

  const handleZoomOut = useCallback(() => {
    console.log('Zoom out');
  }, []);

  const handleResetView = useCallback(() => {
    console.log('Reset view');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full bg-[#0F1419]">
          <Card className="bg-[#1E2533] border-white/10 w-96">
            <CardHeader>
              <CardTitle className="text-white">Cargando Red...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full bg-[#0F1419]">
          <Card className="bg-[#1E2533] border-red-500/50 w-96">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error al cargar la red
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Get unique node types and communities for filters
  const availableTypes = Array.from(new Set(filteredNodes?.map((n) => n.type)));
  const availableCommunities = Array.from(
    new Set(filteredNodes?.map((n) => n.community).filter((c) => c !== undefined))
  ) as number[];

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-hidden bg-[#0F1419]">
        {/* Network Graph - Full Screen */}
        <NetworkGraph
          width={typeof window !== 'undefined' ? window.innerWidth : 1920}
          height={typeof window !== 'undefined' ? window.innerHeight : 1080}
        />

        {/* Top Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {/* Toggle Filters Panel Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
            className="bg-[#1E2533] hover:bg-[#2A3441] border-white/10"
          >
            {isFiltersPanelOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </Button>

          {/* Network Controls */}
          <NetworkControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
          />
        </div>

        {/* Left Filters Panel */}
        <AnimatePresence mode="wait">
          {isFiltersPanelOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-20 left-4 z-10"
            >
              <NetworkFilters
                availableTypes={availableTypes}
                availableCommunities={availableCommunities}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Details Panel - Shows when node is selected */}
        <NodeDetailsPanel nodes={filteredNodes} edges={filteredEdges} />

        {/* Info Badge */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-[#1E2533] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-400 space-y-1">
            <div>
              <span className="font-medium text-white">{filteredNodes?.length ?? 0}</span> nodos •{' '}
              <span className="font-medium text-white">{filteredEdges?.length ?? 0}</span>{' '}
              conexiones
            </div>
            {stats && (
              <div className="text-xs">
                Densidad: {(stats.density * 100).toFixed(2)}% • Grado promedio:{' '}
                {stats.avgDegree.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
