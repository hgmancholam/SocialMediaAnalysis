/**
 * MapSearchBar Component
 *
 * Floating search bar with autocomplete for geocoding
 * Features:
 * - cmdk integration for search
 * - Dataset search (users and tweets with location)
 * - ArcGIS Locator geocoding
 * - Recent searches (localStorage)
 * - Keyboard shortcuts (Ctrl+K)
 * - Fuzzy search
 * - Toast notifications
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, MapPin, Clock, Loader2, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { geocodingService } from '@/features/map/services/geocoding-service';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDataset } from '@/lib/data/useDataset';
import { searchLocations, type MapSearchResult } from '@/lib/data/loader';

interface MapSearchBarProps {
  onLocationSelect: (location: { x: number; y: number }, address: string) => void;
  onShowAllTweets?: () => void;
  onClearTweets?: () => void;
  className?: string;
}

const MAX_RECENT_SEARCHES = 5;

export function MapSearchBar({
  onLocationSelect,
  onShowAllTweets,
  onClearTweets,
  className,
}: MapSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [geocodingSuggestions, setGeocodingSuggestions] = useState<string[]>([]);
  const [datasetResults, setDatasetResults] = useState<MapSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('map-recent-searches', []);

  const { dataset, isLoading: datasetLoading } = useDataset();
  const debouncedSearch = useDebounce(searchValue, 300);

  // Log dataset status
  useEffect(() => {
    if (dataset) {
      console.log('✅ Dataset cargado:', {
        users: dataset.users.length,
        usersWithGeo: dataset.users.filter((u) => u.geo).length,
        tweets: dataset.tweets.length,
        enrichedTweets: dataset.enrichedTweets.length,
        enrichedTweetsWithGeo: dataset.enrichedTweets.filter((t) => t.geo).length,
      });
    } else if (!datasetLoading) {
      console.log('⚠️ Dataset no disponible');
    }
  }, [dataset, datasetLoading]);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch suggestions when search value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.trim().length < 2) {
        setGeocodingSuggestions([]);
        setDatasetResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Search in dataset
        if (dataset) {
          const dataResults = searchLocations(dataset, debouncedSearch, 5);
          setDatasetResults(dataResults);
        } else {
          console.log('⚠️ Dataset no disponible aún');
        }

        // Search with ArcGIS geocoding
        const geoResults = await geocodingService.suggest(debouncedSearch, 5);
        setGeocodingSuggestions(geoResults);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast.error('Error al buscar sugerencias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, dataset]);

  const handleSelectDatasetResult = useCallback(
    (result: MapSearchResult) => {
      // Add to recent searches
      const searchLabel = result.label;
      const updatedRecent = [searchLabel, ...recentSearches.filter((s) => s !== searchLabel)].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      setRecentSearches(updatedRecent);

      // Notify parent component
      onLocationSelect(result.location, result.label);

      // Close dialog
      setOpen(false);
      setSearchValue('');

      toast.success('Ubicación encontrada', {
        description: result.description || result.label,
      });
    },
    [onLocationSelect, recentSearches, setRecentSearches]
  );

  const handleSelectGeocodingResult = useCallback(
    async (address: string) => {
      setIsLoading(true);
      try {
        // Geocode the selected address
        const results = await geocodingService.geocode(address, 1);

        if (results.length === 0) {
          toast.error('No se encontró la ubicación');
          return;
        }

        const result = results[0];

        // Add to recent searches
        const updatedRecent = [address, ...recentSearches.filter((s) => s !== address)].slice(
          0,
          MAX_RECENT_SEARCHES
        );
        setRecentSearches(updatedRecent);

        // Notify parent component
        onLocationSelect(result.location, result.address);

        // Close dialog
        setOpen(false);
        setSearchValue('');

        toast.success('Ubicación encontrada', {
          description: result.address,
        });
      } catch (error) {
        console.error('Geocoding error:', error);
        toast.error('Error al buscar la ubicación');
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect, recentSearches, setRecentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    toast.success('Búsquedas recientes eliminadas');
  }, [setRecentSearches]);

  return (
    <>
      {/* Floating Search Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setOpen(true)}
        className={`
          group flex items-center gap-2 px-4 py-2.5 
          bg-[#1E2533]/95 backdrop-blur-sm
          border border-white/10 rounded-lg
          text-gray-400 hover:text-white
          hover:border-[#3B82F6]/50
          transition-all duration-200
          shadow-lg hover:shadow-xl
          ${className}
        `}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Buscar ubicación...</span>
        <kbd className="ml-4 px-2 py-0.5 text-xs font-semibold text-gray-400 bg-[#0F1419] border border-white/10 rounded">
          Ctrl+K
        </kbd>
      </motion.button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar dirección o lugar..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-6 text-gray-400"
              >
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Buscando...</span>
              </motion.div>
            ) : (
              <>
                {datasetResults.length === 0 &&
                  geocodingSuggestions.length === 0 &&
                  searchValue.length >= 2 && (
                    <CommandEmpty>No se encontraron resultados</CommandEmpty>
                  )}

                {/* Dataset Results (Users and Tweets) */}
                {datasetResults.length > 0 && (
                  <CommandGroup
                    heading={
                      <div className="flex items-center justify-between w-full pr-2 gap-2">
                        <span>En el Dataset</span>
                        <div className="flex gap-1">
                          {onShowAllTweets && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowAllTweets();
                                setOpen(false);
                              }}
                              className="text-xs px-2 py-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded transition-colors"
                              title="Mostrar todos los tweets en el mapa"
                            >
                              Ver en el mapa
                            </button>
                          )}
                          {onClearTweets && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClearTweets();
                                setOpen(false);
                              }}
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                              title="Limpiar tweets del mapa"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                      </div>
                    }
                  >
                    {datasetResults.map((result) => (
                      <CommandItem
                        key={`dataset-${result.type}-${result.id}`}
                        value={`dataset-${result.type}-${result.id}`}
                        keywords={[result.label, result.description || '', searchValue]}
                        onSelect={() => handleSelectDatasetResult(result)}
                        className="gap-2"
                      >
                        {result.type === 'user' ? (
                          <User className="h-4 w-4 text-[#10B981] flex-shrink-0" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-[#F59E0B] flex-shrink-0" />
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm truncate">{result.label}</span>
                          {result.description && (
                            <span className="text-xs text-gray-400 truncate">
                              {result.description}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Geocoding Results */}
                {geocodingSuggestions.length > 0 && (
                  <CommandGroup heading="Lugares">
                    {geocodingSuggestions.map((suggestion, index) => (
                      <CommandItem
                        key={`geo-${suggestion}-${index}`}
                        value={suggestion}
                        onSelect={() => handleSelectGeocodingResult(suggestion)}
                      >
                        <MapPin className="mr-2 h-4 w-4 text-[#3B82F6]" />
                        <span>{suggestion}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && searchValue.length === 0 && (
                  <CommandGroup heading="Búsquedas recientes">
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={`recent-${search}-${index}`}
                        value={search}
                        onSelect={() => {
                          setSearchValue(search);
                        }}
                      >
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{search}</span>
                      </CommandItem>
                    ))}
                    <CommandItem
                      onSelect={clearRecentSearches}
                      className="text-red-400 justify-center"
                    >
                      Limpiar búsquedas recientes
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </AnimatePresence>
        </CommandList>
      </CommandDialog>
    </>
  );
}
