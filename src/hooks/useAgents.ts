import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';

export const useAgents = () => {
  console.log('🔄 useAgents hook called');
  
  const result = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      console.log('🚀 Query function executing...');
      const response = await apiService.getAgents();
      console.log('📦 Query response:', response);
      return response;
    },
    refetchInterval: parseInt(process.env.REACT_APP_AGENT_UPDATE_INTERVAL || '5000'),
    staleTime: 30000,
    retry: 1,
    retryDelay: 1000,
  });
  
  console.log('📊 useAgents result:', {
    isLoading: result.isLoading,
    isError: result.isError,
    isSuccess: result.isSuccess,
    data: result.data,
    error: result.error,
    status: result.status
  });
  
  return result;
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => apiService.getAgent(id),
    enabled: !!id,
    refetchInterval: parseInt(process.env.REACT_APP_AGENT_UPDATE_INTERVAL || '5000'),
    staleTime: 30000,
  });
};

export const useTriggerAgentAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, action, params }: { agentId: string; action: string; params?: any }) =>
      apiService.triggerAgentAction(agentId, action, params),
    onSuccess: (data, variables) => {
      // Invalidate and refetch agent data
      queryClient.invalidateQueries({ queryKey: ['agent', variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}; 