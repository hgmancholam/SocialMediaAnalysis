/**
 * Network Data Hook
 *
 * React hook for loading and transforming dataset into network format
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDataset } from './useDataset';
import {
  buildNetworkFromDataset,
  filterNetwork,
  getNetworkStats,
  detectCommunities,
} from './network-builder';
import type { Node, Edge } from '@/features/graph/store/network-store';

interface NetworkFilters {
  minDegree?: number;
  maxDegree?: number;
  sentiments?: string[];
  hasGeo?: boolean;
  minFollowers?: number;
  searchTerm?: string;
}

interface UseNetworkDataResult {
  nodes: Node[];
  edges: Edge[];
  filteredNodes: Node[];
  filteredEdges: Edge[];
  stats: ReturnType<typeof getNetworkStats> | null;
  isLoading: boolean;
  error: Error | null;
  applyFilters: (filters: NetworkFilters) => void;
  resetFilters: () => void;
}

/**
 * Hook to load network data from the dataset
 */
export function useNetworkData(): UseNetworkDataResult {
  const { dataset, isLoading: datasetLoading, error: datasetError } = useDataset();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [filters, setFilters] = useState<NetworkFilters>({});

  // Build network when dataset loads
  useEffect(() => {
    if (!dataset) return;

    try {
      const networkData = buildNetworkFromDataset(dataset);

      // Detect communities
      const nodesWithCommunities = detectCommunities(networkData.nodes, networkData.edges);

      setNodes(nodesWithCommunities);
      setEdges(networkData.edges);
    } catch (error) {
      console.error('Error building network:', error);
    }
  }, [dataset]);

  // Apply filters
  const { nodes: filteredNodes, edges: filteredEdges } = useMemo(() => {
    if (nodes.length === 0) {
      return { nodes: [], edges: [] };
    }

    return filterNetwork(nodes, edges, filters);
  }, [nodes, edges, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!filteredNodes || filteredNodes.length === 0) return null;
    return getNetworkStats(filteredNodes, filteredEdges);
  }, [filteredNodes, filteredEdges]);

  const applyFilters = (newFilters: NetworkFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    nodes,
    edges,
    filteredNodes,
    filteredEdges,
    stats,
    isLoading: datasetLoading,
    error: datasetError,
    applyFilters,
    resetFilters,
  };
}
