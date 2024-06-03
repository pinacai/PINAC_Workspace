import './style/SettingsPage.css'
import { useState } from 'react'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'
import { DropdownMenu } from '../page_components/DropdownMenu'

// Icons
import Cyber_Tech_o1_darkPreview from '../../assets/img/Cyber_Tech_01_darkPreview.png'
import Dawn_n_Dusk_darkPreview from '../../assets/img/Dawn_n_Dusk_darkPreview.png'

export const SettingsPage = () => {
  const [Dawn_n_Dusk, setDawn_n_Dusk] = useState(false)
  const [Cyber_Tech_01, setCyber_Tech_01] = useState(true) // default theme is Cyber_Tech_01

  const card = (title, cardImage, checkedFunc, onChangeFunc) => {
    return (
      <div className="themeCard">
        <img src={cardImage} alt="Cyber Tech 01 Preview" />
        <div className="themeCard-desc">
          <label className="check-wrapper">
            <input type="checkbox" checked={checkedFunc} onChange={onChangeFunc} />
            <div className="checkmark"></div>
          </label>
          <span>{title}</span>
        </div>
      </div>
    )
  }

  // Function to select the Dawn_n_Dusk theme
  const changeToDawn_n_Dusk = () => {
    setDawn_n_Dusk(!Dawn_n_Dusk)
    if (!Dawn_n_Dusk) {
      setCyber_Tech_01(false)
      localStorage.setItem('preferred-theme-pair', 'Dawn_n_Dusk')
    }
  }

  // Function to select the Cyber_Tech_01 theme
  const changeToCyber_Tech_01 = () => {
    setCyber_Tech_01(!Cyber_Tech_01)
    if (!Cyber_Tech_01) {
      setDawn_n_Dusk(false)
      localStorage.setItem('preferred-theme-pair', 'Cyber_Tech_01')
    }
  }

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="Settings" />
        <div className="setting-container">
          {/* ------------------- */}
          {/* Section 1 ( Theme ) */}
          <div className="section">
            <div className="section-title">
              <span>AI Model</span>
            </div>
            <DropdownMenu
              optionList={[
                'ChatGPT-3.5 turbo',
                'Gemini 1.5 Pro',
                'Gemini 1.0 Pro',
                'Gemini Flash 1.5'
              ]}
            />
          </div>

          {/* Section 2 ( Theme ) */}
          <div className="section">
            <div className="section-title">
              <span>Theme</span>
            </div>
            <div className="themeCard-container">
              {/* Theme 1 */}
              {card('Dawn & Dusk', Dawn_n_Dusk_darkPreview, Dawn_n_Dusk, changeToDawn_n_Dusk)}

              {/* Theme 2 */}
              {card(
                'Cyber Tech 01',
                Cyber_Tech_o1_darkPreview,
                Cyber_Tech_01,
                changeToCyber_Tech_01
              )}

              {/* Theme 3 */}
              <div className="themeCard">
                {/* Adding temporary style for this card */}
                <div
                  className="themeCard-desc"
                  style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <span>Coming soon...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
