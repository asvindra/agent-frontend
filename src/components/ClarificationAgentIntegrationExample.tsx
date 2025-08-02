import React from 'react'
import RequirementClarificationAgent from './RequirementClarificationAgent'
import { useClarificationAgent } from '../hooks/useClarificationAgent'
import { ClarificationSubmission } from '../types/clarification'

const ClarificationAgentIntegrationExample: React.FC = () => {
  // Mock API function - replace with your actual API call
  const submitToAPI = async (data: ClarificationSubmission) => {
    // Example API integration
    const response = await fetch('/api/clarifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  const {
    isVisible,
    isSubmitting,
    clarificationData,
    error,
    showClarificationAgent,
    hideClarificationAgent,
    submitClarification,
  } = useClarificationAgent({
    onSubmit: submitToAPI,
  })

  // Mock function to simulate receiving questions from backend
  const handleGetClarificationQuestions = async () => {
    try {
      // Example: Fetch questions from API
      const response = await fetch('/api/clarification-questions')
      const data = await response.json()

      // Show the clarification agent with the received questions
      showClarificationAgent(data)
    } catch (err) {
      console.error('Error fetching clarification questions:', err)

      // Fallback to demo data
      const demoData = {
        questions: [
          'What is the primary objective of the new feature?',
          'Who are the target users for this functionality?',
          'What are the key performance requirements?',
          'Are there any specific design constraints we should consider?',
          'What is the expected timeline for delivery?',
        ],
      }
      showClarificationAgent(demoData)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Clarification Agent Integration Example</h1>
      <p>
        This example shows how to integrate the RequirementClarificationAgent
        with a real API.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGetClarificationQuestions}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '12px',
          }}
        >
          Start Clarification Process
        </button>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              color: '#dc2626',
              marginTop: '12px',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <h3>Integration Points:</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>
            <strong>Fetch Questions:</strong> GET /api/clarification-questions
          </li>
          <li>
            <strong>Submit Responses:</strong> POST /api/clarifications
          </li>
          <li>
            <strong>Error Handling:</strong> Network errors and API failures
          </li>
          <li>
            <strong>Loading States:</strong> During submission and data fetching
          </li>
        </ul>

        <h4>Expected API Response Format:</h4>
        <pre
          style={{
            background: '#f3f4f6',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            overflow: 'auto',
          }}
        >
          {`{
  "questions": [
    "What is the primary objective?",
    "Who are the target users?",
    "What are the requirements?"
  ]
}`}
        </pre>

        <h4>Submission Format:</h4>
        <pre
          style={{
            background: '#f3f4f6',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            overflow: 'auto',
          }}
        >
          {`{
  "responses": [
    {
      "question": "What is the primary objective?",
      "answer": "User's response"
    }
  ]
}`}
        </pre>
      </div>

      {isVisible && clarificationData && (
        <RequirementClarificationAgent
          data={clarificationData}
          onSubmit={submitClarification}
          onClose={hideClarificationAgent}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default ClarificationAgentIntegrationExample
