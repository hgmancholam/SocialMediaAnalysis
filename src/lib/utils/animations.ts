/**
 * Animation Utilities with Reduced Motion Support
 *
 * Framer Motion variants with automatic reduced motion fallbacks
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Standard transition durations
 */
export const DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

/**
 * Standard easing curves
 */
export const EASINGS = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: { type: 'spring', damping: 25, stiffness: 200 },
} as const;

/**
 * Fade in/out variants
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Slide up variants
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Slide down variants
 */
export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Slide in from left
 */
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Slide in from right
 */
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Scale variants (pop in/out)
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Stagger children animation
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/**
 * Stagger item (use with staggerContainerVariants)
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.fast },
  },
};

/**
 * Get transition with reduced motion support
 */
export function getTransition(
  transition: Transition,
  reducedMotionFallback?: Transition
): Transition {
  if (prefersReducedMotion()) {
    return reducedMotionFallback || { duration: 0.01 };
  }
  return transition;
}

/**
 * Get variants with reduced motion support
 */
export function getVariants(
  variants: Variants,
  reducedMotion: 'fade' | 'instant' = 'fade'
): Variants {
  if (prefersReducedMotion()) {
    if (reducedMotion === 'instant') {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      };
    }
    return fadeVariants;
  }
  return variants;
}

/**
 * Bounce animation for notifications
 */
export const bounceVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 200,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

/**
 * Rotate animation
 */
export const rotateVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    rotate: 180,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeIn },
  },
};

/**
 * Default animation props for motion components
 */
export const defaultAnimationProps = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
} as const;
