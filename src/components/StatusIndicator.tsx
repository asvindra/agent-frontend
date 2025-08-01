import React from 'react';
import './StatusIndicator.css';

interface StatusIndicatorProps {
  isConnected: boolean;
  lastMessage?: any;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isConnected, lastMessage }) => {
  return (
    <div className="status-indicator">
      <div className="connection-status">
        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
        <span className="status-text">
          {isConnected ? 'Live Updates Connected' : 'Disconnected'}
        </span>
      </div>
      
      {lastMessage && (
        <div className="last-update">
          <span className="update-label">Last Update:</span>
          <span className="update-time">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator; 