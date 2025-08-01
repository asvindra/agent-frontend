import React from 'react';
import { AgentState } from '../types/api';
import './AgentCard.css';

interface AgentCardProps {
  agent: AgentState;
  onAction?: (action: string) => void;
  isLoading?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onAction, isLoading = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'busy':
        return '#f59e0b';
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'busy':
        return '🟡';
      case 'offline':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const latestUpdate = agent.updates[agent.updates.length - 1];

  return (
    <div className={`agent-card ${isLoading ? 'loading' : ''}`}>
      <div className="agent-header">
        <div className="agent-info">
          <h3 className="agent-name">{agent.name}</h3>
          <div className="agent-status">
            <span className="status-icon">{getStatusIcon(agent.status)}</span>
            <span 
              className="status-text"
              style={{ color: getStatusColor(agent.status) }}
            >
              {agent.status}
            </span>
          </div>
        </div>
        <div className="agent-id">#{agent.id}</div>
      </div>

      <div className="agent-details">
        <div className="detail-item">
          <span className="label">Last Seen:</span>
          <span className="value">{formatTimestamp(agent.lastSeen)}</span>
        </div>
        
        {agent.currentTask && (
          <div className="detail-item">
            <span className="label">Current Task:</span>
            <span className="value task">{agent.currentTask}</span>
          </div>
        )}
      </div>

      {latestUpdate && (
        <div className="latest-update">
          <div className="update-header">
            <span className="update-status" style={{ color: getStatusColor(latestUpdate.status) }}>
              {latestUpdate.status}
            </span>
            <span className="update-time">{formatTimestamp(latestUpdate.timestamp)}</span>
          </div>
          <p className="update-message">{latestUpdate.message}</p>
          {latestUpdate.progress !== undefined && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${latestUpdate.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <div className="agent-actions">
        <button 
          className="action-btn primary"
          onClick={() => onAction?.('start')}
          disabled={agent.status === 'offline' || isLoading}
        >
          Start Task
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => onAction?.('stop')}
          disabled={agent.status === 'offline' || isLoading}
        >
          Stop Task
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => onAction?.('restart')}
          disabled={agent.status === 'offline' || isLoading}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default AgentCard; 