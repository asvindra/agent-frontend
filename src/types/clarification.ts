export interface ClarificationQuestion {
  id: string
  question: string
}

export interface ClarificationResponse {
  question: string
  answer: string
}

export interface ClarificationData {
  questions: string[]
}

export interface ClarificationSubmission {
  responses: ClarificationResponse[]
}

export interface RequirementClarificationAgentProps {
  data: ClarificationData
  onSubmit: (submission: ClarificationSubmission) => void
  onClose?: () => void
  isSubmitting?: boolean
}
