import { HomePage } from './components/pages/HomePage'
import { ProfilePage } from './components/pages/ProfilePage'
import { AboutPage } from './components/pages/AboutPage'
import { SettingsPage } from './components/pages/SettingsPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<SettingsPage />} />
      </Routes>
    </Router>
  )
}

export default App
