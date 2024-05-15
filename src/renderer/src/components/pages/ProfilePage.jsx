import { useEffect } from 'react'
import './style/ProfilePage.css'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'
import profileImage from '../../assets/icon/user_icon.png'

export const ProfilePage = () => {
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
        <Header title="Profile" />

        <div className="profile-container">
          <div className="profile-img">
            <img src={profileImage} alt="Profile image" />
          </div>
          <div className="user-details">
            <div className="sec">
              <span>Name</span>
              <input type="text" id="full-name" placeholder="Your full name" />
            </div>
            <div className="sec">
              <span>Gmail</span>
              <input type="email" id="gmail-id" placeholder="Your Gmail Id" />
            </div>
            <div className="sec">
              <span>Bio</span>
              <textarea id="bio" placeholder="Tell us about yourself"></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
