import axios from 'axios';
import { ApiResponse, AgentState } from '../types/api';

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
    console.log('🔍 getAgents called');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Returning mock agents:', mockAgents);
    return {
      success: true,
      data: mockAgents,
      message: 'Mock data loaded successfully'
    };
  }

  async getAgent(id: string): Promise<ApiResponse<AgentState>> {
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

  async triggerAgentAction(agentId: string, action: string, data?: any): Promise<ApiResponse<any>> {
    console.log(`🎯 Triggering action ${action} for agent ${agentId}`, data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        message: `Action ${action} triggered successfully`,
        agentId,
        action,
        data
      },
      message: 'Action executed successfully'
    };
  }

  // File upload and chat submission
  async submitChat(message: string, files?: File[]): Promise<ApiResponse<any>> {
    console.log('📤 Submitting chat:', { message, files: files?.length || 0 });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        id: `chat-${Date.now()}`,
        message,
        files: files?.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })) || [],
        timestamp: new Date().toISOString(),
        status: 'submitted'
      },
      message: 'Chat submitted successfully'
    };
  }

  // WebSocket methods
  connectWebSocket(
    onMessage: (event: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        this.reconnectAttempts = 0;
        if (onConnect) onConnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        if (onDisconnect) onDisconnect();
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect(onMessage, onConnect, onDisconnect);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private attemptReconnect(
    onMessage: (event: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ) {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connectWebSocket(onMessage, onConnect, onDisconnect);
    }, delay);
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