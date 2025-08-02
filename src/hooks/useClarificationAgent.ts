import { useState, useCallback } from 'react'
import {
  ClarificationData,
  ClarificationSubmission,
} from '../types/clarification'

interface UseClarificationAgentProps {
  onSubmit?: (data: ClarificationSubmission) => Promise<void>
}

interface UseClarificationAgentReturn {
  isVisible: boolean
  isSubmitting: boolean
  clarificationData: ClarificationData | null
  error: string | null
  showClarificationAgent: (data: ClarificationData) => void
  hideClarificationAgent: () => void
  submitClarification: (submission: ClarificationSubmission) => Promise<void>
}

export const useClarificationAgent = (
  props?: UseClarificationAgentProps
): UseClarificationAgentReturn => {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clarificationData, setClarificationData] =
    useState<ClarificationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const showClarificationAgent = useCallback((data: ClarificationData) => {
    setClarificationData(data)
    setIsVisible(true)
    setError(null)
  }, [])

  const hideClarificationAgent = useCallback(() => {
    if (!isSubmitting) {
      setIsVisible(false)
      setClarificationData(null)
      setError(null)
    }
  }, [isSubmitting])

  const submitClarification = useCallback(
    async (submission: ClarificationSubmission) => {
      setIsSubmitting(true)
      setError(null)

      try {
        if (props?.onSubmit) {
          await props.onSubmit(submission)
        }

        // Hide the modal on successful submission
        setIsVisible(false)
        setClarificationData(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to submit clarification'
        setError(errorMessage)
        console.error('Error submitting clarification:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [props]
  )

  return {
    isVisible,
    isSubmitting,
    clarificationData,
    error,
    showClarificationAgent,
    hideClarificationAgent,
    submitClarification,
  }
}
