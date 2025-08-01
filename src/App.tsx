import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AgentDashboard from './components/AgentDashboard';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <AgentDashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
