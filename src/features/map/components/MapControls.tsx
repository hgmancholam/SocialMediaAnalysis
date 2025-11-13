/**
 * MapControls Component
 *
 * Floating map control buttons
 * Features:
 * - Zoom in/out controls
 * - Reset view button
 * - Drag mode toggle
 * - Fullscreen toggle
 * - Tooltips with Radix UI
 * - Hover animations
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Home,
  Move,
  Maximize,
  Minimize,
  Layers,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';

export interface MapLayer {
  id: string;
  title: string;
  visible: boolean;
  isBaseLayer: boolean;
}

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleDragMode?: () => void;
  onToggleFullscreen?: () => void;
  isDragMode?: boolean;
  isFullscreen?: boolean;
  className?: string;
  // Layers control props
  layers?: MapLayer[];
  onToggleLayerVisibility?: (layerId: string) => void;
  onDeleteLayer?: (layerId: string) => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleDragMode,
  onToggleFullscreen,
  isDragMode = false,
  isFullscreen = false,
  className,
  layers = [],
  onToggleLayerVisibility,
  onDeleteLayer,
}: MapControlsProps) {
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const visibleLayersCount = layers.filter((layer) => layer.visible).length;

  // Separate base layers from search layers
  const baseLayers = layers.filter((layer) => layer.isBaseLayer);
  const searchLayers = layers.filter((layer) => !layer.isBaseLayer);

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`
        flex flex-col gap-1
        bg-[#1E2533]/95 backdrop-blur-sm
        border border-white/10 rounded-lg
        p-2
        shadow-xl
        ${className}
      `}
    >
      {/* Layers Control */}
      {onToggleLayerVisibility && onDeleteLayer && (
        <>
          <motion.div variants={itemVariants}>
            <DropdownMenu open={layersMenuOpen} onOpenChange={setLayersMenuOpen}>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <Tooltip content="Capas del mapa">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <Layers className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                  {visibleLayersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#3B82F6] text-white text-[10px] font-semibold flex items-center justify-center">
                      {visibleLayersCount}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-80 bg-[#1E2533] border-white/10 text-white"
              >
                <DropdownMenuLabel className="flex items-center gap-2 text-gray-300">
                  <Layers className="h-4 w-4" />
                  Capas del Mapa
                  <span className="ml-auto text-xs text-gray-500">
                    {visibleLayersCount} de {layers.length}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                {layers.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    No hay capas disponibles
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
                    {/* Base Layers */}
                    {baseLayers.map((layer) => (
                      <DropdownMenuItem
                        key={layer.id}
                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-white/5 focus:bg-white/5"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <button
                          onClick={() => onToggleLayerVisibility(layer.id)}
                          className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                          title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                        >
                          {layer.visible ? (
                            <Eye className="h-4 w-4 text-[#3B82F6] flex-shrink-0" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span
                            className={cn(
                              'text-sm truncate',
                              layer.visible ? 'text-white font-medium' : 'text-gray-500'
                            )}
                            title={layer.title}
                          >
                            {layer.title}
                          </span>
                          <span className="ml-1 text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-1.5 py-0.5 rounded flex-shrink-0">
                            Base
                          </span>
                        </button>
                      </DropdownMenuItem>
                    ))}

                    {/* Separator between base and search layers */}
                    {baseLayers.length > 0 && searchLayers.length > 0 && (
                      <DropdownMenuSeparator className="bg-white/10 my-1" />
                    )}

                    {/* Search Layers */}
                    {searchLayers.map((layer) => (
                      <DropdownMenuItem
                        key={layer.id}
                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-white/5 focus:bg-white/5"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <button
                          onClick={() => onToggleLayerVisibility(layer.id)}
                          className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                          title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                        >
                          {layer.visible ? (
                            <Eye className="h-4 w-4 text-[#3B82F6] flex-shrink-0" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span
                            className={cn(
                              'text-sm truncate',
                              layer.visible ? 'text-white font-medium' : 'text-gray-500'
                            )}
                            title={layer.title}
                          >
                            {layer.title}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la capa "${layer.title}"?`)) {
                              onDeleteLayer(layer.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0"
                          title="Eliminar capa"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
          <Separator className="bg-white/10" />
        </>
      )}

      {/* Zoom In */}
      <motion.div variants={itemVariants}>
        <Tooltip content="Acercar (Zoom In)">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        </Tooltip>
      </motion.div>

      {/* Zoom Out */}
      <motion.div variants={itemVariants}>
        <Tooltip content="Alejar (Zoom Out)">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
        </Tooltip>
      </motion.div>

      <Separator className="bg-white/10" />

      {/* Reset View */}
      <motion.div variants={itemVariants}>
        <Tooltip content="Vista inicial">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Home className="h-5 w-5" />
          </Button>
        </Tooltip>
      </motion.div>

      {/* Drag Mode Toggle */}
      {onToggleDragMode && (
        <>
          <Separator className="bg-white/10" />
          <motion.div variants={itemVariants}>
            <Tooltip content={isDragMode ? 'Deshabilitar arrastre' : 'Habilitar arrastre'}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDragMode}
                className={`
                  h-10 w-10 p-0
                  ${
                    isDragMode
                      ? 'text-[#3B82F6] bg-[#3B82F6]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Move className="h-5 w-5" />
              </Button>
            </Tooltip>
          </motion.div>
        </>
      )}

      {/* Fullscreen Toggle */}
      {onToggleFullscreen && (
        <>
          <Separator className="bg-white/10" />
          <motion.div variants={itemVariants}>
            <Tooltip content={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/5"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </Tooltip>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
