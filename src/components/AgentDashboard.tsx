import React from 'react';
import { useAgents, useTriggerAgentAction } from '../hooks/useAgents';
import { useWebSocket } from '../hooks/useWebSocket';
import AgentCard from './AgentCard';
import StatusIndicator from './StatusIndicator';
import './AgentDashboard.css';

const AgentDashboard: React.FC = () => {
  const { data: agents = [], isLoading, error } = useAgents();
  const triggerAction = useTriggerAgentAction();
  const { isConnected, lastMessage } = useWebSocket();

  const handleAgentAction = async (agentId: string, action: string) => {
    try {
      await triggerAction.mutateAsync({ agentId, action });
    } catch (error) {
      console.error(`Failed to trigger ${action} for agent ${agentId}:`, error);
    }
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error Loading Agents</h2>
        <p>Failed to connect to the agent service. Please check your connection and try again.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Agent Dashboard</h1>
          <p>Monitor and control your AI agents in real-time</p>
        </div>
        <StatusIndicator isConnected={isConnected} lastMessage={lastMessage} />
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{agents.length}</div>
          <div className="stat-label">Total Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {agents.filter(a => a.status === 'online').length}
          </div>
          <div className="stat-label">Online</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {agents.filter(a => a.status === 'busy').length}
          </div>
          <div className="stat-label">Busy</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {agents.filter(a => a.status === 'offline').length}
          </div>
          <div className="stat-label">Offline</div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>No Agents Found</h3>
          <p>No agents are currently available. Please check your backend service.</p>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onAction={(action) => handleAgentAction(agent.id, action)}
              isLoading={triggerAction.isPending}
            />
          ))}
        </div>
      )}

      {triggerAction.isError && (
        <div className="error-toast">
          Failed to trigger action. Please try again.
        </div>
      )}
    </div>
  );
};

export default AgentDashboard; 