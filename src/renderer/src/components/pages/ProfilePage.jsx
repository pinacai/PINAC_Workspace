import './style/ProfilePage.css'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'
import profileImage from '../../assets/icon/user_icon.png'

export const ProfilePage = () => {
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
