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
    <div className="chat-container">
      <div className="chat-header">
        <h3>Agent Chat</h3>
        <p>Ask your agent to perform tasks or answer questions</p>
      </div>
      
      <div className="chat-messages">
        <div className="message system-message">
          <div className="message-content">
            <p>👋 Hello! I'm your AI agent assistant. I can help you with:</p>
            <ul>
              <li>Data processing and analysis</li>
              <li>Machine learning model training</li>
              <li>Automation tasks</li>
              <li>Report generation</li>
              <li>And much more!</li>
            </ul>
            <p>Just describe what you need and I'll get started.</p>
          </div>
        </div>
      </div>
      
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message your agent..."
              rows={1}
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </form>
        <div className="input-footer">
          <span className="input-hint">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default RequirementForm; 