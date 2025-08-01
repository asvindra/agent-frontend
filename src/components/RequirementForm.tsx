import React, { useState } from 'react';
import './RequirementForm.css';

interface RequirementFormProps {
  onSubmit: (requirements: AgentRequirements) => void;
  isLoading?: boolean;
}

export interface AgentRequirements {
  taskType: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  resources: string[];
  constraints: string;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<AgentRequirements>({
    taskType: '',
    description: '',
    priority: 'medium',
    estimatedDuration: '',
    resources: [],
    constraints: ''
  });

  const [newResource, setNewResource] = useState('');

  const handleInputChange = (field: keyof AgentRequirements, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      handleInputChange('resources', [...formData.resources, newResource.trim()]);
      setNewResource('');
    }
  };

  const handleRemoveResource = (index: number) => {
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    handleInputChange('resources', updatedResources);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.taskType && formData.description) {
      onSubmit(formData);
      // Reset form
      setFormData({
        taskType: '',
        description: '',
        priority: 'medium',
        estimatedDuration: '',
        resources: [],
        constraints: ''
      });
    }
  };

  return (
    <div className="requirement-form">
      <h3>Agent Task Requirements</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskType">Task Type *</label>
          <select
            id="taskType"
            value={formData.taskType}
            onChange={(e) => handleInputChange('taskType', e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Select task type</option>
            <option value="data-processing">Data Processing</option>
            <option value="ml-training">ML Training</option>
            <option value="analysis">Analysis</option>
            <option value="automation">Automation</option>
            <option value="monitoring">Monitoring</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the task requirements in detail..."
            rows={4}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedDuration">Estimated Duration</label>
            <input
              type="text"
              id="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
              placeholder="e.g., 2 hours, 1 day"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Required Resources</label>
          <div className="resource-input">
            <input
              type="text"
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              placeholder="Add resource (e.g., GPU, API access)"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
            />
            <button
              type="button"
              onClick={handleAddResource}
              disabled={!newResource.trim() || isLoading}
              className="add-resource-btn"
            >
              Add
            </button>
          </div>
          {formData.resources.length > 0 && (
            <div className="resource-tags">
              {formData.resources.map((resource, index) => (
                <span key={index} className="resource-tag">
                  {resource}
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(index)}
                    disabled={isLoading}
                    className="remove-resource-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="constraints">Constraints</label>
          <textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => handleInputChange('constraints', e.target.value)}
            placeholder="Any constraints or limitations..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={!formData.taskType || !formData.description || isLoading}
            className="submit-btn"
          >
            {isLoading ? 'Submitting...' : 'Submit Requirements'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementForm; 