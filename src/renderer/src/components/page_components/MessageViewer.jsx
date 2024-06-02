import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MarkdownStyle } from '../page_components/MarkdownStyle'
import { EmailComposeBox } from '../page_components/EmailComposeBox'
import { ScheduleViewer } from '../page_components/ScheduleViewer'
import './style/MessageViewer.css'

// Icons
import userIcon from '../../assets/icon/user_icon.png'
import pinacLogo from '../../assets/icon/pinac-logo.png'

export const HumanMessage = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(window.innerWidth > 576) // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576)
    }
    window.addEventListener('resize', updateAvatarVisibility)
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', updateAvatarVisibility)
  }, [])

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={userIcon} alt="User Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">{props.response}</div>
        </div>
      </div>
    </>
  )
}

export const AiMessage = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(window.innerWidth > 576) // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576)
    }
    window.addEventListener('resize', updateAvatarVisibility)
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', updateAvatarVisibility)
  }, [])

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">
            <MarkdownStyle text={props.response} />
          </div>
        </div>
      </div>
    </>
  )
}

export const EmailMessage = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(window.innerWidth > 576) // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576)
    }
    window.addEventListener('resize', updateAvatarVisibility)
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', updateAvatarVisibility)
  }, [])

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">{props.response}</div>
        </div>
      </div>
      <EmailComposeBox emailSubject={props.subject} emailBody={props.body} />
    </>
  )
}

export const ScheduleMessage = (props) => {
  return (
    <>
      <ScheduleViewer events={props.schedule} />
    </>
  )
}

HumanMessage.propTypes = {
  response: PropTypes.string.isRequired
}

AiMessage.propTypes = {
  response: PropTypes.string.isRequired
}

EmailMessage.propTypes = {
  response: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
}

ScheduleMessage.propTypes = {
  // response: PropTypes.string.isRequired,
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  )
}
