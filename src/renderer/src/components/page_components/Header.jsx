import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './style/Header.css'

// Icons
import addLogo from '../../assets/icon/add_circle.svg'
import menuLogo from '../../assets/icon/menu.svg'

export const Header = (props) => {
  const [isSidebarToggleVisible, setIsSidebarToggleVisible] = useState(false)

  //
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setIsSidebarToggleVisible(false)
      } else {
        setIsSidebarToggleVisible(true)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
          {/* Render the sidebar button */}
          {window.innerWidth < 576 && (
            <div>
              <button onClick={() => setIsSidebarToggleVisible(!isSidebarToggleVisible)}>
                <img src={menuLogo} alt="Menu" className="changeable-icon" />
              </button>
            </div>
          )}
          <div>
            <span className={location.pathname == '/' ? 'home-title' : 'title'}>{props.title}</span>
            {location.pathname !== '/' ? borderLine() : null}
          </div>
        </div>
        <div className="right-side">{location.pathname == '/' ? newChatBtn() : null}</div>
      </div>
    </>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired
}
