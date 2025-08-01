export interface AgentUpdate {
  id: string;
  timestamp: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  message: string;
  progress?: number;
  data?: any;
}

export interface AgentState {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen: string;
  currentTask?: string;
  updates: AgentUpdate[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface LiveUpdateEvent {
  type: 'agent_update' | 'status_change' | 'task_complete';
  agentId: string;
  data: AgentUpdate;
}

export interface ChatMessage {
  id: string;
  message: string;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  timestamp: string;
  status: 'submitted' | 'processing' | 'completed' | 'failed';
} 