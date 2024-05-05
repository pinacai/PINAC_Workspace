import './App.css'
import { HomePage } from './components/pages/HomePage'
// import { EmailComposerBox } from './components/common/EmailComposerBox'
import { ProfilePage } from './components/pages/ProfilePage'
import { AboutPage } from './components/pages/AboutPage'
import { SettingsPage } from './components/pages/SettingsPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
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
