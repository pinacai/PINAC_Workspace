import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './style/DropdownMenu.css'

// Icon
import downArrow from '../../assets/icon/arrow_down.svg'
import upArrow from '../../assets/icon/arrow_up.svg'

export const DropdownMenu = (props) => {
  const [selectedOption, setSelectedOption] = useState('ChatGPT-3.5 turbo')
  const [isActive, setIsActive] = useState(false)

  const openMenu = () => {
    setIsActive(!isActive)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsActive(false)
    // Saving choice
    localStorage.setItem('preferred-model', option)
  }

  // At starting
  // Selecting model based on local storage
  useEffect(() => {
    const preferredModel = localStorage.getItem('preferred-model')
    preferredModel !== null && setSelectedOption(preferredModel)
  }, [])

  return (
    <div className="dropdown">
      <div className="selector">
        <span>{selectedOption}</span>
        <button onClick={openMenu}>
          <img src={isActive ? upArrow : downArrow} className="changeable-icon" />
        </button>
      </div>
      <div className={`dropdown-menu ${isActive ? 'active' : ''}`}>
        <ul>
          {props.optionList.map((option, index) => (
            <li
              key={index}
              className={selectedOption == option ? 'selected' : ''}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

DropdownMenu.propTypes = {
  optionList: PropTypes.array.isRequired
}
