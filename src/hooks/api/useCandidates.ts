import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesApi } from '../../services/api';
import { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type Candidate = Database['public']['Tables']['candidates']['Row'];

// Query keys for candidates
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: (filters: string) => [...candidateKeys.lists(), { filters }] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
};

// Fetch all candidates
export const useCandidates = () => {
  return useQuery({
    queryKey: candidateKeys.lists(),
    queryFn: candidatesApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch single candidate
export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: () => candidatesApi.getById(id),
    enabled: !!id,
  });
};

// Create candidate mutation
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: candidatesApi.create,
    onSuccess: (newCandidate) => {
      // Invalidate and refetch candidates list
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      
      // Optimistically update the cache
      queryClient.setQueryData(candidateKeys.lists(), (old: Candidate[] | undefined) => {
        return old ? [...old, newCandidate] : [newCandidate];
      });
      
      toast.success('Candidate created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create candidate');
    },
  });
};

// Update candidate mutation
export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      candidatesApi.update(id, updates),
    onSuccess: (updatedCandidate, { id }) => {
      // Update the candidate in the cache
      queryClient.setQueryData(candidateKeys.detail(id), updatedCandidate);
      
      // Update the candidate in the list
      queryClient.setQueryData(candidateKeys.lists(), (old: Candidate[] | undefined) => {
        return old?.map(candidate => 
          candidate.id === id ? updatedCandidate : candidate
        );
      });
      
      toast.success('Candidate updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update candidate');
    },
  });
};

// Delete candidate mutation
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: candidatesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove candidate from cache
      queryClient.removeQueries({ queryKey: candidateKeys.detail(deletedId) });
      
      // Remove from list
      queryClient.setQueryData(candidateKeys.lists(), (old: Candidate[] | undefined) => {
        return old?.filter(candidate => candidate.id !== deletedId);
      });
      
      toast.success('Candidate deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete candidate');
    },
  });
};

// Search candidates
export const useSearchCandidates = (query: string) => {
  return useQuery({
    queryKey: [...candidateKeys.lists(), 'search', query],
    queryFn: () => candidatesApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
  });
};
