import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './style/Header.css'

// Icons
import addLogo from '../assets/icon/add_circle.svg'
import downArrow from '../assets/icon/arrow_down.svg'
import upArrow from '../assets/icon/arrow_up.svg'

type HeaderProps = {
  title: string;
  clearChat?: () => void;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isDropdownActive, setIsDropdownActive] = useState(false)

  //
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setIsMenuVisible(true)
      } else {
        setIsMenuVisible(false)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Function to handle page navigation
  const changePage = (path: string) => {
    navigate(path)
  }

  // adds border line below the page title
  // except HomePage
  const borderLine = () => {
    return (
      <>
        <div className="bottom-line"></div>
      </>
    )
  }

  // adds new-chat button only
  // for HomePage
  const newChatBtn = () => {
    return (
      <>
        <button className="newChatButton" onClick={props.clearChat}>
          <img src={addLogo} className="non-changeable-icon" />
          <span>New Chat</span>
        </button>
      </>
    )
  }

  //
  const openMenu = () => {
    setIsDropdownActive(!isDropdownActive)
  }

  return (
    <>
      <div className="pageHeader">
        <div className="left-side">
          <div>
            <span className={location.pathname == '/' ? 'home-title' : 'title'}>{props.title}</span>
            {location.pathname !== '/' ? borderLine() : null}
          </div>
          {/* Render the sidebar button */}
          {isMenuVisible && (
            <div className="header-menu">
              <div>
                <button
                  className={location.pathname == '/' ? 'home' : ''}
                  onClick={() => openMenu()}
                >
                  <img
                    src={isDropdownActive ? upArrow : downArrow}
                    alt="Menu"
                    className="changeable-icon"
                  />
                </button>
              </div>
              <div className={`dropdown-menu ${isDropdownActive ? 'active' : ''}`}>
                <ul>
                  {location.pathname !== '/' && <li onClick={() => changePage('/')}>Home</li>}
                  {location.pathname !== '/profile' && (
                    <li onClick={() => changePage('/profile')}>Profile</li>
                  )}
                  {location.pathname !== '/about' && (
                    <li onClick={() => changePage('/about')}>About Us</li>
                  )}
                  {location.pathname !== '/settings' && (
                    <li onClick={() => changePage('/settings')}>Settings</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="right-side">{location.pathname == '/' ? newChatBtn() : null}</div>
      </div>
    </>
  )
}
