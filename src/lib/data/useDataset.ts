/**
 * Dataset Hook
 *
 * React hook for loading and accessing the dataset
 */

'use client';

import { useEffect, useState } from 'react';
import type { ProcessedDataset, DatasetStats } from '@/types/dataset';
import {
  loadAndProcessDataset,
  calculateDatasetStats,
} from './loader';

interface UseDatasetResult {
  dataset: ProcessedDataset | null;
  stats: DatasetStats | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * Hook to load and access the dataset
 */
export function useDataset(): UseDatasetResult {
  const [dataset, setDataset] = useState<ProcessedDataset | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loadAndProcessDataset();
      setDataset(data);

      const dataStats = calculateDatasetStats(data);
      setStats(dataStats);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load dataset');
      setError(error);
      console.error('Error loading dataset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    dataset,
    stats,
    isLoading,
    error,
    reload: loadData,
  };
}
