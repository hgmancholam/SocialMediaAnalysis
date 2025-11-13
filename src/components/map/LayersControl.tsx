/**
 * LayersControl Component
 *
 * Control for managing map layers with visibility toggle and deletion
 */

'use client';

import { FC, useState } from 'react';
import { Eye, EyeOff, Trash2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface LayersControlProps {
  layers: MapLayer[];
  onToggleVisibility: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  className?: string;
}

export const LayersControl: FC<LayersControlProps> = ({
  layers,
  onToggleVisibility,
  onDeleteLayer,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const visibleLayersCount = layers.filter((layer) => layer.visible).length;

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
            title="Capas del mapa"
          >
            <Layers className="h-5 w-5" />
            {layers.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                {visibleLayersCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 bg-white">
          <DropdownMenuLabel className="flex items-center gap-2 px-3">
            <Layers className="h-4 w-4" />
            Capas del Mapa
            <span className="ml-auto text-xs text-gray-500">
              {visibleLayersCount} de {layers.length}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {layers.length === 0 ? (
            <div id="div-lista-capas" className="px-3 py-6 text-center text-sm text-gray-500">
              No hay capas disponibles
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto !overflow-x-hidden">
              {layers.map((layer) => (
                <DropdownMenuItem
                  key={layer.id}
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                  onSelect={(e) => e.preventDefault()} // Prevent menu from closing
                >
                  <button
                    onClick={() => onToggleVisibility(layer.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                    title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        'text-sm truncate',
                        layer.visible ? 'text-gray-900 font-medium' : 'text-gray-500'
                      )}
                      title={layer.title}
                    >
                      {layer.title}
                    </span>
                    {layer.isBaseLayer && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        Base
                      </span>
                    )}
                  </button>

                  {!layer.isBaseLayer && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la capa "${layer.title}"?`)) {
                          onDeleteLayer(layer.id);
                        }
                      }}
                      className="p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                      title="Eliminar capa"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
