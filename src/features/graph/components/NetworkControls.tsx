/**
 * NetworkControls Component
 *
 * Control panel for network graph
 * Features:
 * - Zoom controls
 * - Reset view
 * - Layout toggle
 * - Pause/Resume simulation
 * - Search node
 */

'use client';

import { Search, ZoomIn, ZoomOut, Home, Play, Pause, Grid3x3 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNetworkStore, type LayoutType } from '@/features/graph/store/network-store';

interface NetworkControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  className?: string;
}

export function NetworkControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  className,
}: NetworkControlsProps) {
  const { layoutType, setLayoutType, isPaused, togglePause, filters, updateFilters } =
    useNetworkStore();

  const layoutOptions: { value: LayoutType; label: string }[] = [
    { value: 'force', label: 'Force Directed' },
    { value: 'circular', label: 'Circular' },
    { value: 'hierarchical', label: 'Hierarchical' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar nodo..."
          value={filters.searchTerm || ''}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className="pl-10 bg-[#1E2533] border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-2 p-2 bg-[#1E2533] border border-white/10 rounded-lg">
        {/* Zoom Controls */}
        <div className="flex gap-1">
          <Tooltip content="Acercar">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Alejar">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Vista inicial">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetView}
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Home className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        {/* Pause/Resume */}
        <Tooltip content={isPaused ? 'Reanudar simulación' : 'Pausar simulación'}>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePause}
            className={`h-9 w-9 p-0 ${
              isPaused ? 'text-[#3B82F6]' : 'text-gray-400'
            } hover:text-white hover:bg-white/5`}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        {/* Layout Selector */}
        <DropdownMenu>
          <Tooltip content="Tipo de layout">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                <span className="text-xs">
                  {layoutOptions.find((opt) => opt.value === layoutType)?.label}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent className="bg-[#1E2533] border-white/10">
            {layoutOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setLayoutType(option.value)}
                className={`text-gray-300 hover:text-white hover:bg-white/5 ${
                  layoutType === option.value ? 'bg-white/5 text-white' : ''
                }`}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
