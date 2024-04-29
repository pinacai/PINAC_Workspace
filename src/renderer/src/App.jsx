import './css/App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MsgBox } from './components/MsgBox'
import { InputBox } from './components/InputBox'

const App = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Header />
        <div className="chat-container">
          <MsgBox />
          <InputBox />
        </div>
      </main>
    </>
  )
}

export default App
