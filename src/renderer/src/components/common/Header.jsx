import './style/Header.css'
import { useLocation } from 'react-router-dom'
import addLogo from '../../assets/icon/add_circle.svg'

export const Header = () => {
  const location = useLocation()

  return (
    <>
      <header className="header">
        <div className="left-side">
          <h1 id="title">PINAC</h1>
        </div>
        <div className="right-side">
          {location.pathname === '/' ? (
            <button id="new-chat-btn">
              <img
                className="non-changeable-icon"
                src={addLogo}
                alt=""
                style={{ height: '32px' }}
              />
              <span id="new-chat-text">New Chat</span>
            </button>
          ) : (
            ''
          )}
        </div>
      </header>
    </>
  )
}
