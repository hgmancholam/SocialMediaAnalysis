'use client';

import { X, Users, TrendingUp, Share2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStore, type Node, type Edge } from '../store/network-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn';

interface NodeDetailsPanelProps {
  edges: Edge[];
  nodes: Node[];
  className?: string;
}

export function NodeDetailsPanel({ edges, nodes, className }: NodeDetailsPanelProps) {
  const { selectedNode, setSelectedNode } = useNetworkStore();

  if (!selectedNode) return null;

  // Calculate connections
  const connections = edges.filter(
    (edge) => edge.source === selectedNode.id || edge.target === selectedNode.id
  );

  const connectedNodeIds = connections.map((edge) =>
    edge.source === selectedNode.id ? edge.target : edge.source
  );

  const connectedNodes = nodes.filter((node) => connectedNodeIds.includes(node.id));

  // Calculate metrics
  const incomingEdges = edges.filter((edge) => edge.target === selectedNode.id);
  const outgoingEdges = edges.filter((edge) => edge.source === selectedNode.id);
  const totalWeight = connections.reduce((sum, edge) => sum + (edge.weight || 1), 0);
  const avgWeight = connections.length > 0 ? totalWeight / connections.length : 0;

  // Get node type color
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      usuario: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      hashtag: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      mencion: 'bg-green-500/20 text-green-400 border-green-500/30',
      url: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[type.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed top-0 right-0 h-full w-[400px] bg-[#1E2533] border-l border-white/10',
          'shadow-2xl z-50 flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn('font-medium', getTypeColor(selectedNode.type))}>
                {selectedNode.type}
              </Badge>
              {selectedNode.community && (
                <Badge variant="outline" className="text-xs">
                  Comunidad {selectedNode.community}
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-semibold text-white truncate">{selectedNode.label}</h2>
            <p className="text-sm text-gray-400 mt-1">ID: {selectedNode.id}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedNode(null)}
            className="shrink-0 hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metrics */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Métricas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Grado"
                value={selectedNode.degree}
                icon={<Share2 className="w-4 h-4" />}
              />
              <MetricCard
                label="Conexiones"
                value={connections.length}
                icon={<Users className="w-4 h-4" />}
              />
              <MetricCard
                label="Entrantes"
                value={incomingEdges.length}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricCard
                label="Salientes"
                value={outgoingEdges.length}
                icon={<TrendingUp className="w-4 h-4 rotate-180" />}
              />
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Peso promedio</span>
                <span className="text-white font-medium">{avgWeight.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Connections List */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Conexiones ({connectedNodes.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {connectedNodes.length > 0 ? (
                connectedNodes.map((node) => {
                  const edge = connections.find(
                    (e) =>
                      (e.source === selectedNode.id && e.target === node.id) ||
                      (e.target === selectedNode.id && e.source === node.id)
                  );
                  const isIncoming = edge && edge.target === selectedNode.id;

                  return (
                    <div
                      key={node.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white truncate">
                              {node.label}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', getTypeColor(node.type))}
                            >
                              {node.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Grado: {node.degree}</span>
                            {edge && (
                              <>
                                <span>•</span>
                                <span>Peso: {edge.weight}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isIncoming ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-blue-400 rotate-180" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No hay conexiones disponibles
                </div>
              )}
            </div>
          </div>

          {/* Top Connections */}
          {connectedNodes.length > 0 && (
            <>
              <Separator className="bg-white/10" />
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Top 3 Conexiones Más Fuertes
                </h3>
                <div className="space-y-2">
                  {connectedNodes
                    .map((node) => {
                      const edge = connections.find(
                        (e) =>
                          (e.source === selectedNode.id && e.target === node.id) ||
                          (e.target === selectedNode.id && e.source === node.id)
                      );
                      return { node, weight: edge?.weight ?? 0 };
                    })
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 3)
                    .map(({ node, weight }, index) => (
                      <div
                        key={node.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {node.label}
                            </div>
                            <div className="text-xs text-gray-400">
                              Peso: {weight} • Grado: {node.degree}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-1 text-gray-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-white">{value.toLocaleString('es-CO')}</div>
    </div>
  );
}
