import './style/HomePage.css'
import { useEffect } from 'react'
import { Sidebar } from '../page_components/Sidebar'
import { ChatBox } from '../page_components/ChatBox'
import addLogo from '../../assets/icon/add_circle.svg'

export const HomePage = () => {
  //
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
      <main className="container">
        <header className="homeHeader">
          <div className="left-side">
            <h1 id="title">PINAC</h1>
          </div>
          <div className="right-side">
            <button id="new-chat-btn">
              <img
                className="non-changeable-icon"
                src={addLogo}
                alt=""
                style={{ height: '32px' }}
              />
              <span id="new-chat-text">New Chat</span>
            </button>
          </div>
        </header>
        <div className="chat-container">
          <ChatBox />
        </div>
      </main>
    </>
  )
}
