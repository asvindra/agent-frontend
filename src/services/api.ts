import axios from 'axios';
import { ApiResponse, AgentState, ProcessingState, RequirementRequest } from '../types/api';

// Mock data for development
const mockAgents: AgentState[] = [
  {
    id: 'agent-1',
    name: 'AI Assistant',
    status: 'online',
    lastSeen: new Date().toISOString(),
    currentTask: 'Ready for tasks',
    updates: []
  },
  {
    id: 'agent-2', 
    name: 'Data Processor',
    status: 'online',
    lastSeen: new Date().toISOString(),
    currentTask: 'Available',
    updates: []
  },
  {
    id: 'agent-3',
    name: 'ML Trainer',
    status: 'busy',
    lastSeen: new Date().toISOString(),
    currentTask: 'Training model',
    updates: []
  }
];

const mockProcessingState: ProcessingState = {
  id: 'processing-1',
  requirementId: 'req-1',
  currentState: 'PRD_GENERATION',
  progress: 25,
  message: 'Analyzing requirements and creating product requirements document...',
  timestamp: new Date().toISOString(),
  estimatedTime: '2 minutes remaining'
};

class ApiService {
  private baseURL: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private useMockData = true; // Set to true for development

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    this.wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';
  }

  // HTTP API methods
  async getAgents(): Promise<ApiResponse<AgentState[]>> {
    console.log('🔍 getAgents called, useMockData:', this.useMockData);
    
    if (this.useMockData) {
      console.log('📦 Using mock data for agents');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Returning mock agents:', mockAgents);
      return {
        success: true,
        data: mockAgents,
        message: 'Mock data loaded successfully'
      };
    }

    try {
      const response = await axios.get(`${this.baseURL}/agents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getAgent(id: string): Promise<ApiResponse<AgentState>> {
    if (this.useMockData) {
      const agent = mockAgents.find(a => a.id === id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      return {
        success: true,
        data: agent,
        message: 'Mock agent data loaded'
      };
    }

    try {
      const response = await axios.get(`${this.baseURL}/agents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  async triggerAgentAction(agentId: string, action: string, data?: any): Promise<ApiResponse<any>> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { message: `Mock ${action} triggered for agent ${agentId}` },
        message: 'Action completed successfully'
      };
    }

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
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const requirement: RequirementRequest = {
        id: `req-${Date.now()}`,
        message,
        timestamp: new Date().toISOString(),
        status: 'processing'
      };
      return {
        success: true,
        data: requirement,
        message: 'Requirement submitted successfully'
      };
    }

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
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate progress updates
      const progress = Math.min(100, Math.floor(Math.random() * 100));
      const states = ['PRD_GENERATION', 'REQUIREMENT_ANALYSIS', 'TECHNICAL_SPECIFICATION', 'ARCHITECTURE_DESIGN', 'IMPLEMENTATION_PLAN', 'TESTING_STRATEGY', 'DEPLOYMENT_PLAN', 'DOCUMENTATION', 'REVIEW_AND_APPROVAL', 'COMPLETED'];
      const currentState = states[Math.floor(progress / 10)] as any;
      
      return {
        success: true,
        data: {
          ...mockProcessingState,
          id: `processing-${requirementId}`,
          requirementId,
          currentState,
          progress,
          message: `Processing requirement: ${currentState.replace('_', ' ').toLowerCase()}...`,
          timestamp: new Date().toISOString()
        },
        message: 'Processing state updated'
      };
    }

    try {
      const response = await axios.get(`${this.baseURL}/requirements/${requirementId}/processing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching processing state:', error);
      throw error;
    }
  }

  async getRequirementHistory(): Promise<ApiResponse<RequirementRequest[]>> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: [],
        message: 'No previous requirements'
      };
    }

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
    if (this.useMockData) {
      // Simulate WebSocket connection
      console.log('Mock WebSocket connected');
      onConnect?.();
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        const mockUpdate = {
          type: 'agent_update',
          agentId: 'agent-1',
          data: {
            id: 'update-1',
            timestamp: new Date().toISOString(),
            status: 'working',
            message: 'Processing task...',
            progress: Math.floor(Math.random() * 100)
          }
        };
        onMessage(mockUpdate);
      }, 5000);

      // Store interval for cleanup
      (this as any).mockInterval = interval;
      return;
    }

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
    if (this.useMockData) {
      if ((this as any).mockInterval) {
        clearInterval((this as any).mockInterval);
        (this as any).mockInterval = null;
      }
      return;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendWebSocketMessage(message: any) {
    if (this.useMockData) {
      console.log('Mock WebSocket message sent:', message);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  isWebSocketConnected(): boolean {
    if (this.useMockData) {
      return true;
    }
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const apiService = new ApiService();
export default apiService; 