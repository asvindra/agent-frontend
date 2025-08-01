import React from 'react';
import { ProcessingState, PROCESSING_STEPS, ProcessingStep } from '../types/api';
import './ProcessingProgress.css';

interface ProcessingProgressProps {
  processingState: ProcessingState | null;
  isLoading?: boolean;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ processingState, isLoading = false }) => {
  if (!processingState && !isLoading) {
    return null;
  }

  const getCurrentStepIndex = (currentStep: ProcessingStep): number => {
    const steps = Object.keys(PROCESSING_STEPS) as ProcessingStep[];
    return steps.indexOf(currentStep);
  };

  const getStepStatus = (step: ProcessingStep, currentStep: ProcessingStep): 'completed' | 'current' | 'pending' => {
    const currentIndex = getCurrentStepIndex(currentStep);
    const stepIndex = getCurrentStepIndex(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (isLoading) {
    return (
      <div className="processing-progress">
        <div className="progress-header">
          <h3>Processing Your Request</h3>
          <div className="loading-spinner"></div>
        </div>
        <div className="progress-message">
          Initializing agent processing...
        </div>
      </div>
    );
  }

  if (!processingState) return null;

  const currentStep = processingState.currentState;
  const currentStepInfo = PROCESSING_STEPS[currentStep];
  const allSteps = Object.values(PROCESSING_STEPS);

  return (
    <div className="processing-progress">
      <div className="progress-header">
        <h3>Processing Your Request</h3>
        <div className="progress-percentage">
          {processingState.progress}%
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${processingState.progress}%` }}
          />
        </div>
        <div className="progress-steps">
          {allSteps.map((stepInfo) => {
            const status = getStepStatus(stepInfo.step, currentStep);
            return (
              <div 
                key={stepInfo.step}
                className={`progress-step ${status}`}
              >
                <div className="step-icon" style={{ color: stepInfo.color }}>
                  {stepInfo.icon}
                </div>
                <div className="step-info">
                  <div className="step-name">{stepInfo.name}</div>
                  <div className="step-description">{stepInfo.description}</div>
                </div>
                {status === 'completed' && (
                  <div className="step-check">✓</div>
                )}
                {status === 'current' && (
                  <div className="step-spinner"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="current-status">
        <div className="status-header">
          <span className="status-icon" style={{ color: currentStepInfo.color }}>
            {currentStepInfo.icon}
          </span>
          <span className="status-title">{currentStepInfo.name}</span>
        </div>
        <div className="status-message">
          {processingState.message}
        </div>
        {processingState.estimatedTime && (
          <div className="estimated-time">
            Estimated completion: {processingState.estimatedTime}
          </div>
        )}
      </div>

      <div className="progress-timestamp">
        Last updated: {new Date(processingState.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ProcessingProgress; 