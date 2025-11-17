import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { candidatesApi, interviewsApi, analyticsApi, messagesApi, positionsApi } from '../services/api';
import { queryKeys, invalidateQueries } from '../lib/react-query';
import toast from 'react-hot-toast';

// Type definitions
type Candidate = any; // Replace with proper type from your database types
type Interview = any;
type Position = any;
type Message = any;

// Candidates Hooks
export const useCandidates = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.candidates.list(filters || {}),
    queryFn: () => candidatesApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes for frequently updated data
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: queryKeys.candidates.detail(id),
    queryFn: () => candidatesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for detailed data
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: candidatesApi.create,
    onSuccess: () => {
      invalidateQueries.candidates();
      invalidateQueries.analytics();
      toast.success('Candidate created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create candidate');
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Candidate> }) => 
      candidatesApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific candidate in cache
      queryClient.setQueryData(
        queryKeys.candidates.detail(variables.id),
        data
      );
      invalidateQueries.candidates();
      invalidateQueries.analytics();
      toast.success('Candidate updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update candidate');
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: candidatesApi.delete,
    onSuccess: () => {
      invalidateQueries.candidates();
      invalidateQueries.analytics();
      toast.success('Candidate deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete candidate');
    },
  });
};

// Search with debouncing
export const useSearchCandidates = (query: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.candidates.search(query),
    queryFn: () => candidatesApi.search(query),
    enabled: enabled && query.length > 2,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

// Interviews Hooks
export const useInterviews = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.interviews.list(filters || {}),
    queryFn: () => interviewsApi.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute for interview data
  });
};

export const useInterview = (id: string) => {
  return useQuery({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: () => interviewsApi.getById(id),
    enabled: !!id,
  });
};

export const useUpcomingInterviews = () => {
  return useQuery({
    queryKey: queryKeys.interviews.upcoming(),
    queryFn: () => interviewsApi.getAll(),
    select: (data) => data?.filter((interview: any) => 
      new Date(interview.scheduled_date) > new Date()
    ),
    staleTime: 30 * 1000, // 30 seconds for upcoming interviews
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: interviewsApi.create,
    onSuccess: () => {
      invalidateQueries.interviews();
      invalidateQueries.analytics();
      toast.success('Interview scheduled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule interview');
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interview> }) => 
      interviewsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.interviews.detail(variables.id),
        data
      );
      invalidateQueries.interviews();
      invalidateQueries.analytics();
      toast.success('Interview updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update interview');
    },
  });
};

// Positions Hooks
export const usePositions = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.positions.list(filters || {}),
    queryFn: () => positionsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes for positions
  });
};

export const useActivePositions = () => {
  return useQuery({
    queryKey: queryKeys.positions.active(),
    queryFn: () => positionsApi.getAll(),
    select: (data) => data?.filter((position: any) => position.status === 'open'),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePosition = (id: string) => {
  return useQuery({
    queryKey: queryKeys.positions.detail(id),
    queryFn: () => positionsApi.getById(id),
    enabled: !!id,
  });
};

// Analytics Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => analyticsApi.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard stats
  });
};

export const usePipelineData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.pipeline(),
    queryFn: () => analyticsApi.getPipelineData(),
    staleTime: 5 * 60 * 1000, // 5 minutes for pipeline data
  });
};

export const useSourceData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.all,
    queryFn: () => analyticsApi.getSourceData(),
    staleTime: 10 * 60 * 1000, // 10 minutes for source data
  });
};

export const useHiringMetrics = (period: string = '30d') => {
  return useQuery({
    queryKey: queryKeys.analytics.hiring(period),
    queryFn: () => analyticsApi.getDashboardStats(), // Extend this with period-specific data
    staleTime: 10 * 60 * 1000,
  });
};

// Messages Hooks
export const useConversations = () => {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => messagesApi.getConversations(),
    staleTime: 1 * 60 * 1000, // 1 minute for conversations
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.messages.conversation(id),
    queryFn: () => messagesApi.getConversation(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds for active conversation
  });
};

export const useUnreadMessages = () => {
  return useQuery({
    queryKey: queryKeys.messages.unread(),
    queryFn: () => messagesApi.getUnread(),
    staleTime: 30 * 1000, // 30 seconds for unread count
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messagesApi.send,
    onSuccess: () => {
      invalidateQueries.messages();
      toast.success('Message sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

// Optimistic Updates Hook
export const useOptimisticUpdate = <T>(
  queryKey: readonly unknown[],
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T
) => {
  const queryClient = useQueryClient();
  
  return (newData: Partial<T>) => {
    queryClient.setQueryData(queryKey, (oldData: T | undefined) => 
      updateFn(oldData, newData)
    );
  };
};

// Infinite Query Hook for large datasets
export const useInfiniteCandidates = (pageSize = 20) => {
  return useQuery({
    queryKey: [...queryKeys.candidates.lists(), 'infinite'],
    queryFn: ({ pageParam = 0 }) => 
      candidatesApi.getPaginated({ offset: pageParam, limit: pageSize }),
    // getNextPageParam: (lastPage, pages) => 
    //   lastPage.length === pageSize ? pages.length * pageSize : undefined,
    staleTime: 5 * 60 * 1000,
  });
};
