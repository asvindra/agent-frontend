import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: apiService.getAgents,
    refetchInterval: parseInt(process.env.REACT_APP_AGENT_UPDATE_INTERVAL || '5000'),
    staleTime: 30000,
  });
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => apiService.getAgentById(id),
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