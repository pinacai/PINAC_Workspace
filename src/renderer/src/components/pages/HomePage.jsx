import './style/HomePage.css'
import { useState, useEffect } from 'react'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'
import { MarkdownStyle } from '../page_components/MarkdownStyle'
import { EmailComposeBox } from '../page_components/EmailComposeBox'

// Icons
import sendIcon from '../../assets/icon/send.svg'
import userIcon from '../../assets/icon/user_icon.png'
import pinacLogo from '../../assets/icon/pinac-logo.png'

export const HomePage = () => {
  //
  // State for welcome message
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
  // Handles changes in user input
  const handleChange = (event) => {
    setUserInput(event.target.value)
  }

  // Handles Enter key press for submitting messages
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

  // Actions after clicking send button or pressing Enter
  const submit = (text) => {
    setButtonsDisabled(true)
    if (welcomeBox !== null) {
      setWelcomeBox(null)
    }
    setMessages((prevMessages) => [...prevMessages, showHumanMessage(text)])
    fetchAIResponse(text)
    setUserInput('')
    setButtonsDisabled(false)
  }

  const fetchAIResponse = async (userInput) => {
    let aiMessage
    // Sends user input to main.js (main.js to server(python)) for AI processing
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
      <div className="msg-row" key={`human-${index}`}>
        <div className="msg-avatar">
          <img src={userIcon} alt="User Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">
            <MarkdownStyle text={text} />
          </div>
        </div>
      </div>
    </>
  )

  const showAiMessage = (response, index) => (
    <>
      <div className="msg-row" key={`ai-${index}`}>
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">
            <MarkdownStyle text={response} />
          </div>
        </div>
      </div>
    </>
  )

  const showEmailMessage = (response, subject, body, index) => (
    <>
      <div className="msg-row" key={`email-${index}`}>
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">{response}</div>
        </div>
      </div>
      <EmailComposeBox emailSubject={subject} emailBody={body} />
    </>
  )

  // For smooth applying of current theme
  useEffect(() => {
    const body = document.body
    const preferredTheme = localStorage.getItem('preferred-theme')
    const preferredThemePair = localStorage.getItem('preferred-theme-pair')
    // Remove all theme classes first
    body.classList.remove(
      'Dawn_n_Dusk-light',
      'Dawn_n_Dusk-dark',
      'Cyber_Tech_01-light',
      'Cyber_Tech_01-dark'
    )
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`)
  })

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="PINAC" />
        <div className="chat-container">
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
        </div>
      </div>
    </>
  )
}
