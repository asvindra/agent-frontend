import React from 'react';
import { useAgents } from '../hooks/useAgents';
import { useWebSocket } from '../hooks/useWebSocket';
import AgentCard from './AgentCard';
import StatusIndicator from './StatusIndicator';
import RequirementForm from './RequirementForm';
import './AgentDashboard.css';

const AgentDashboard: React.FC = () => {
  const { data: agentsResponse, isLoading, error } = useAgents();
  const { isConnected, lastMessage } = useWebSocket();
  
  // TEMPORARY: Use fallback mock data if API fails
  const fallbackAgents = [
    {
      id: 'agent-1',
      name: 'AI Assistant',
      status: 'online' as const,
      lastSeen: new Date().toISOString(),
      currentTask: 'Ready for tasks',
      updates: []
    },
    {
      id: 'agent-2', 
      name: 'Data Processor',
      status: 'online' as const,
      lastSeen: new Date().toISOString(),
      currentTask: 'Available',
      updates: []
    },
    {
      id: 'agent-3',
      name: 'ML Trainer',
      status: 'busy' as const,
      lastSeen: new Date().toISOString(),
      currentTask: 'Training model',
      updates: []
    }
  ];
  
  const agents = agentsResponse?.data || fallbackAgents;
  
  console.log('🏠 AgentDashboard render:', {
    isLoading,
    error,
    agentsResponse,
    agents,
    agentsCount: agents.length
  });

  // TEMPORARY: Force show content for testing
  const forceShowContent = true;

  if (isLoading && !forceShowContent) {
    console.log('⏳ Showing loading state');
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading agents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error Loading Agents</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>AI Agent Dashboard</h1>
          <p>Monitor and interact with your AI agents in real-time</p>
        </div>
        <StatusIndicator isConnected={isConnected} lastMessage={lastMessage} />
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <RequirementForm />
        </div>
        
        <div className="main-content">
          <div className="agents-section">
            <div className="section-header">
              <h2>Available Agents</h2>
              <span className="agent-count">{agents.length} agents</span>
            </div>
            
            {agents.length === 0 ? (
              <div className="no-agents">
                <div className="no-agents-icon">🤖</div>
                <h3>No Agents Available</h3>
                <p>No agents are currently online. Check your backend connection.</p>
              </div>
            ) : (
              <div className="agents-grid">
                {agents.map((agent: any) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 