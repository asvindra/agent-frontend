export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'confirmed';
  type: 'input' | 'questions' | 'confirmation' | 'processing' | 'result';
  data?: any;
  timestamp: string;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
}

export interface WorkflowQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface WorkflowResponse {
  id: string;
  stepId: string;
  answers: Record<string, string | string[] | number>;
  timestamp: string;
  confirmed?: boolean;
}

export interface WorkflowState {
  id: string;
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'completed' | 'failed' | 'paused';
  steps: WorkflowStep[];
  responses: WorkflowResponse[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  allowStepBack?: boolean;
  requireStepConfirmation?: boolean;
}

export interface WorkflowSubmission {
  initialInput: string;
  workflowType: string;
  metadata?: Record<string, any>;
}

export interface WorkflowUpdate {
  stepId: string;
  questions?: WorkflowQuestion[];
  message?: string;
  nextStep?: number;
  isComplete?: boolean;
  result?: any;
  requiresConfirmation?: boolean;
}

export interface StepConfirmation {
  stepId: string;
  confirmed: boolean;
  feedback?: string;
} 