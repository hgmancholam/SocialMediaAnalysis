/**
 * Accessibility Utilities and Hooks
 *
 * Utilities for keyboard navigation, focus management, and ARIA attributes
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for keyboard navigation with arrow keys
 * Useful for lists, menus, and grids
 */
export function useArrowNavigation<T extends HTMLElement>({
  enabled = true,
  onEnter,
  onEscape,
}: {
  enabled?: boolean;
  onEnter?: (element: T) => void;
  onEscape?: () => void;
} = {}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!container) return;

      const focusableElements = Array.from(
        container.querySelectorAll<T>(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

      const currentIndex = focusableElements.indexOf(document.activeElement as T);

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1]?.focus();
          } else {
            focusableElements[0]?.focus();
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            focusableElements[currentIndex - 1]?.focus();
          } else {
            focusableElements[focusableElements.length - 1]?.focus();
          }
          break;

        case 'Home':
          e.preventDefault();
          focusableElements[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          focusableElements[focusableElements.length - 1]?.focus();
          break;

        case 'Enter':
          if (onEnter && document.activeElement) {
            e.preventDefault();
            onEnter(document.activeElement as T);
          }
          break;

        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEnter, onEscape]);

  return containerRef;
}

/**
 * Hook to trap focus within a component
 * Useful for modals, dialogs, and dropdowns
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to announce changes to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region for announcements
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, []);

  return announce;
}

/**
 * Hook for managing focus restoration
 * Useful when opening/closing modals or panels
 */
export function useFocusRestore() {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion.current;
}

/**
 * Generate a unique ID for ARIA attributes
 */
let idCounter = 0;

export function useUniqueId(prefix = 'id'): string {
  const idRef = useRef<string | undefined>(undefined);

  if (!idRef.current) {
    idRef.current = `${prefix}-${++idCounter}`;
  }

  return idRef.current;
}

/**
 * Helper to get ARIA label props
 */
export function getAriaLabel(label: string, description?: string) {
  return {
    'aria-label': label,
    ...(description && { 'aria-describedby': description }),
  };
}
