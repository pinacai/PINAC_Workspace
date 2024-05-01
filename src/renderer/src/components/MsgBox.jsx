// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import userIcon from '../img/user_icon.png'
import pinacLogo from '../img/pinac-logo.png'

export const MsgBox = () => {
  const [welcomeText, setWelcomeText] = useState('')
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)

  //
  // Functions for typing animation of Welcome Text

  // Adjust these values to control the animation speed
  const typingDelay = 900 // Delay between each character (in milliseconds)
  const erasingDelay = 900 // Delay between each character erased (in milliseconds)
  const sentenceDelay = 3000 // Delay before starting the next sentence (in milliseconds)

  const sentences = ['Hello,\nHow can I help you today?', 'Stay top of your schedule with Pinac']

  useEffect(() => {
    let animationFrameId

    const typeSentence = (sentence, index) => {
      animationFrameId = requestAnimationFrame(() => {
        if (index <= sentence.length) {
          setWelcomeText(sentence.substring(0, index))
          typeSentence(sentence, index + 1)
        } else {
          setTimeout(() => eraseSentence(sentence), sentenceDelay)
        }
      })
    }

    const eraseSentence = (sentence) => {
      animationFrameId = requestAnimationFrame(() => {
        if (sentence.length > 0) {
          setWelcomeText(sentence.substring(0, sentence.length - 1))
          eraseSentence(sentence.substring(0, sentence.length - 1))
        } else {
          setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length)
        }
      })
    }

    typeSentence(sentences[currentSentenceIndex], 0)

    return () => cancelAnimationFrame(animationFrameId)
  }, [currentSentenceIndex, typingDelay, erasingDelay, sentenceDelay])

  //
  //
  // Functions to show the conversations btw User and PINAC AI
  // window.electron.ipcRenderer.on('user-query', (event, userQuery) => {
  //   console.log(userQuery)
  // })

  // window.electron.ipcRenderer.on('ai-response', (event, response) => {
  //   console.log(response)
  // })

  return (
    <>
      <div className="msg-box">
        {/* Inside the .msg-box */}
        <div className="welcome-text-row">
          <div className="welcome-text" style={{ whiteSpace: 'pre-line' }}>
            {welcomeText}
          </div>
        </div>
        {/* Human Query */}
        <div className="msg-row">
          <div className="msg-avatar">
            <img src={userIcon} alt="User Avatar" />
          </div>
          <div className="msg-content">
            <div className="msg-name">You</div>
            <div className="msg-text human-msg">This is a sample human query.</div>
          </div>
        </div>

        {/* AI Response */}
        <div className="msg-row">
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
          <div className="msg-content">
            <div className="msg-name">PINAC</div>
            <div className="msg-text ai-msg">This is a sample AI answer</div>
          </div>
        </div>
      </div>
    </>
  )
}
