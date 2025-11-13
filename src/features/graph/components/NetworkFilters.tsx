'use client';

import { Filter, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNetworkStore } from '../store/network-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NetworkFiltersProps {
  className?: string;
  availableTypes?: string[];
  availableCommunities?: number[];
}

export function NetworkFilters({
  className,
  availableTypes = ['usuario', 'hashtag', 'mencion', 'url'],
  availableCommunities = [1, 2, 3, 4, 5],
}: NetworkFiltersProps) {
  const { filters, updateFilters, resetFilters } = useNetworkStore();

  const handleToggleType = (type: string) => {
    const newTypes = filters.nodeTypes.includes(type)
      ? filters.nodeTypes.filter((t) => t !== type)
      : [...filters.nodeTypes, type];
    updateFilters({ nodeTypes: newTypes });
  };

  const handleToggleCommunity = (community: number) => {
    const newCommunities = filters.communities.includes(community)
      ? filters.communities.filter((c) => c !== community)
      : [...filters.communities, community];
    updateFilters({ communities: newCommunities });
  };

  const handleDegreeRangeChange = (value: number, type: 'min' | 'max') => {
    const currentMin = filters.degreeRange?.[0] ?? 0;
    const currentMax = filters.degreeRange?.[1] ?? 100;
    const newRange: [number, number] =
      type === 'min' ? [value, currentMax] : [currentMin, value];
    updateFilters({ degreeRange: newRange });
  };

  const hasActiveFilters =
    filters.nodeTypes.length < availableTypes.length ||
    filters.communities.length < availableCommunities.length ||
    (filters.degreeRange?.[0] ?? 0) > 0 ||
    (filters.degreeRange?.[1] ?? 100) < 100;

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
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'w-[280px] bg-[#1E2533] border border-white/10 rounded-lg shadow-lg',
        'p-4 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-white">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 px-2 text-xs hover:bg-white/5"
          >
            <X className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Node Types Filter */}
      <div>
        <label className="text-xs font-medium text-gray-400 mb-2 block">
          Tipo de Nodo ({filters.nodeTypes.length}/{availableTypes.length})
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((type) => {
            const isSelected = filters.nodeTypes.includes(type);
            return (
              <Badge
                key={type}
                className={cn(
                  'cursor-pointer transition-all',
                  isSelected
                    ? getTypeColor(type)
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                )}
                onClick={() => handleToggleType(type)}
              >
                {type}
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Degree Range Filter */}
      <div>
        <label className="text-xs font-medium text-gray-400 mb-2 block">
          Rango de Grado ({filters.degreeRange?.[0] ?? 0} - {filters.degreeRange?.[1] ?? 100})
        </label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mínimo</label>
            <input
              type="range"
              min={0}
              max={100}
              value={filters.degreeRange?.[0] ?? 0}
              onChange={(e) => handleDegreeRangeChange(Number(e.target.value), 'min')}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Máximo</label>
            <input
              type="range"
              min={0}
              max={100}
              value={filters.degreeRange?.[1] ?? 100}
              onChange={(e) => handleDegreeRangeChange(Number(e.target.value), 'max')}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Communities Filter */}
      <div>
        <label className="text-xs font-medium text-gray-400 mb-2 block">
          Comunidades ({filters.communities.length}/{availableCommunities.length})
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-white/5 hover:bg-white/10 border-white/10"
            >
              <span className="text-sm">
                {filters.communities.length === 0
                  ? 'Todas las comunidades'
                  : `${filters.communities.length} seleccionadas`}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] bg-[#1E2533] border-white/10">
            <DropdownMenuLabel>Seleccionar comunidades</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {availableCommunities.map((community) => (
              <DropdownMenuCheckboxItem
                key={community}
                checked={filters.communities.includes(community)}
                onCheckedChange={() => handleToggleCommunity(community)}
                className="text-white hover:bg-white/5"
              >
                Comunidad {community}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <>
          <Separator className="bg-white/10" />
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Filtros activos:</span>
              <span className="text-white font-medium">
                {
                  [
                    filters.nodeTypes.length < availableTypes.length,
                    filters.communities.length < availableCommunities.length,
                    filters.degreeRange[0] > 0 || filters.degreeRange[1] < 100,
                  ].filter(Boolean).length
                }
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
