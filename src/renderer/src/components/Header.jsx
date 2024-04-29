// eslint-disable-next-line no-unused-vars
import React from 'react'
import addLogo from '../img/add-light.png'

export const Header = () => {
  return (
    <>
      <header className="header">
        <div className="left-side">
          <h1 id="title">PINAC</h1>
        </div>
        <div className="right-side">
          <button id="new-chat-btn">
            <img id="new-chat-icon" src={addLogo} alt="" />
            <span id="new-chat-text">New Chat</span>
          </button>
        </div>
      </header>
    </>
  )
}
