import React, { useState, useRef } from 'react';
import apiService from '../services/api';
import './RequirementForm.css';

interface RequirementFormProps {
  onSubmit?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onSubmit, isLoading: externalLoading }) => {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || uploadedFiles.length > 0) {
      setIsSubmitting(true);
      
      try {
        if (onSubmit) {
          await onSubmit(message.trim(), uploadedFiles.map(uf => uf.file));
        } else {
          // Use the API service
          const result = await apiService.submitChat(message.trim(), uploadedFiles.map(uf => uf.file));
          console.log('📤 Chat submitted successfully:', result);
        }
        
        setMessage('');
        setUploadedFiles([]);
      } catch (error) {
        console.error('Failed to submit chat:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files)
      .filter(file => file.type === 'application/pdf' || file.type.startsWith('image/'))
      .map(file => ({
        file,
        id: `${Date.now()}-${Math.random()}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const isLoading = externalLoading || isSubmitting;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>AI Agent Chat</h3>
        <p>Upload files and chat with your AI agent</p>
      </div>
      
      <div className="chat-messages">
        <div className="message system-message">
          <div className="message-content">
            <p>👋 Hello! I'm your AI agent assistant. I can help you with:</p>
            <ul>
              <li>Document analysis (PDF)</li>
              <li>Image processing</li>
              <li>Data analysis</li>
              <li>Report generation</li>
              <li>And much more!</li>
            </ul>
            <p>Upload files and describe what you need, and I'll help you get started.</p>
          </div>
        </div>
      </div>
      
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          {/* File Upload Area */}
          <div 
            className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="file-upload-content">
              <div className="file-upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="file-upload-text">
                Drop files here or <button type="button" onClick={openFileDialog} className="file-upload-button">browse</button>
              </p>
              <p className="file-upload-hint">Supports PDF and image files</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="file-input-hidden"
            />
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="uploaded-file">
                  <div className="file-preview">
                    {uploadedFile.preview ? (
                      <img src={uploadedFile.preview} alt={uploadedFile.file.name} className="file-preview-image" />
                    ) : (
                      <div className="file-preview-pdf">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <span className="file-name">{uploadedFile.file.name}</span>
                    <span className="file-size">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="remove-file-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

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
              disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading}
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
          <span className="input-hint">
            {isLoading 
              ? 'Sending message...' 
              : 'Press Enter to send, Shift+Enter for new line'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequirementForm; 