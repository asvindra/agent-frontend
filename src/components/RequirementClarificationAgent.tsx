import React, { useState } from 'react'
import {
  RequirementClarificationAgentProps,
  ClarificationResponse,
} from '../types/clarification'
import './RequirementClarificationAgent.css'

const QUESTIONS_PER_PAGE = 5

const RequirementClarificationAgent: React.FC<
  RequirementClarificationAgentProps
> = ({ data, onSubmit, onClose, isSubmitting = false }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [showSummary, setShowSummary] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const { questions } = data
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  const startIndex = currentPage * QUESTIONS_PER_PAGE
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length)
  const currentQuestions = questions.slice(startIndex, endIndex)

  // Check if all questions are answered (for display purposes)
  const allAnswered = questions.every((_, index) => responses[index]?.trim())

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleShowSummary = () => {
    setShowSummary(true)
  }

  const handleBackToQuestions = () => {
    setShowSummary(false)
    setEditingIndex(null)
  }

  const handleEditAnswer = (index: number) => {
    setEditingIndex(index)
    setShowSummary(false)
    // Navigate to the page containing this question
    const targetPage = Math.floor(index / QUESTIONS_PER_PAGE)
    setCurrentPage(targetPage)
  }

  const handleSubmit = () => {
    const clarificationResponses: ClarificationResponse[] = questions.map(
      (question, index) => ({
        question,
        answer: responses[index] || '',
      })
    )

    onSubmit({ responses: clarificationResponses })
  }

  if (showSummary) {
    return (
      <div className="clarification-modal-overlay">
        <div className="clarification-modal">
          <div className="clarification-header">
            <h2>Requirement Clarification Agent</h2>
            {onClose && (
              <button
                className="close-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>

          <div className="clarification-content">
            <div className="summary-container">
              <div className="summary-header">
                <h3>Summary</h3>
                <button
                  className="back-button"
                  onClick={handleBackToQuestions}
                  disabled={isSubmitting}
                >
                  ← Back to Questions
                </button>
              </div>

              <div className="summary-list">
                {questions.map((question, index) => (
                  <div
                    key={`summary-q-${index}-${question.slice(0, 20)}`}
                    className="summary-item"
                  >
                    <div className="summary-question">
                      <strong>Question {index + 1}:</strong> {question}
                    </div>
                    <div className="summary-answer-container">
                      <div className="summary-answer">
                        {responses[index] || 'No answer provided'}
                      </div>
                      <button
                        className="edit-answer-button"
                        onClick={() => handleEditAnswer(index)}
                        disabled={isSubmitting}
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-actions">
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="clarification-modal-overlay">
      <div className="clarification-modal">
        <div className="clarification-header">
          <h2>Requirement Clarification Agent</h2>
          {onClose && (
            <button
              className="close-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ×
            </button>
          )}
        </div>

        <div className="clarification-content">
          <div className="questions-container">
            <div className="question-progress">
              <span>
                Question {startIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="questions-list">
              {currentQuestions.map((question, localIndex) => {
                const globalIndex = startIndex + localIndex
                const isHighlighted = editingIndex === globalIndex

                return (
                  <div
                    key={globalIndex}
                    className={`question-item ${
                      isHighlighted ? 'highlighted' : ''
                    }`}
                  >
                    <div className="question-text">{question}</div>
                    <div className="answer-input-container">
                      <textarea
                        value={responses[globalIndex] || ''}
                        onChange={(e) =>
                          handleAnswerChange(globalIndex, e.target.value)
                        }
                        placeholder="Your Answer"
                        rows={3}
                        className="answer-input"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={handlePrevious}
                disabled={currentPage === 0 || isSubmitting}
              >
                ← Previous
              </button>

              <span className="page-indicator">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages - 1 || isSubmitting}
              >
                Next →
              </button>
            </div>

            <div className="bottom-actions">
              <button
                className="summary-button"
                onClick={handleShowSummary}
                disabled={isSubmitting}
              >
                View Summary
              </button>
            </div>
          </div>

          <div className="summary-sidebar">
            <div className="sidebar-header">
              <h3>Summary</h3>
            </div>

            <div className="sidebar-content">
              {questions.map((question, index) => (
                <div
                  key={`sidebar-q-${index}-${question.slice(0, 20)}`}
                  className="sidebar-item"
                >
                  <div className="sidebar-question">
                    <strong>Q{index + 1}:</strong>{' '}
                    {question.length > 60
                      ? `${question.substring(0, 60)}...`
                      : question}
                  </div>
                  <div className="sidebar-answer">
                    <div className="answer-label">
                      <strong>Answer:</strong>
                    </div>
                    <div className="answer-content">
                      {(() => {
                        if (!responses[index]) return 'Not answered yet'
                        const response = responses[index]
                        return response.length > 80
                          ? `${response.substring(0, 80)}...`
                          : response
                      })()}
                    </div>
                  </div>
                  {responses[index] && (
                    <button
                      className="sidebar-edit-button"
                      onClick={() => handleEditAnswer(index)}
                      disabled={isSubmitting}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequirementClarificationAgent
