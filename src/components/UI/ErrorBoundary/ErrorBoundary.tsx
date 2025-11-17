import React, { Component, ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { GlassCard, GlassButton } from '../Glass/GlassComponents';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center p-6">
    <GlassCard className="max-w-md w-full p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <GlassButton
        variant="primary"
        onClick={() => window.location.reload()}
        className="flex items-center space-x-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Refresh Page</span>
      </GlassButton>
    </GlassCard>
  </div>
);

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

export const QueryErrorBoundary = ({ children, fallback }: QueryErrorBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallback={
          fallback ? (
            <QueryErrorFallback fallback={fallback} reset={reset} />
          ) : (
            <DefaultQueryErrorFallback reset={reset} />
          )
        }
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

interface QueryErrorFallbackProps {
  fallback: (error: Error, retry: () => void) => ReactNode;
  reset: () => void;
}

const QueryErrorFallback = ({ fallback, reset }: QueryErrorFallbackProps) => {
  const error = new Error('Query failed');
  return <>{fallback(error, reset)}</>;
};

interface DefaultQueryErrorFallbackProps {
  reset: () => void;
}

const DefaultQueryErrorFallback = ({ reset }: DefaultQueryErrorFallbackProps) => (
  <div className="min-h-[400px] flex items-center justify-center p-6">
    <GlassCard className="max-w-md w-full p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Failed to load data
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We couldn't fetch the latest data. Please check your connection and try again.
      </p>
      <div className="flex space-x-3 justify-center">
        <GlassButton
          variant="secondary"
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Page</span>
        </GlassButton>
        <GlassButton
          variant="primary"
          onClick={reset}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </GlassButton>
      </div>
    </GlassCard>
  </div>
);

export default ErrorBoundary;
