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
        <button className="newChatButton">
          <img src={addLogo} className="non-changeable-icon" />
          <span>New Chat</span>
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
