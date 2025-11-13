/**
 * Loading States Components
 *
 * Reusable loading states, skeletons, and suspense fallbacks
 */

'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

/**
 * Full page loading spinner
 */
export function PageLoader({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1419]">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}

/**
 * Section loading spinner
 */
export function SectionLoader({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex min-h-[200px] items-center justify-center', className)}>
      <div className="text-center">
        <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-500" />
        {message && <p className="text-sm text-gray-400">{message}</p>}
      </div>
    </div>
  );
}

/**
 * Inline loading spinner
 */
export function InlineLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size])} />;
}

/**
 * Skeleton loader for text
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-white/10"
          style={{
            width: i === lines - 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-white/10 bg-[#1E2533] p-4', className)}>
      <div className="mb-3 h-6 w-1/2 animate-pulse rounded bg-white/10" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for table rows
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-12 w-12 animate-pulse rounded bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for charts
 */
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-white/10 bg-[#1E2533] p-4', className)}>
      <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-white/10" />
      <div className="relative h-64 overflow-hidden rounded">
        <div className="absolute bottom-0 flex h-full w-full items-end justify-around gap-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full animate-pulse rounded-t bg-white/10"
              style={{
                height: `${Math.random() * 60 + 40}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for network graph
 */
export function SkeletonNetworkGraph({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-[#0F1419]', className)}>
      {/* Animated dots representing nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-64 w-64">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 12;
            const x = Math.cos(angle) * 100;
            const y = Math.sin(angle) * 100;

            return (
              <motion.div
                key={i}
                className="absolute h-3 w-3 rounded-full bg-blue-500/30"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Center loader */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for map
 */
export function SkeletonMap({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-[#1A2332]', className)}>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Pulsing overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for sidebar menu
 */
export function SkeletonSidebar() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded bg-white/10" />
          <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

/**
 * Dots loader animation
 */
export function DotsLoader() {
  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-500"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Progress bar loader
 */
export function ProgressLoader({ progress, label }: { progress: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <p className="mb-2 text-sm text-gray-400">{label}</p>}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-gray-500">{progress}%</p>
    </div>
  );
}
