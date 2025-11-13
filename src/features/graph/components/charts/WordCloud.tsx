/**
 * WordCloud Component
 *
 * Word cloud visualization for text data
 * Features:
 * - Interactive hover effects
 * - Size based on frequency
 * - Color coding by category
 * - Spiral placement algorithm for compact layout
 * - Random rotations for better space usage
 * - Click to filter/select
 */

'use client';

import { useMemo, useRef, useEffect, useState } from 'react';

interface WordCloudItem {
  text: string;
  value: number;
  category?: string;
  color?: string;
}

interface WordCloudProps {
  data: WordCloudItem[];
  height?: number;
  maxWords?: number;
  minSize?: number;
  maxSize?: number;
  onWordClick?: (word: WordCloudItem) => void;
}

interface PositionedWord extends WordCloudItem {
  fontSize: number;
  rotation: number;
  x: number;
  y: number;
}

export function WordCloud({
  data,
  height = 300,
  maxWords = 30,
  minSize = 12,
  maxSize = 32,
  onWordClick,
}: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update width on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Sort by value and limit
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value).slice(0, maxWords);
  }, [data, maxWords]);

  // Calculate font sizes and rotations
  const wordsWithLayout = useMemo(() => {
    if (sortedData.length === 0 || containerWidth === 0) return [];

    const maxValue = Math.max(...sortedData.map((d) => d.value));
    const minValue = Math.min(...sortedData.map((d) => d.value));
    const range = maxValue - minValue || 1;

    // Possible rotation angles (mostly horizontal, some vertical)
    const rotations = [0, 0, 0, 0, 90, -90]; // 66% horizontal, 33% vertical

    const wordsWithSize = sortedData.map((word, index) => {
      const normalizedValue = (word.value - minValue) / range;
      const fontSize = minSize + normalizedValue * (maxSize - minSize);

      // Select rotation based on index (deterministic but varied)
      const rotation = rotations[index % rotations.length];

      return {
        ...word,
        fontSize: Math.round(fontSize),
        rotation,
        x: 0,
        y: 0,
      };
    });

    // Spiral placement algorithm
    const centerX = containerWidth / 2;
    const centerY = height / 2;
    const placedWords: PositionedWord[] = [];
    const occupiedRects: Array<{ x: number; y: number; width: number; height: number }> = [];

    for (const word of wordsWithSize) {
      let placed = false;
      let angle = 0;
      let radius = 0;
      const angleStep = 0.5; // Smaller step for denser packing
      const radiusStep = 5;
      const maxAttempts = 500;
      let attempts = 0;

      while (!placed && attempts < maxAttempts) {
        // Calculate position on spiral
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Estimate word dimensions (rough approximation)
        const isVertical = word.rotation === 90 || word.rotation === -90;
        const charWidth = word.fontSize * 0.6; // Approximate character width
        const wordWidth = isVertical ? word.fontSize : word.text.length * charWidth;
        const wordHeight = isVertical ? word.text.length * charWidth : word.fontSize;

        // Check collision with already placed words
        const rect = {
          x: x - wordWidth / 2,
          y: y - wordHeight / 2,
          width: wordWidth,
          height: wordHeight,
        };

        const hasCollision = occupiedRects.some((occupied) => {
          return !(
            rect.x + rect.width < occupied.x ||
            rect.x > occupied.x + occupied.width ||
            rect.y + rect.height < occupied.y ||
            rect.y > occupied.y + occupied.height
          );
        });

        if (!hasCollision) {
          placedWords.push({ ...word, x, y });
          occupiedRects.push(rect);
          placed = true;
        }

        // Move along spiral
        angle += angleStep;
        radius += radiusStep * (angleStep / (2 * Math.PI));
        attempts++;
      }

      // If couldn't place after max attempts, place anyway
      if (!placed) {
        placedWords.push({ ...word, x: centerX, y: centerY });
      }
    }

    return placedWords;
  }, [sortedData, minSize, maxSize, containerWidth, height]);

  // Default colors if not provided
  const getColor = (word: WordCloudItem) => {
    if (word.color) return word.color;

    // Default color palette
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // orange
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#14B8A6', // teal
      '#F97316', // orange
      '#6366F1', // indigo
    ];

    const hash = word.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ height }}>
      {wordsWithLayout.map((word, index) => (
        <button
          key={`${word.text}-${index}`}
          onClick={() => onWordClick?.(word)}
          className="absolute transition-all duration-200 hover:scale-125 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] cursor-pointer whitespace-nowrap active:scale-95"
          style={{
            fontSize: `${word.fontSize}px`,
            color: getColor(word),
            fontWeight: word.fontSize > 20 ? 700 : 600,
            left: `${word.x}px`,
            top: `${word.y}px`,
            transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
            transformOrigin: 'center center',
          }}
          title={`${word.text}: ${word.value} - Click para buscar en el mapa`}
        >
          {word.text}
        </button>
      ))}
    </div>
  );
}
