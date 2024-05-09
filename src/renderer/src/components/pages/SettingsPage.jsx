import './style/SettingsPage.css'
import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'

export const SettingsPage = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Header title="Settings" />
        <div className="setting-container">
          <div className="section">
            <div className="section-title">
              <span>Choose Your Theme</span>
            </div>
            <div className="themeCard-container">
              <div className="card">
                <img src="image.jpg" alt="Card Image" />
                <div className="card-content">
                  {/* <input type="checkbox" name="" id="" /> */}
                  <span>Dawn & Dusk</span>
                </div>
              </div>
              <div className="card">
                <img src="image.jpg" alt="Card Image" />
                <div className="card-content">
                  <span>Cyber Tech 01</span>
                </div>
              </div>
              <div className="card">
                <img src="image.jpg" alt="Card Image" />
                <div className="card-content">
                  <span>Boundless</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
