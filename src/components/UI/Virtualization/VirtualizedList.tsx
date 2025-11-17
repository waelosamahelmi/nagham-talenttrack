import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { GlassCard } from '../Glass/GlassComponents';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  gap?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
  overscan?: number;
}

const VirtualizedList = <T,>({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 600,
  gap = 8,
  loading = false,
  loadingComponent,
  emptyComponent,
  className = '',
  overscan = 5,
}: VirtualizedListProps<T>) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Memoize the virtual items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => {
    return virtualItems.map((virtualItem) => {
      const item = items[virtualItem.index];
      return (
        <motion.div
          key={virtualItem.key}
          data-index={virtualItem.index}
          ref={virtualizer.measureElement}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItem.start}px)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: virtualItem.index * 0.02,
          }}
        >
          {renderItem(item, virtualItem.index)}
        </motion.div>
      );
    });
  }, [virtualItems, items, renderItem, virtualizer]);

  if (loading) {
    return (
      <div className={`${className}`} style={{ height: containerHeight }}>
        {loadingComponent || <DefaultLoadingComponent />}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`${className}`} style={{ height: containerHeight }}>
        {emptyComponent || <DefaultEmptyComponent />}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {memoizedItems}
      </div>
    </div>
  );
};

const DefaultLoadingComponent = () => (
  <div className="space-y-4 p-4">
    {[...Array(6)].map((_, index) => (
      <GlassCard key={index} className="h-24 animate-shimmer" animated={false}>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>
      </GlassCard>
    ))}
  </div>
);

const DefaultEmptyComponent = () => (
  <div className="flex items-center justify-center h-full">
    <GlassCard className="p-8 text-center max-w-md">
      <div className="text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v2a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2z"
          />
        </svg>
        <h3 className="text-sm font-medium mb-1">No items found</h3>
        <p className="text-xs">Try adjusting your search or filters</p>
      </div>
    </GlassCard>
  </div>
);

export default VirtualizedList;

// Hook for infinite scrolling with virtualization
export const useInfiniteVirtualization = <T,>(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
) => {
  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const threshold = 100; // pixels from bottom
      
      if (
        scrollHeight - scrollTop - clientHeight < threshold &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  return { onScroll };
};
