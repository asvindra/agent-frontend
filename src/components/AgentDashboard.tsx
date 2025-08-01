import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import StatusIndicator from './StatusIndicator';
import RequirementForm from './RequirementForm';
import './AgentDashboard.css';

const AgentDashboard: React.FC = () => {
  const { isConnected, lastMessage } = useWebSocket();

  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>AI Agent Chat</h1>
          <p>Upload files and chat with your AI agent</p>
        </div>
        <StatusIndicator isConnected={isConnected} lastMessage={lastMessage} />
      </div>

      <div className="dashboard-content">
        <div className="chat-container">
          <RequirementForm />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 