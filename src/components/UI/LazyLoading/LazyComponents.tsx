import React, { Suspense, ComponentType } from 'react';
import { GlassCard } from '../Glass/GlassComponents';
import { motion } from 'framer-motion';

// Generic lazy loading component wrapper
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(importFunc);

  return React.forwardRef<any, P>((props, ref) => (
    <Suspense fallback={fallback || <DefaultLazyFallback />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Default loading fallback
const DefaultLazyFallback = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center p-8"
  >
    <GlassCard className="p-6">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="text-gray-600 dark:text-gray-300">Loading component...</span>
      </div>
    </GlassCard>
  </motion.div>
);

// Hook for lazy loading with intersection observer
export const useLazyLoad = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const targetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsIntersecting(true);
          setIsLoaded(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options,
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [isLoaded, options]);

  return { targetRef, isIntersecting, isLoaded };
};

// Lazy image component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback,
  loadingComponent,
  className = '',
  ...props
}) => {
  const { targetRef, isIntersecting } = useLazyLoad();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div ref={targetRef} className={`relative ${className}`}>
      {isIntersecting && !hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          {...props}
        />
      ) : null}
      
      {isLoading && isIntersecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          {loadingComponent || (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full rounded"></div>
          )}
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          {fallback || (
            <div className="text-gray-400 text-sm">Failed to load image</div>
          )}
        </div>
      )}
    </div>
  );
};

// Lazy content wrapper
interface LazyContentProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
}

export const LazyContent: React.FC<LazyContentProps> = ({
  children,
  placeholder,
  className = '',
}) => {
  const { targetRef, isIntersecting } = useLazyLoad();

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        placeholder || (
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        )
      )}
    </div>
  );
};

// Pre-defined lazy loaded components
export const LazyAnalytics = withLazyLoading(() => import('../../../pages/Analytics'));
export const LazyCandidateDetails = withLazyLoading(() => import('../../Candidates/CandidateDetailsModal'));
export const LazyInterviewScheduler = withLazyLoading(() => import('../../Interviews/ScheduleInterviewModal'));
export const LazySettings = withLazyLoading(() => import('../../../pages/Settings'));

// Preload function for critical components
export const preloadComponents = {
  analytics: () => import('../../../pages/Analytics'),
  candidateDetails: () => import('../../Candidates/CandidateDetailsModal'),
  interviewScheduler: () => import('../../Interviews/ScheduleInterviewModal'),
  settings: () => import('../../../pages/Settings'),
};

// Hook for component preloading
export const usePreloadComponents = () => {
  React.useEffect(() => {
    // Preload critical components after initial render
    const timer = setTimeout(() => {
      Promise.all([
        preloadComponents.analytics(),
        preloadComponents.candidateDetails(),
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
};
