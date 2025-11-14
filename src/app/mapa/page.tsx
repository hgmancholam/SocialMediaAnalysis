/**
 * Map Page
 *
 * Main map view page integrating:
 * - MapContainer (ArcGIS)
 * - MapSearchBar
 * - DatasetInfoCard
 * - MapControls
 * - AnalyticsSidePanel
 */

'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

import { MainLayout } from '@/components/layout/MainLayout';
import { MapContainer } from '@/components/map/MapContainer';
import { MapSearchBar } from '@/features/map/components/MapSearchBar';
import { DatasetInfoCard } from '@/features/map/components/DatasetInfoCard';
import { MapControls } from '@/features/map/components/MapControls';
import { AnalyticsSidePanel } from '@/features/map/components/AnalyticsSidePanel';
import { MapLayerControls } from '@/features/map/components/MapLayerControls';
import { Button } from '@/components/ui/button';
import { usePanelStore } from '@/store/panel-store';
import { toast } from 'sonner';
import { useDataset } from '@/lib/data/useDataset';
import { tweetVisualizationService } from '@/features/map/services/tweet-visualization-service';
import { useMapLayers } from '@/features/map/hooks/useMapLayers';
import { mapService } from '@/features/map/services/map-service';
import { useEffect } from 'react';

export default function MapPage() {
  const [isDragMode, setIsDragMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTweetLayer, setShowTweetLayer] = useState(false);
  const [mapView, setMapView] = useState<__esri.MapView | null>(null);
  const [mapControls, setMapControls] = useState<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    navigateToLocation: (
      longitude: number,
      latitude: number,
      zoomLevel?: number,
      addMarker?: boolean
    ) => Promise<void>;
  } | null>(null);

  const { isAnalyticsPanelOpen, setAnalyticsPanelOpen } = usePanelStore();
  const { dataset } = useDataset();
  const { layers, toggleLayerVisibility, deleteLayer } = useMapLayers();

  const handleMapReady = useCallback(
    (
      view: __esri.MapView,
      controls: {
        zoomIn: () => void;
        zoomOut: () => void;
        resetView: () => void;
        navigateToLocation: (
          longitude: number,
          latitude: number,
          zoomLevel?: number,
          addMarker?: boolean
        ) => Promise<void>;
      }
    ) => {
      setMapView(view);
      setMapControls(controls);
    },
    []
  );

  // Load influence layer when map and dataset are ready
  useEffect(() => {
    const loadInfluenceLayer = async () => {
      if (!mapView || !dataset) return;

      try {
        toast.loading('Cargando capa de usuarios influyentes...', {
          id: 'loading-influence',
        });

        await mapService.createInfluenceLayer(dataset.users);

        const influenceData = mapService.getInfluenceData();
        toast.success('Capa de usuarios cargada', {
          id: 'loading-influence',
          description: `${influenceData.length} usuarios georeferenciados visualizados`,
        });
      } catch (error) {
        console.error('Error loading influence layer:', error);
        toast.error('Error al cargar usuarios', {
          id: 'loading-influence',
          description: 'No se pudo cargar la capa de usuarios influyentes',
        });
      }
    };

    loadInfluenceLayer();
  }, [mapView, dataset]);

  const handleLocationSelect = useCallback(
    (location: { x: number; y: number }, address: string) => {
      if (!mapControls) {
        toast.error('El mapa aún no está listo');
        return;
      }

      // Navigate to the selected location with appropriate zoom level
      mapControls.navigateToLocation(location.x, location.y, 16);

      toast.success('Navegando a ubicación', {
        description: address,
        duration: 3000,
      });
    },
    [mapControls]
  );

  const handleShowAllTweets = useCallback(async () => {
    if (!mapView) {
      toast.error('El mapa aún no está listo');
      return;
    }

    if (!dataset) {
      toast.error('El dataset aún no está cargado');
      return;
    }

    toast.loading('Cargando tweets en el mapa...', {
      description: 'Procesando tweets georeferenciados',
      id: 'loading-tweets',
    });

    try {
      await tweetVisualizationService.visualizeTweets(mapView, dataset);
      setShowTweetLayer(true);

      toast.success('Tweets cargados', {
        id: 'loading-tweets',
        description: 'Los tweets se han agregado al mapa exitosamente',
      });
    } catch (error) {
      console.error('Error showing tweets:', error);
      toast.error('Error al cargar tweets', {
        id: 'loading-tweets',
        description: 'No se pudieron visualizar los tweets en el mapa',
      });
    }
  }, [mapView, dataset]);

  const handleClearTweets = useCallback(async () => {
    if (!mapView) {
      toast.error('El mapa aún no está listo');
      return;
    }

    try {
      await tweetVisualizationService.removeTweets(mapView);
      setShowTweetLayer(false);

      toast.success('Tweets eliminados', {
        description: 'La capa de tweets ha sido removida del mapa',
      });
    } catch (error) {
      console.error('Error removing tweets:', error);
      toast.error('Error al limpiar tweets', {
        description: 'No se pudieron eliminar los tweets del mapa',
      });
    }
  }, [mapView]);

  const handleSearchTermFromWordCloud = useCallback(
    async (term: string) => {
      if (!mapView) {
        toast.error('El mapa aún no está listo');
        return;
      }

      if (!dataset) {
        toast.error('El dataset aún no está cargado');
        return;
      }

      toast.loading(`Buscando "${term}"...`, {
        description: 'Filtrando tweets en el mapa',
        id: 'search-term',
      });

      try {
        // Filter tweets and enriched tweets that contain the search term
        const filteredEnrichedTweets = dataset.enrichedTweets.filter((enrichedTweet) => {
          const matchesText = enrichedTweet.text.toLowerCase().includes(term.toLowerCase());
          const matchesEntity = enrichedTweet.entities.some(
            (entity) => entity.text.toLowerCase() === term.toLowerCase()
          );
          return matchesText || matchesEntity;
        });

        const filteredTweetIds = new Set(filteredEnrichedTweets.map((t) => t.id));
        const filteredTweets = dataset.tweets.filter((tweet) => filteredTweetIds.has(tweet.id));

        if (filteredTweets.length === 0) {
          toast.error('No se encontraron resultados', {
            id: 'search-term',
            description: `No hay tweets que contengan "${term}"`,
          });
          return;
        }

        // Create a filtered dataset
        const filteredDataset = {
          ...dataset,
          tweets: filteredTweets,
          enrichedTweets: filteredEnrichedTweets,
        };

        // Visualize the filtered tweets
        await tweetVisualizationService.visualizeTweets(mapView, filteredDataset, term);
        setShowTweetLayer(true);

        // Calculate center from filtered tweets with geo
        const tweetsWithGeo = filteredEnrichedTweets.filter((t) => t.geo);
        if (tweetsWithGeo.length > 0) {
          const avgX =
            tweetsWithGeo.reduce((sum, t) => sum + (t.geo?.x || 0), 0) / tweetsWithGeo.length;
          const avgY =
            tweetsWithGeo.reduce((sum, t) => sum + (t.geo?.y || 0), 0) / tweetsWithGeo.length;

          // Navigate to center of results
          if (mapControls) {
            await mapControls.navigateToLocation(avgX, avgY, 8);
          }
        }

        toast.success(`${filteredTweets.length} tweets encontrados`, {
          id: 'search-term',
          description: `Mostrando resultados para "${term}"`,
        });
      } catch (error) {
        console.error('Error searching term:', error);
        toast.error('Error al buscar', {
          id: 'search-term',
          description: 'No se pudo completar la búsqueda',
        });
      }
    },
    [mapView, dataset, mapControls]
  );
  const handleZoomIn = useCallback(() => {
    if (mapControls) {
      mapControls.zoomIn();
      toast.success('Zoom In');
    } else {
      toast.error('Mapa no inicializado');
    }
  }, [mapControls]);

  const handleZoomOut = useCallback(() => {
    if (mapControls) {
      mapControls.zoomOut();
      toast.success('Zoom Out');
    } else {
      toast.error('Mapa no inicializado');
    }
  }, [mapControls]);

  const handleResetView = useCallback(() => {
    if (mapControls) {
      mapControls.resetView();
      toast.success('Vista restablecida');
    } else {
      toast.error('Mapa no inicializado');
    }
  }, [mapControls]);

  const handleToggleDragMode = useCallback(() => {
    setIsDragMode((prev) => !prev);
    toast.info(isDragMode ? 'Arrastre deshabilitado' : 'Arrastre habilitado');
  }, [isDragMode]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <MainLayout>
      <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0">
          <MapContainer useWebMap={true} onMapReady={handleMapReady} />
        </div>
        {/* Map Search Bar - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <MapSearchBar
            onLocationSelect={handleLocationSelect}
            onShowAllTweets={handleShowAllTweets}
            onClearTweets={handleClearTweets}
          />
        </div>

        {/* Map Layer Controls - Top Right (below analytics button) */}
        <MapLayerControls
          onClearTweets={handleClearTweets}
          showTweetLayer={showTweetLayer}
          className="top-20"
        />

        {/* Dataset Info Card - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-10">
          <DatasetInfoCard />
        </div>
        {/* Map Controls - Right Side */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            onToggleDragMode={handleToggleDragMode}
            onToggleFullscreen={handleToggleFullscreen}
            isDragMode={isDragMode}
            isFullscreen={isFullscreen}
            layers={layers}
            onToggleLayerVisibility={toggleLayerVisibility}
            onDeleteLayer={deleteLayer}
          />
        </div>
        {/* Analytics Panel Toggle Button - Top Right */}
        {!isAnalyticsPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 z-10"
          >
            <Button
              onClick={() => setAnalyticsPanelOpen(true)}
              className="bg-[#1E2533]/95 backdrop-blur-sm border border-white/10 hover:bg-[#3B82F6] hover:border-[#3B82F6] text-gray-300 hover:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Abrir Analytics
            </Button>
          </motion.div>
        )}
        {/* Analytics Side Panel */}
        <AnalyticsSidePanel
          isOpen={isAnalyticsPanelOpen}
          onClose={() => setAnalyticsPanelOpen(false)}
          isLoading={false}
          onSearchTerm={handleSearchTermFromWordCloud}
        />
      </div>
    </MainLayout>
  );
}
