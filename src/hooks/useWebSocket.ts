import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { LiveUpdateEvent } from '../types/api';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<LiveUpdateEvent | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: LiveUpdateEvent) => {
      setLastMessage(event);
      
      // Update cache based on event type
      switch (event.type) {
        case 'agent_update':
        case 'status_change':
        case 'task_complete':
          // Invalidate agent queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['agents'] });
          queryClient.invalidateQueries({ queryKey: ['agent', event.agentId] });
          break;
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      console.log('WebSocket connected successfully');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    // Connect to WebSocket
    apiService.connectWebSocket(handleMessage, handleConnect, handleDisconnect);

    // Cleanup on unmount
    return () => {
      apiService.disconnectWebSocket();
      clearReconnectTimeout();
    };
  }, [queryClient, clearReconnectTimeout]);

  return {
    isConnected,
    lastMessage,
    sendMessage: apiService.sendWebSocketMessage.bind(apiService),
  };
}; 