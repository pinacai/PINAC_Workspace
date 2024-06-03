import './App.css'
import { useEffect } from 'react'
import { HomePage } from './components/pages/HomePage'
import { ProfilePage } from './components/pages/ProfilePage'
import { AboutPage } from './components/pages/AboutPage'
import { SettingsPage } from './components/pages/SettingsPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  // Updates the body's classList with the selected
  // theme pair and the user's preferred light/dark mode
  useEffect(() => {
    const body = document.body
    const preferredTheme = localStorage.getItem('preferred-theme')
    const preferredThemePair = localStorage.getItem('preferred-theme-pair')

    if (preferredTheme && preferredThemePair) {
      // Remove all theme classes first
      body.classList.remove(
        'Dawn_n_Dusk-light',
        'Dawn_n_Dusk-dark',
        'Cyber_Tech_01-light',
        'Cyber_Tech_01-dark'
      )
      // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
      body.classList.add(`${preferredThemePair}-${preferredTheme}`)
    } else {
      body.classList.add('Cyber_Tech_01-light')
      localStorage.setItem('preferred-theme-pair', 'Cyber_Tech_01')
      localStorage.setItem('preferred-theme', 'light')
    }
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  )
}

export default App
