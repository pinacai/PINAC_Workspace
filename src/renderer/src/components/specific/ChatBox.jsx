// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import addPdfIcon from '../../assets/img/add-pdf-light.png'
import sendIcon from '../../assets/img/send-light.png'
import userIcon from '../../assets/img/user_icon.png'
import pinacLogo from '../../assets/img/pinac-logo.png'

export const ChatBox = () => {
  const [welcomeBox, setWelcomeBox] = useState(
    <div className="welcome-text-row">
      <div className="welcome-text">
        Hello,
        <br />
        How can I help you today ?
      </div>
    </div>
  )
  const [userResponse, setUserResponse] = useState(null) // For showing user query
  const [aiResponse, setAiResponse] = useState(null) // For showing AI response
  const [userInput, setUserInput] = useState('') // Declare state for input value

  //
  // For Input Box
  const handleChange = (event) => {
    setUserInput(event.target.value) // Update state on change
  }

  //
  //
  // Actions after clicking send button
  const submit = (text) => {
    // Removing welcome box
    if (welcomeBox !== null) {
      setWelcomeBox(null)
    }

    // For user response
    window.electron.ipcRenderer.send('user-input', text)
    setUserResponse(
      <div className="msg-row">
        <div className="msg-avatar">
          <img src={userIcon} alt="User Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">{text}</div>
        </div>
      </div>
    )
    // For AI response
    window.electron.ipcRenderer.on('ai-response', (event, response) => {
      setAiResponse(
        <div className="msg-row">
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
          <div className="msg-content">
            <div className="msg-name">PINAC</div>
            <div className="msg-text ai-msg">{response}</div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className="msg-box">
        {welcomeBox}
        {userResponse}
        {aiResponse}
      </div>

      <div className="input-box">
        <div className="input-group">
          <input
            type="text"
            id="user-input"
            value={userInput}
            onChange={handleChange}
            placeholder="Tell me your task..."
          />
          <div className="input-group-append">
            <label htmlFor="pdf-upload" className="pdf-upload-label">
              <img src={addPdfIcon} alt="Upload PDF" className="pdf-icon" />
            </label>
            <input type="file" id="pdf-upload" accept=".pdf" style={{ display: 'none' }} />
            <button id="submit-btn" onClick={() => submit(userInput)}>
              <img src={sendIcon} alt="Submit" className="submit-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
