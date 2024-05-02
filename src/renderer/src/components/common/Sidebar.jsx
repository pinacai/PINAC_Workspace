// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import userIcon from '../../assets/img/user_icon.png'
import chevronRightIcon from '../../assets/img/chevron-right-light.png'
import homeIcon from '../../assets/img/home-light.png'
import groupIcon from '../../assets/img/group-light.png'
import settingsIcon from '../../assets/img/settings-light.png'
import themeIcon from '../../assets/img/theme-light.png'

export const Sidebar = () => {
  const [isActive, setIsActive] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const toggleSidebar = () => {
    setIsActive(!isActive)
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
    // Perform your desired action here
    // For example, you can redirect to a different page
    // window.location.href = 'profile.html';
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
    document.body.classList.toggle('light-theme', !isDarkTheme)
  }, [isDarkTheme])

  return (
    <div className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="upper-part">
        <div className="top">
          <div className="profile" onClick={handleProfileClick}>
            <img id="user-image" src={userIcon} alt="User Image" />
            <span id="user-name" className="sidebar-text">
              User Name
            </span>
          </div>
          <img
            id="sidebar-btn"
            className="icon"
            src={chevronRightIcon}
            alt="Sidebar Toggle"
            onClick={toggleSidebar}
          />
        </div>
        <div className="border-line"></div>
        <nav>
          <ul>
            <li title="Homepage" id="go-home">
              <img className="icon" src={homeIcon} alt="Home" />
              <span className="sidebar-text">Home</span>
            </li>
            <li title="About Us" id="go-about">
              <img className="icon" src={groupIcon} alt="About Us" />
              <span className="sidebar-text">About Us</span>
            </li>
            <li title="Settings" id="go-settings">
              <img className="icon" src={settingsIcon} alt="Settings" />
              <span className="sidebar-text">Settings</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="lower-part">
        <div className="theme-toggle-container" title="Change Theme">
          <img src={themeIcon} alt="Theme Icon" className="theme-toggle-icon sidebar-text" />
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
