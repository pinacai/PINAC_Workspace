import { useState } from 'react'
import PropTypes from 'prop-types'
// import attachIcon from '../../assets/icon/attachment.svg'
import './style/EmailComposeBox.css'

export const EmailComposeBox = (props) => {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState(props.emailSubject)
  const [body, setBody] = useState(props.emailBody)
  // const [attachment, setAttachment] = useState(null)
  const [buttonsDisabled, setButtonsDisabled] = useState(false) // For disabling buttons

  EmailComposeBox.propTypes = {
    emailSubject: PropTypes.string.isRequired, // Required string
    emailBody: PropTypes.string.isRequired // Required string
  }

  const handleGoBack = () => {
    setButtonsDisabled(true)
    console.log(null)
  }

  const handleSendEmail = () => {
    setButtonsDisabled(true)
    window.electron.ipcRenderer.send('client-request', ['send-email', to, subject, body])
    console.log('Email sended')
  }

  const handleCreateDraft = () => {
    setButtonsDisabled(true)
    if (to != '') {
      window.electron.ipcRenderer.send('client-request', [
        'create-draft-with-RE',
        to,
        subject,
        body
      ])
    } else {
      window.electron.ipcRenderer.send('client-request', ['create-draft', subject, body])
    }
    console.log('Created Draft')
  }

  return (
    <div className="compose-box">
      <div className="to">
        <label htmlFor="to">To:</label>
        <input
          type="email"
          id="to"
          placeholder="Recipient Email"
          value={to}
          onChange={(e) => {
            setTo(e.target.value)
          }}
        />
      </div>
      <div className="subject">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value)
            localStorage.setItem('subject', e.target.value)
          }}
        />
      </div>
      <div className="body">
        <textarea
          id="body"
          placeholder="Compose your email here..."
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            localStorage.setItem('body', e.target.value)
          }}
        />
      </div>
      {/* <div className="extra-buttons">
        <input type="file" id="attachment" hidden />
        <label htmlFor="attachment" id="attachment-label">
          <img id="attach-icon" alt="attachment" />
        </label>
      </div> */}
      <div className="actions">
        <button
          id="goBack-button"
          className={buttonsDisabled ? 'disabled' : ''}
          onClick={handleGoBack}
          disabled={buttonsDisabled}
        >
          Cancel
        </button>
        <button
          id="send-button"
          className={buttonsDisabled ? 'disabled' : ''}
          onClick={handleSendEmail}
          disabled={buttonsDisabled}
        >
          Send
        </button>
        <button
          id="save-draft-button"
          className={buttonsDisabled ? 'disabled' : ''}
          onClick={handleCreateDraft}
          disabled={buttonsDisabled}
        >
          Save Draft
        </button>
      </div>
    </div>
  )
}
