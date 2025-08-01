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

// New types for requirement processing
export interface RequirementRequest {
  id: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ProcessingState {
  id: string;
  requirementId: string;
  currentState: ProcessingStep;
  progress: number;
  message: string;
  timestamp: string;
  estimatedTime?: string;
}

export type ProcessingStep = 
  | 'PRD_GENERATION'
  | 'REQUIREMENT_ANALYSIS'
  | 'TECHNICAL_SPECIFICATION'
  | 'ARCHITECTURE_DESIGN'
  | 'IMPLEMENTATION_PLAN'
  | 'TESTING_STRATEGY'
  | 'DEPLOYMENT_PLAN'
  | 'DOCUMENTATION'
  | 'REVIEW_AND_APPROVAL'
  | 'COMPLETED';

export interface ProcessingStepInfo {
  step: ProcessingStep;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const PROCESSING_STEPS: Record<ProcessingStep, ProcessingStepInfo> = {
  PRD_GENERATION: {
    step: 'PRD_GENERATION',
    name: 'PRD Generation',
    description: 'Creating Product Requirements Document',
    icon: '📋',
    color: '#3b82f6'
  },
  REQUIREMENT_ANALYSIS: {
    step: 'REQUIREMENT_ANALYSIS',
    name: 'Requirement Analysis',
    description: 'Analyzing and breaking down requirements',
    icon: '🔍',
    color: '#8b5cf6'
  },
  TECHNICAL_SPECIFICATION: {
    step: 'TECHNICAL_SPECIFICATION',
    name: 'Technical Specification',
    description: 'Creating detailed technical specifications',
    icon: '⚙️',
    color: '#06b6d4'
  },
  ARCHITECTURE_DESIGN: {
    step: 'ARCHITECTURE_DESIGN',
    name: 'Architecture Design',
    description: 'Designing system architecture',
    icon: '🏗️',
    color: '#10b981'
  },
  IMPLEMENTATION_PLAN: {
    step: 'IMPLEMENTATION_PLAN',
    name: 'Implementation Plan',
    description: 'Creating implementation roadmap',
    icon: '📅',
    color: '#f59e0b'
  },
  TESTING_STRATEGY: {
    step: 'TESTING_STRATEGY',
    name: 'Testing Strategy',
    description: 'Planning testing approach',
    icon: '🧪',
    color: '#ef4444'
  },
  DEPLOYMENT_PLAN: {
    step: 'DEPLOYMENT_PLAN',
    name: 'Deployment Plan',
    description: 'Creating deployment strategy',
    icon: '🚀',
    color: '#8b5cf6'
  },
  DOCUMENTATION: {
    step: 'DOCUMENTATION',
    name: 'Documentation',
    description: 'Creating comprehensive documentation',
    icon: '📚',
    color: '#06b6d4'
  },
  REVIEW_AND_APPROVAL: {
    step: 'REVIEW_AND_APPROVAL',
    name: 'Review & Approval',
    description: 'Final review and approval process',
    icon: '✅',
    color: '#10b981'
  },
  COMPLETED: {
    step: 'COMPLETED',
    name: 'Completed',
    description: 'All tasks completed successfully',
    icon: '🎉',
    color: '#10b981'
  }
}; 