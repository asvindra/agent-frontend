import React, { useState } from 'react'
import RequirementClarificationAgent from './RequirementClarificationAgent'
import {
  ClarificationData,
  ClarificationSubmission,
} from '../types/clarification'

const ClarificationAgentDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] =
    useState<ClarificationSubmission | null>(null)

  // Sample data matching the expected format
  const sampleData: ClarificationData = {
    questions: [
      'What is the primary objective of the new feature?',
      'Who are the target users for this functionality?',
      'What are the key performance requirements?',
      'Are there any specific design constraints we should consider?',
      'What is the expected timeline for delivery?',
      'Do you have any preference for the technology stack?',
      'What are the main business metrics this feature should impact?',
      'Are there any compliance or security requirements?',
      'How should this feature integrate with existing systems?',
      'What are the success criteria for this project?',
    ],
  }

  const handleSubmit = async (submission: ClarificationSubmission) => {
    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Clarification responses:', submission)
      setSubmissionResult(submission)
      setShowModal(false)
    } catch (error) {
      console.error('Error submitting clarification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setShowModal(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Requirement Clarification Agent Demo</h1>
      <p>
        This demo shows how the RequirementClarificationAgent component works
        with a set of sample questions.
      </p>

      <button
        onClick={() => setShowModal(true)}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Open Clarification Agent
      </button>

      {submissionResult && (
        <div
          style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <h3>Submission Result:</h3>
          <pre
            style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px',
            }}
          >
            {JSON.stringify(submissionResult, null, 2)}
          </pre>
        </div>
      )}

      {showModal && (
        <RequirementClarificationAgent
          data={sampleData}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default ClarificationAgentDemo
