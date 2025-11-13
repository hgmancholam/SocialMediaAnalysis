'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MapLayerControlsProps {
  onClearTweets?: () => void;
  showTweetLayer?: boolean;
  className?: string;
}

export function MapLayerControls({
  onClearTweets,
  showTweetLayer = false,
  className,
}: MapLayerControlsProps) {
  if (!showTweetLayer) return null;

  const handleClear = () => {
    if (onClearTweets) {
      onClearTweets();
    }
  };

  return (
    <div
      className={cn(
        'absolute top-4 right-4 z-10 flex flex-col gap-2',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      <Button
        onClick={handleClear}
        variant="destructive"
        size="sm"
        className="shadow-lg hover:shadow-xl transition-all group"
      >
        <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
        Limpiar resultados del mapa
      </Button>
    </div>
  );
}
