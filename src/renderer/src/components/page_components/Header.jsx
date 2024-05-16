import PropTypes from 'prop-types'
import './style/Header.css'

// Icons
import addLogo from '../../assets/icon/add_circle.svg'

export const Header = (props) => {
  // Title prop is a required string
  Header.propTypes = {
    title: PropTypes.string.isRequired
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
        <button id="new-chat-btn">
          <img className="non-changeable-icon" src={addLogo} alt="" style={{ height: '32px' }} />
          <span id="new-chat-text">New Chat</span> {/* New chat btn text */}
        </button>
      </>
    )
  }

  return (
    <>
      <div className="pageHeader">
        <div className="left-side">
          <span className={location.pathname == '/' ? 'home-title' : 'title'}>{props.title}</span>
          {location.pathname !== '/' ? borderLine() : null}
        </div>
        <div className="right-side">{location.pathname == '/' ? newChatBtn() : null}</div>
      </div>
    </>
  )
}
