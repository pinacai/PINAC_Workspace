import './style/HomePage.css'
import { Sidebar } from '../page_components/Sidebar'
import { ChatBox } from '../page_components/ChatBox'
import addLogo from '../../assets/icon/add_circle.svg'

export const HomePage = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <header className="header">
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
