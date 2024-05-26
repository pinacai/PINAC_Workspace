import { useState } from 'react'
import PropTypes from 'prop-types'
import './style/DropdownMenu.css'

// Icon
import downArrow from '../../assets/icon/arrow_down.svg'
import upArrow from '../../assets/icon/arrow_up.svg'

export const DropdownMenu = (props) => {
  const [isActive, setIsActive] = useState(false)

  const openMenu = () => {
    setIsActive(!isActive)
  }

  DropdownMenu.propTypes = {
    optionList: PropTypes.array.isRequired
  }

  const showEachOption = () => {
    return props.optionList.map((option, index) => <li key={index}>{option}</li>)
  }

  return (
    <div className="dropdown">
      <div className="selector">
        <span>Dropdown</span>
        <button onClick={openMenu}>
          <img src={isActive ? upArrow : downArrow} className="changeable-icon" />
        </button>
      </div>
      <div className={`dropdown-menu ${isActive ? 'active' : ''}`}>
        <ul>{showEachOption()}</ul>
      </div>
    </div>
  )
}
