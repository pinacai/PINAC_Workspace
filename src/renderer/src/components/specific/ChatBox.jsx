import './style/ChatBox.css'
import { useState } from 'react'
// import { EmailComposeBox } from '../common/EmailComposeBox'
import addPdfIcon from '../../assets/icon/add_pdf.svg'
import sendIcon from '../../assets/icon/send.svg'
import userIcon from '../../assets/icon/user_icon.png'
import pinacLogo from '../../assets/icon/pinac-logo.png'

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
  const [messages, setMessages] = useState([]) // For showing AI response
  const [userInput, setUserInput] = useState('') // Declare state for input value

  //
  //
  // For Input Box
  const handleChange = (event) => {
    setUserInput(event.target.value) // Update state on change
  }
  // Adding enter key to submit
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'Enter') {
      setUserInput(userInput + '\n')
    } else if (event.key === 'Enter') {
      userInput !== '' ? submit(userInput) : {}
    }
  }

  //
  //
  // Actions after clicking send button or pressing Enter
  const submit = (text) => {
    // Removing welcome box
    if (welcomeBox !== null) {
      setWelcomeBox(null)
    }

    // Update messages to include user response immediately
    setMessages((prevMessages) => [...prevMessages, getHumanMessage(text)])

    // For AI response
    fetchAIResponse(text)

    // Clearing input box
    setUserInput('')
  }

  const fetchAIResponse = async (userInput) => {
    window.electron.ipcRenderer.send('user-input', userInput)
    window.electron.ipcRenderer.once('ai-response', (event, response) => {
      const aiMessage = getAiMessage(response[1])
      setMessages((prevMessages) => [...prevMessages, aiMessage])
    })
  }

  // Helper functions to create message objects
  const getHumanMessage = (text, index) => (
    <>
      <div className="msg-row" key={`human-${index}`}>
        <div className="msg-avatar">
          <img src={userIcon} alt="User Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">{text}</div>
        </div>
      </div>
    </>
  )

  const getAiMessage = (response, index) => (
    <>
      <div className="msg-row" key={`ai-${index}`}>
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">{response}</div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="msg-box">
        {welcomeBox}
        {messages}
      </div>

      <div className="input-box">
        <div className="input-group">
          <input
            id="user-input"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tell me your task..."
          />
          <div className="input-group-append">
            <label htmlFor="pdf-upload" className="pdf-upload-label">
              <img src={addPdfIcon} alt="Upload PDF" className="pdf-icon changeable-icon" />
            </label>
            <input type="file" id="pdf-upload" accept=".pdf" style={{ display: 'none' }} />
            <button id="submit-btn" onClick={() => (userInput !== '' ? submit(userInput) : {})}>
              <img src={sendIcon} alt="Submit" className="submit-icon changeable-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
