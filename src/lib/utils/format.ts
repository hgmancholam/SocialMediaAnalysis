/**
 * Formatting Utilities
 *
 * Common formatting functions for dates, numbers, and strings
 */

import { NUMBER_FORMATS } from '@/config/constants';

/**
 * Formats a date in Spanish (Colombia) locale
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Formats a date with time in Spanish (Colombia) locale
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formats a number with thousands separator
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat(NUMBER_FORMATS.LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formats a number as currency (Colombian Peso)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(NUMBER_FORMATS.LOCALE, {
    style: 'currency',
    currency: NUMBER_FORMATS.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number as percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${formatNumber(value * 100, decimals)}%`;
};

/**
 * Formats a large number with K, M, B suffixes
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat(NUMBER_FORMATS.LOCALE, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

/**
 * Truncates a string to a maximum length with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Formats coordinates for display
 */
export const formatCoordinates = (lon: number, lat: number, decimals: number = 4): string => {
  return `${lat.toFixed(decimals)}°N, ${Math.abs(lon).toFixed(decimals)}°W`;
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

/**
 * Formats duration in milliseconds to human-readable format
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Formats a relative time (e.g., "hace 2 horas")
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'hace un momento';
  if (diffMinutes < 60) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return formatDate(dateObj);
};
