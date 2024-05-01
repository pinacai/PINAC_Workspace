// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import addPdfIcon from '../img/add-pdf-light.png'
import sendIcon from '../img/send-light.png'

export const InputBox = () => {
  const [userQuery, setUserQuery] = useState('') // Declare state for input value

  const handleChange = (event) => {
    setUserQuery(event.target.value) // Update state on change
  }

  const submit = () => {
    window.electron.ipcRenderer.send('user-query', userQuery)
  }

  return (
    <>
      <div className="input-box">
        <div className="input-group">
          <input
            type="text"
            id="user-input"
            value={userQuery}
            onChange={handleChange}
            placeholder="Tell me your task..."
          />
          <div className="input-group-append">
            <label htmlFor="pdf-upload" className="pdf-upload-label">
              <img src={addPdfIcon} alt="Upload PDF" className="pdf-icon" />
            </label>
            <input type="file" id="pdf-upload" accept=".pdf" style={{ display: 'none' }} />
            <button id="submit-btn" onClick={submit}>
              <img src={sendIcon} alt="Submit" className="submit-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
