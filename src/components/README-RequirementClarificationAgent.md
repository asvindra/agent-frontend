# RequirementClarificationAgent Component

A React component for collecting user responses to a list of questions in a paginated, user-friendly interface.

## Features

- **Paginated Questions**: Displays 5 questions per page for better user experience
- **Persistent Responses**: User answers are preserved when navigating between pages
- **Summary View**: Shows all questions and answers in a comprehensive summary
- **Inline Editing**: Users can edit any answer directly from the summary view
- **Progress Tracking**: Visual indicators show current page and completion status
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Proper loading indicators during submission

## Usage

```tsx
import RequirementClarificationAgent from './components/RequirementClarificationAgent'
import {
  ClarificationData,
  ClarificationSubmission,
} from './types/clarification'

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const data: ClarificationData = {
    questions: [
      'What is the primary objective of the new feature?',
      'Who are the target users for this functionality?',
      'What are the key performance requirements?',
      // ... more questions
    ],
  }

  const handleSubmit = async (submission: ClarificationSubmission) => {
    setIsSubmitting(true)
    try {
      // Send to backend
      await api.submitClarification(submission)
      setShowModal(false)
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Clarification Agent
      </button>

      {showModal && (
        <RequirementClarificationAgent
          data={data}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}
```

## Props

### `RequirementClarificationAgentProps`

| Prop           | Type                                            | Required | Description                              |
| -------------- | ----------------------------------------------- | -------- | ---------------------------------------- |
| `data`         | `ClarificationData`                             | ✅       | The questions data from backend          |
| `onSubmit`     | `(submission: ClarificationSubmission) => void` | ✅       | Callback when user submits all responses |
| `onClose`      | `() => void`                                    | ❌       | Callback when user closes the modal      |
| `isSubmitting` | `boolean`                                       | ❌       | Shows loading state during submission    |

## Data Types

### Input Format (from Backend)

```typescript
interface ClarificationData {
  questions: string[];
}

// Example:
{
  "questions": [
    "What is the primary objective of the new feature?",
    "Who are the target users for this functionality?",
    "What are the key performance requirements?"
  ]
}
```

### Output Format (to Backend)

```typescript
interface ClarificationSubmission {
  responses: ClarificationResponse[];
}

interface ClarificationResponse {
  question: string;
  answer: string;
}

// Example:
{
  "responses": [
    {
      "question": "What is the primary objective of the new feature?",
      "answer": "To improve user onboarding experience"
    },
    {
      "question": "Who are the target users for this functionality?",
      "answer": "New users signing up for the first time"
    }
  ]
}
```

## Component Behavior

### Navigation

- **Next/Previous Buttons**: Navigate between question pages
- **Page Indicator**: Shows current page (e.g., "Page 1 of 3")
- **Question Counter**: Shows current question range (e.g., "Question 1 of 10")

### Response Persistence

- User answers are automatically saved as they type
- Responses persist when navigating between pages
- No data is lost if user goes back to edit previous answers

### Summary View

- Accessible after all questions are answered
- Shows all questions and user responses
- Edit buttons allow direct editing of any answer
- Editing navigates back to the specific question page

### Validation

- Submit button is disabled until all questions are answered
- Loading states prevent multiple submissions
- Non-empty answers are required for all questions

### Responsive Design

- Desktop: Side-by-side layout with questions and summary sidebar
- Mobile: Stacked layout with collapsible summary section

## Styling

The component uses CSS modules with the following main classes:

- `.clarification-modal-overlay`: Modal backdrop
- `.clarification-modal`: Main modal container
- `.questions-container`: Left panel with questions
- `.summary-sidebar`: Right panel with summary preview
- `.summary-container`: Full summary view layout

Colors and spacing follow the existing design system with consistent button styles, input fields, and typography.

## Demo

See `ClarificationAgentDemo.tsx` for a complete working example with sample data and submission handling.
