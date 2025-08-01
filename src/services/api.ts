import axios from 'axios';
import { ApiResponse, AgentState, ProcessingState, RequirementRequest } from '../types/api';

class ApiService {
  private baseURL: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    this.wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';
  }

  // HTTP API methods
  async getAgents(): Promise<ApiResponse<AgentState[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/agents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getAgent(id: string): Promise<ApiResponse<AgentState>> {
    try {
      const response = await axios.get(`${this.baseURL}/agents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  async triggerAgentAction(agentId: string, action: string, data?: any): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${this.baseURL}/agents/${agentId}/actions`, {
        action,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error triggering agent action:', error);
      throw error;
    }
  }

  // New methods for requirement processing
  async submitRequirement(message: string): Promise<ApiResponse<RequirementRequest>> {
    try {
      const response = await axios.post(`${this.baseURL}/requirements`, {
        message,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting requirement:', error);
      throw error;
    }
  }

  async getProcessingState(requirementId: string): Promise<ApiResponse<ProcessingState>> {
    try {
      const response = await axios.get(`${this.baseURL}/requirements/${requirementId}/processing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching processing state:', error);
      throw error;
    }
  }

  async getRequirementHistory(): Promise<ApiResponse<RequirementRequest[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/requirements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching requirement history:', error);
      throw error;
    }
  }

  // WebSocket methods
  connectWebSocket(
    onMessage: (event: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
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
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private attemptReconnect(
    onMessage: (event: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connectWebSocket(onMessage, onConnect, onDisconnect);
      }, timeout);
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
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  isWebSocketConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const apiService = new ApiService();
export default apiService; 