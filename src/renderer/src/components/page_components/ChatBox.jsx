import './style/ChatBox.css'
import { useState } from 'react'
import { EmailComposeBox } from './EmailComposeBox'
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
  const [buttonsDisabled, setButtonsDisabled] = useState(false) // For disabling send button

  //
  //
  // For Input Box
  const handleChange = (event) => {
    setUserInput(event.target.value) // Update state on change
  }
  // Handles key down events to allow message submission with Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent default Enter behavior
      if (!event.shiftKey && userInput.trim()) {
        submit(userInput)
      } else if (event.shiftKey) {
        setUserInput((prevInput) => prevInput + '\n')
      }
    }
  }

  //
  //
  // Actions after clicking send button or pressing Enter
  const submit = (text) => {
    // Disable send button
    setButtonsDisabled(true)
    // Removing welcome box
    if (welcomeBox !== null) {
      setWelcomeBox(null)
    }
    // Update messages to include user response immediately
    setMessages((prevMessages) => [...prevMessages, showHumanMessage(text)])
    // For AI response
    fetchAIResponse(text)
    // Clearing input box
    setUserInput('')
    // Enable send button
    setButtonsDisabled(false)
  }

  const fetchAIResponse = async (userInput) => {
    let aiMessage
    // Send user input to main process for AI processing
    window.electron.ipcRenderer.send('client-request', ['use-input', userInput])

    // Listen for a single response from the main process
    window.electron.ipcRenderer.once('server-response', (event, response) => {
      // Check if the response is an email
      if (response[0] === 'email') {
        const aiText = 'Here is your email, check it out:'
        const subject = response[1]
        const body = response[2]
        // Display email message
        aiMessage = showEmailMessage(aiText, subject, body)
      } else {
        // Display standard AI message
        aiMessage = showAiMessage(response[1])
      }
      // Update the state to include the new AI message
      setMessages((prevMessages) => [...prevMessages, aiMessage])
    })
  }

  const showHumanMessage = (text, index) => (
    <>
      {/* Message row container */}
      <div className="msg-row" key={`human-${index}`}>
        {/* Avatar of the user */}
        <div className="msg-avatar">
          <img src={userIcon} alt="User Avatar" />
        </div>
        {/* Content of the message including name and text */}
        <div className="msg-content">
          {/* Displaying 'You' as the name for the user */}
          <div className="msg-name">You</div>
          {/* The actual message text */}
          <div className="msg-text human-msg">{text}</div>
        </div>
      </div>
    </>
  )

  const showAiMessage = (response, index) => (
    <>
      {/* Message row container */}
      <div className="msg-row" key={`ai-${index}`}>
        {/* Avatar for the AI */}
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
        {/* Content of the message */}
        <div className="msg-content">
          {/* AI name label */}
          <div className="msg-name">PINAC</div>
          {/* Message text */}
          <div className="msg-text ai-msg">{response}</div>
        </div>
      </div>
    </>
  )

  const showEmailMessage = (response, subject, body, index) => (
    <>
      {/* Message row container */}
      <div className="msg-row" key={`email-${index}`}>
        {/* Avatar for the AI */}
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
        {/* Content of the message */}
        <div className="msg-content">
          {/* AI name label */}
          <div className="msg-name">PINAC</div>
          {/* Message text */}
          <div className="msg-text ai-msg">{response}</div>
        </div>
      </div>
      {/* Email compose box with subject and body pre-filled */}
      <EmailComposeBox emailSubject={subject} emailBody={body} />
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
            className={buttonsDisabled ? 'disabled' : ''}
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tell me your task..."
            disabled={buttonsDisabled}
          />
          <div className="input-group-append">
            <button
              id="submit-btn"
              className={buttonsDisabled ? 'disabled' : ''}
              onClick={() => (userInput !== '' ? submit(userInput) : {})}
              disabled={buttonsDisabled}
            >
              <img src={sendIcon} alt="Submit" className="submit-icon changeable-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
