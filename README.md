# Agent Frontend Dashboard

A modern React application for monitoring and controlling AI agents with real-time updates via WebSocket connections.

## Features

- 🚀 **Real-time Updates**: Live agent status updates via WebSocket
- 📊 **Dashboard Overview**: Statistics and visual status indicators
- 🎛️ **Agent Control**: Start, stop, and restart agent actions
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Auto-refresh**: Automatic data polling with React Query
- 🎨 **Modern UI**: Beautiful, accessible interface with smooth animations
- ⚡ **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Real-time**: WebSocket API
- **Styling**: CSS3 with modern design patterns
- **Backend**: Separate backend service (configured via environment variables)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- **Backend service running** (see configuration below)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd agent-frontend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # The .env file is already created with default values
   # Update these to match your backend configuration:
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws
   REACT_APP_AGENT_UPDATE_INTERVAL=5000
   REACT_APP_ENV=development
   REACT_APP_DEBUG=true
   ```

3. **Start your backend service** (make sure it's running on the configured ports)

4. **Start the React application:**
   ```bash
   npm start
   # or use the convenience script:
   ./start-dev.sh
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
agent-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── AgentCard.tsx   # Individual agent display
│   │   ├── AgentDashboard.tsx # Main dashboard
│   │   └── StatusIndicator.tsx # WebSocket status
│   ├── hooks/              # Custom React hooks
│   │   ├── useAgents.ts    # Agent data fetching
│   │   └── useWebSocket.ts # WebSocket connection
│   ├── services/           # API services
│   │   └── api.ts         # HTTP and WebSocket client
│   ├── types/             # TypeScript definitions
│   │   └── api.ts         # API response types
│   └── App.tsx            # Main application
├── .env                   # Environment variables
├── start-dev.sh          # Development startup script
└── README.md             # Documentation
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8000/api` | Backend API endpoint |
| `REACT_APP_WEBSOCKET_URL` | `ws://localhost:8000/ws` | WebSocket connection URL |
| `REACT_APP_AGENT_UPDATE_INTERVAL` | `5000` | Polling interval (ms) |
| `REACT_APP_ENV` | `development` | Environment mode |
| `REACT_APP_DEBUG` | `true` | Enable debug logging |

## Backend API Requirements

Your backend should provide these endpoints:

### HTTP API Endpoints
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get specific agent
- `POST /api/agents/:id/actions` - Trigger agent action



## Features in Detail

### Responsive Design
- Mobile-friendly interface
- Adaptive grid layout
- Touch-friendly controls

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

### Development Script

```bash
# Start with convenience script (recommended)
./start-dev.sh
```

## Customization

### Adding New Agent Actions

1. Update the API service in `src/services/api.ts`
2. Add new action types in `src/types/api.ts`
3. Update the AgentCard component to handle new actions

### Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Smooth transitions and animations
- Mobile-first responsive design

### Adding New Agent Types

1. Extend the `AgentState` interface in `src/types/api.ts`
2. Update your backend data structure
3. Modify the AgentCard component to display new fields

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure your backend is running on the configured port
   - Check firewall settings
   - Verify the WebSocket URL in .env

2. **API Requests Failing**
   - Confirm your backend API is running
   - Check the API base URL in .env
   - Verify CORS settings on your backend

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`

4. **Port Already in Use**
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`
   - Or use a different port: `PORT=3001 npm start`

### Debug Mode

Enable debug logging by setting `REACT_APP_DEBUG=true` in your .env file. This will log:
- API requests and responses
- WebSocket connection events
- Error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
