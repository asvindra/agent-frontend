import axios, { AxiosInstance } from 'axios';
import { AgentState, ApiResponse, LiveUpdateEvent } from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        if (process.env.REACT_APP_DEBUG === 'true') {
          console.log('API Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // HTTP API Methods
  async getAgents(): Promise<AgentState[]> {
    try {
      const response = await this.api.get<ApiResponse<AgentState[]>>('/agents');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  }

  async getAgentById(id: string): Promise<AgentState | null> {
    try {
      const response = await this.api.get<ApiResponse<AgentState>>(`/agents/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch agent ${id}:`, error);
      return null;
    }
  }

  async triggerAgentAction(agentId: string, action: string, params?: any): Promise<boolean> {
    try {
      const response = await this.api.post<ApiResponse<boolean>>(`/agents/${agentId}/actions`, {
        action,
        params,
      });
      return response.data.success;
    } catch (error) {
      console.error(`Failed to trigger action for agent ${agentId}:`, error);
      return false;
    }
  }

  // WebSocket Methods
  connectWebSocket(onMessage: (event: LiveUpdateEvent) => void, onConnect?: () => void, onDisconnect?: () => void) {
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001';
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: LiveUpdateEvent = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        onDisconnect?.();
        this.attemptReconnect(onMessage, onConnect, onDisconnect);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private attemptReconnect(
    onMessage: (event: LiveUpdateEvent) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(onMessage, onConnect, onDisconnect);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendWebSocketMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const apiService = new ApiService();
export default apiService; 