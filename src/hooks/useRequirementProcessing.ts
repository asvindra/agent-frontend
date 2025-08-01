import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { RequirementRequest, ProcessingState } from '../types/api';

export const useRequirementProcessing = () => {
  const [currentRequirementId, setCurrentRequirementId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Submit requirement mutation
  const submitRequirementMutation = useMutation({
    mutationFn: (message: string) => apiService.submitRequirement(message),
    onSuccess: (data) => {
      setCurrentRequirementId(data.data.id);
      // Invalidate requirements list to refresh
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
    },
    onError: (error) => {
      console.error('Failed to submit requirement:', error);
    }
  });

  // Get processing state for current requirement
  const processingStateQuery = useQuery({
    queryKey: ['processing-state', currentRequirementId],
    queryFn: () => apiService.getProcessingState(currentRequirementId!),
    enabled: !!currentRequirementId,
    refetchInterval: (data) => {
      // Stop polling if completed or failed
      const processingData = data?.data;
      if (processingData?.currentState === 'COMPLETED' || processingData?.progress === 100) {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    refetchIntervalInBackground: true
  });

  // Get requirement history
  const requirementsHistoryQuery = useQuery({
    queryKey: ['requirements'],
    queryFn: () => apiService.getRequirementHistory(),
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Clear current requirement when processing is complete
  useEffect(() => {
    const processingData = processingStateQuery.data?.data;
    if (processingData?.currentState === 'COMPLETED') {
      // Keep the current requirement for a few seconds to show completion
      setTimeout(() => {
        setCurrentRequirementId(null);
      }, 3000);
    }
  }, [processingStateQuery.data?.data?.currentState]);

  const submitRequirement = (message: string) => {
    submitRequirementMutation.mutate(message);
  };

  const clearCurrentRequirement = () => {
    setCurrentRequirementId(null);
  };

  return {
    // Submit functionality
    submitRequirement,
    isSubmitting: submitRequirementMutation.isPending,
    submitError: submitRequirementMutation.error,

    // Processing state
    processingState: processingStateQuery.data?.data || null,
    isProcessing: processingStateQuery.isLoading,
    processingError: processingStateQuery.error,

    // History
    requirementsHistory: requirementsHistoryQuery.data?.data || [],
    isHistoryLoading: requirementsHistoryQuery.isLoading,

    // Current requirement
    currentRequirementId,
    clearCurrentRequirement,

    // Overall state
    hasActiveProcessing: !!currentRequirementId && processingStateQuery.data?.data?.currentState !== 'COMPLETED'
  };
}; 