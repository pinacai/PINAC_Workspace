import PropTypes from 'prop-types'
import './style/Header.css'

export const Header = (props) => {
  Header.propTypes = {
    title: PropTypes.string.isRequired // Required string
  }

  return (
    <>
      <div className="header">
        <div className="titleText">
          <span>{props.title}</span>
          <div className="bottom-line"></div>
        </div>
      </div>
    </>
  )
}
