import './style/Sidebar.css'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import userIcon from '../../assets/icon/user_icon.png'
import chevronRightIcon from '../../assets/icon/chevron_right.svg'
import homeIcon from '../../assets/icon/home.svg'
import groupIcon from '../../assets/icon/group.svg'
import settingsIcon from '../../assets/icon/settings.svg'
import themeIcon from '../../assets/icon/dark_mode.svg'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const changePage = (path) => {
    navigate(path)
  }

  const toggleSidebar = () => {
    setIsActive(!isActive)
  }

  // Functions to change the Theme
  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    localStorage.setItem('preferred-theme', isDarkTheme ? 'light' : 'dark')
  }

  useEffect(() => {
    const preferredTheme = localStorage.getItem('preferred-theme')
    setIsDarkTheme(preferredTheme === 'dark')
  }, [])

  useEffect(() => {
    const body = document.body
    const preferredThemePair = localStorage.getItem('preferred-theme-pair')
    // Remove all theme classes first
    body.classList.remove(
      'Dawn_n_Dusk-light',
      'Dawn_n_Dusk-dark',
      'Cyber_Tech_01-light',
      'Cyber_Tech_01-dark'
    )
    if (isDarkTheme) {
      body.classList.add(`${preferredThemePair}-dark`) // Add 'dark-theme' class if isDarkTheme is true
    } else {
      body.classList.add(`${preferredThemePair}-light`) // Add 'light-theme' class if isDarkTheme is false
    }
  }, [isDarkTheme])

  return (
    <div className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="upper-part">
        <div className="top">
          <div className="profile" onClick={() => changePage('/profile')}>
            <img id="user-image" src={userIcon} alt="User Image" />
            <span id="user-name" className="sidebar-text">
              User Name
            </span>
          </div>
          <img
            id="sidebar-btn"
            className="non-changeable-icon"
            src={chevronRightIcon}
            alt="Sidebar Toggle"
            onClick={toggleSidebar}
          />
        </div>
        <div className="border-line"></div>
        <nav>
          <ul>
            <li
              title="Homepage"
              id="go-home"
              className={location.pathname === '/' ? 'present-page' : 'li'}
              onClick={() => changePage('/')}
            >
              <img
                className="non-changeable-icon"
                src={homeIcon}
                alt="Home"
                style={
                  location.pathname === '/'
                    ? isDarkTheme
                      ? { filter: 'invert(100%)' }
                      : { filter: 'none' }
                    : {}
                }
              />
              <span
                className="sidebar-text"
                style={
                  location.pathname === '/'
                    ? isDarkTheme
                      ? {}
                      : { color: 'var(--text2-color)' }
                    : {}
                }
              >
                Home
              </span>
            </li>
            <li
              title="About Us"
              id="go-about"
              className={location.pathname === '/about' ? 'present-page' : 'li'}
              onClick={() => changePage('/about')}
            >
              <img
                className="non-changeable-icon"
                src={groupIcon}
                alt="About Us"
                style={
                  location.pathname === '/about'
                    ? isDarkTheme
                      ? { filter: 'invert(100%)' }
                      : { filter: 'none' }
                    : {}
                }
              />
              <span
                className="sidebar-text"
                style={
                  location.pathname === '/about'
                    ? isDarkTheme
                      ? {}
                      : { color: 'var(--text2-color)' }
                    : {}
                }
              >
                About Us
              </span>
            </li>
            <li
              title="Settings"
              id="go-settings"
              className={location.pathname === '/settings' ? 'present-page' : 'li'}
              onClick={() => changePage('/settings')}
            >
              <img
                className="non-changeable-icon"
                src={settingsIcon}
                alt="Settings"
                style={
                  location.pathname === '/settings'
                    ? isDarkTheme
                      ? { filter: 'invert(100%)' }
                      : { filter: 'none' }
                    : {}
                }
              />
              <span
                className="sidebar-text"
                style={
                  location.pathname === '/settings'
                    ? isDarkTheme
                      ? {}
                      : { color: 'var(--text2-color)' }
                    : {}
                }
              >
                Settings
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="lower-part">
        <div className="theme-toggle-container" title="Change Theme">
          <img
            src={themeIcon}
            alt="Theme Icon"
            className="theme-toggle-icon non-changeable-icon sidebar-text"
          />
          <span className="theme-toggle-text sidebar-text">Theme</span>
          <div className="theme-toggle">
            <input
              type="checkbox"
              id="theme-switch"
              className="theme-switch"
              checked={isDarkTheme}
              onChange={changeTheme}
            />
            <label htmlFor="theme-switch" className="toggle-label">
              <span className="toggle-ball"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
