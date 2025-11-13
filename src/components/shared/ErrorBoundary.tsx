'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // Update state with error details
    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F1419] p-4">
          <div className="w-full max-w-md">
            <div className="rounded-lg border border-red-500/20 bg-[#1E2533] p-6 shadow-xl">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-500/10 p-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-2 text-center text-xl font-semibold text-white">Algo salió mal</h2>

              {/* Description */}
              <p className="mb-4 text-center text-sm text-gray-400">
                Ha ocurrido un error inesperado. Por favor, intenta recargar la página o contacta
                con soporte si el problema persiste.
              </p>

              {/* Error details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 rounded border border-white/10 bg-black/30 p-3">
                  <p className="mb-2 text-xs font-semibold text-red-400">
                    Error Details (dev only):
                  </p>
                  <pre className="overflow-auto text-xs text-gray-300">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-auto text-xs text-gray-400">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Intentar de nuevo
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Recargar página
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight ErrorBoundary for specific sections
 */
export function SectionErrorBoundary({
  children,
  sectionName = 'esta sección',
}: {
  children: ReactNode;
  sectionName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-500/20 bg-[#1E2533] p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />
            <p className="text-sm text-gray-400">Error al cargar {sectionName}</p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
