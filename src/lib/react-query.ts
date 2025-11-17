import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

// Query Keys Factory - Centralized key management
export const queryKeys = {
  // Candidates
  candidates: {
    all: ['candidates'] as const,
    lists: () => [...queryKeys.candidates.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.candidates.lists(), { filters }] as const,
    details: () => [...queryKeys.candidates.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.candidates.details(), id] as const,
    search: (query: string) => [...queryKeys.candidates.all, 'search', query] as const,
  },
  
  // Interviews
  interviews: {
    all: ['interviews'] as const,
    lists: () => [...queryKeys.interviews.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.interviews.lists(), { filters }] as const,
    details: () => [...queryKeys.interviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.interviews.details(), id] as const,
    upcoming: () => [...queryKeys.interviews.all, 'upcoming'] as const,
  },
  
  // Positions
  positions: {
    all: ['positions'] as const,
    lists: () => [...queryKeys.positions.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.positions.lists(), { filters }] as const,
    details: () => [...queryKeys.positions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.positions.details(), id] as const,
    active: () => [...queryKeys.positions.all, 'active'] as const,
  },
  
  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    metrics: (timeRange: string) => [...queryKeys.analytics.all, 'metrics', timeRange] as const,
    pipeline: () => [...queryKeys.analytics.all, 'pipeline'] as const,
    hiring: (period: string) => [...queryKeys.analytics.all, 'hiring', period] as const,
  },
  
  // Messages
  messages: {
    all: ['messages'] as const,
    conversations: () => [...queryKeys.messages.all, 'conversations'] as const,
    conversation: (id: string) => [...queryKeys.messages.all, 'conversation', id] as const,
    unread: () => [...queryKeys.messages.all, 'unread'] as const,
  },
  
  // User & Auth
  user: {
    profile: ['user', 'profile'] as const,
    settings: ['user', 'settings'] as const,
    notifications: ['user', 'notifications'] as const,
  },
} as const;

// Cache invalidation helpers
export const invalidateQueries = {
  candidates: () => queryClient.invalidateQueries({ queryKey: queryKeys.candidates.all }),
  interviews: () => queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all }),
  positions: () => queryClient.invalidateQueries({ queryKey: queryKeys.positions.all }),
  analytics: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
  messages: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages.all }),
  all: () => queryClient.invalidateQueries(),
};

// Prefetch helpers
export const prefetchQueries = {
  candidates: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.candidates.lists(),
      queryFn: () => import('../services/api').then(api => api.candidatesApi.getAll()),
    });
  },
  
  dashboard: async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.analytics.dashboard(),
        queryFn: () => import('../services/api').then(api => api.analyticsApi.getDashboardStats()),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.interviews.upcoming(),
        queryFn: () => import('../services/api').then(api => api.interviewsApi.getAll()),
      }),
    ]);
  },
};
