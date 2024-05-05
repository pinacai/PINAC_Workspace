import './style/EmailComposerBox.css'
import { useState } from 'react'
// import attachIcon from './img/attach-icon-dark.png'

export const EmailComposerBox = () => {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  // const [body, setBody] = useState('')

  const handleSendEmail = () => {
    // Validate form data
    const errors = {}
    if (!recipient) {
      errors.recipient = 'Recipient email is required'
    }
    if (!subject) {
      errors.subject = 'Subject is required'
    }

    // If no errors, send the email
    if (Object.keys(errors).length === 0) {
      // Call sendEmail function with form data
    }
  }

  const handleGoBack = () => {
    // Reset form data
    setRecipient('')
    setSubject('')
    setBody('')
    setErrors({})
  }

  const handleCreateDraft = () => {
    // Save draft with form data
  }

  return (
    <>
      <div className="compose-box">
        <div className="to">
          <label htmlFor="to">To:</label>
          <input type="email" id="to" placeholder="Recipient Email" />
        </div>
        <div className="subject">
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" placeholder="Enter Subject" />
        </div>
        <div className="body">
          <textarea id="body" placeholder="Compose your email here..."></textarea>
        </div>
        <div className="extra-buttons">
          <input type="file" id="attachment" hidden />
          <label htmlFor="attachment" id="attachment-label">
            <img id="attach-icon" src="img/attach-icon-dark.png" alt="attachment" />
          </label>
        </div>
        <div className="actions">
          <button id="goBack-button" onClick={() => handleGoBack()}>
            Cancel
          </button>
          <button id="send-button" onClick={() => handleSendEmail()}>
            Send
          </button>
          <button id="save-draft-button" onClick={() => handleCreateDraft()}>
            Save Draft
          </button>
        </div>
      </div>
    </>
  )
}
