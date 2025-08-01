import React, { useState } from 'react';
import './RequirementForm.css';

interface RequirementFormProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onSubmit, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="requirement-form">
      <div className="form-header">
        <h3>Agent Chat</h3>
        <p>Describe your task or ask a question to the agent</p>
      </div>
      
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want the agent to do... (e.g., 'Process the sales data and generate a report', 'Train a model on the customer dataset')"
            rows={3}
            disabled={isLoading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? (
              <span className="loading-dots">Sending...</span>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementForm; 