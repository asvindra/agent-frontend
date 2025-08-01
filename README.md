# AI Agent Chat Frontend

A modern React application for chatting with AI agents and uploading files (PDF and images).

## 🚀 Features

- **File Upload Support**: Drag & drop or browse to upload PDF and image files
- **Chat Interface**: Clean, modern chat UI similar to ChatGPT
- **Real-time Updates**: WebSocket connection for live updates
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
agent-frontend/
├── src/
│   ├── components/
│   │   ├── AgentDashboard.tsx    # Main dashboard component
│   │   ├── RequirementForm.tsx   # Chat and file upload form
│   │   ├── StatusIndicator.tsx   # WebSocket connection status
│   │   └── *.css                 # Component styles
│   ├── hooks/
│   │   └── useWebSocket.ts       # WebSocket connection hook
│   ├── services/
│   │   └── api.ts               # API service with mock data
│   ├── types/
│   │   └── api.ts               # TypeScript type definitions
│   └── App.tsx                  # Root application component
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                   # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agent-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws
```

## 🎯 Usage

### Chat Interface
- Type your message in the text area
- Press Enter to send, Shift+Enter for new line
- Upload files by dragging them or clicking "browse"

### File Upload
- **Supported Formats**: PDF and image files (JPG, PNG, GIF, etc.)
- **File Size Limit**: 10MB per file
- **Multiple Files**: Upload multiple files at once
- **Preview**: See file thumbnails and information before sending

### WebSocket Status
- Green indicator: Connected to WebSocket server
- Red indicator: Disconnected (will auto-reconnect)

## 🔄 API Integration

The application currently uses mock data. To integrate with a real backend:

1. **Update API endpoints** in `src/services/api.ts`
2. **Replace mock data** with actual API calls
3. **Configure WebSocket** for real-time updates
4. **Update environment variables** with your API URLs

### Example API Payload

When a user submits a message with files, the payload looks like:

```javascript
{
  message: "Hello, please analyze this document",
  files: [
    {
      name: "document.pdf",
      size: 1024000,
      type: "application/pdf"
    }
  ]
}
```

## 🎨 Styling

The application uses modern CSS with:
- Flexbox and Grid layouts
- CSS custom properties for theming
- Smooth animations and transitions
- Responsive design patterns
- Dark/light mode support ready

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build/` folder contains the production-ready files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## 🔧 Development

### Adding New Features
1. Create components in `src/components/`
2. Add types in `src/types/`
3. Update API service in `src/services/api.ts`
4. Add styles in corresponding `.css` files

### Code Style
- TypeScript for type safety
- Functional components with hooks
- CSS modules for styling
- ESLint for code quality

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub.
