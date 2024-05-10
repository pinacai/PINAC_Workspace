import './style/SettingsPage.css'
import { useState, useEffect } from 'react'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'
import Cyber_Tech_o1_darkPreview from '../../assets/img/Cyber_Tech_01_darkPreview.png'
import Dawn_n_Dusk_darkPreview from '../../assets/img/Dawn_n_Dusk_darkPreview.png'

export const SettingsPage = () => {
  const [Dawn_n_Dusk, setDawn_n_Dusk] = useState(false)
  const [Cyber_Tech_01, setCyber_Tech_01] = useState(true) // default theme is Cyber_Tech_01

  const changeToDawn_n_Dusk = () => {
    setDawn_n_Dusk(!Dawn_n_Dusk)
    if (!Dawn_n_Dusk) {
      setCyber_Tech_01(false)
      localStorage.setItem('preferred-theme-pair', 'Dawn_n_Dusk')
    }
  }

  const changeToCyber_Tech_01 = () => {
    setCyber_Tech_01(!Cyber_Tech_01)
    if (!Cyber_Tech_01) {
      setDawn_n_Dusk(false)
      localStorage.setItem('preferred-theme-pair', 'Cyber_Tech_01')
    }
  }

  useEffect(() => {
    const preferredThemePair = localStorage.getItem('preferred-theme-pair')
    setDawn_n_Dusk(preferredThemePair === 'Dawn_n_Dusk')
    setCyber_Tech_01(preferredThemePair === 'Cyber_Tech_01')
  }, [])

  useEffect(() => {
    const body = document.body
    const preferredTheme = localStorage.getItem('preferred-theme')
    const preferredThemePair = localStorage.getItem('preferred-theme-pair')
    // Remove all theme classes first
    body.classList.remove(
      'Dawn_n_Dusk-light',
      'Dawn_n_Dusk-dark',
      'Cyber_Tech_01-light',
      'Cyber_Tech_01-dark'
    )
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`)
  })

  return (
    <>
      <Sidebar />
      <main className="container">
        <Header title="Settings" />
        <div className="setting-container">
          {/* ------------------- */}
          {/* Section 1 ( Theme ) */}
          <div className="section">
            <div className="section-title">
              <span>Theme</span>
            </div>
            <div className="themeCard-container">
              {/* Theme 1 */}
              <div className="card">
                <img src={Dawn_n_Dusk_darkPreview} alt="Dawn & Dusk Preview" />
                <div className="card-content">
                  <input type="checkbox" checked={Dawn_n_Dusk} onChange={changeToDawn_n_Dusk} />
                  <span>Dawn & Dusk</span>
                </div>
              </div>
              {/* Theme 2 */}
              <div className="card">
                <img src={Cyber_Tech_o1_darkPreview} alt="Cyber Tech 01 Preview" />
                <div className="card-content">
                  <input type="checkbox" checked={Cyber_Tech_01} onChange={changeToCyber_Tech_01} />
                  <span>Cyber Tech 01</span>
                </div>
              </div>
              {/* Theme 3 */}
              <div className="card">
                {/* Adding temporary style for this card */}
                <div
                  className="card-content"
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
      </main>
    </>
  )
}
