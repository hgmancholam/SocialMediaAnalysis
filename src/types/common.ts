/**
 * Common TypeScript Types
 *
 * Shared types used across multiple features
 */

// Generic API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Coordinates
export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

// Time range
export interface TimeRange {
  start: Date;
  end: Date;
}

// Filter
export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: unknown;
}

// Sort
export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

// Generic entity with ID
export interface Entity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Loading state
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// Selection state
export interface SelectionState<T> {
  selected: T[];
  isSelected: (item: T) => boolean;
  select: (item: T) => void;
  deselect: (item: T) => void;
  toggle: (item: T) => void;
  clear: () => void;
}

// Social Media specific types
export interface SocialMediaPost extends Entity {
  platform: 'twitter' | 'x' | 'facebook' | 'instagram';
  author: string;
  content: string;
  timestamp: Date;
  location?: Coordinates;
  hashtags: string[];
  mentions: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

// Graph node
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  value?: number;
  color?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

// Graph link
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
  type?: string;
}

// Graph data
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Function types
export type AsyncFunction<T = void> = () => Promise<T>;
export type Callback<T = void> = (value: T) => void;
export type EventHandler<E = Event> = (event: E) => void;

// Component props helpers
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type WithChildren<T = {}> = T & { children?: React.ReactNode };
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type WithClassName<T = {}> = T & { className?: string };
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type WithStyle<T = {}> = T & { style?: React.CSSProperties };
