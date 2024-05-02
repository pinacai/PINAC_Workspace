import { Sidebar } from '../common/Sidebar'
import { Header } from '../common/Header'
import { ChatBox } from '../specific/ChatBox'

export const HomePage = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Header />
        <div className="chat-container">
          <ChatBox />
        </div>
      </main>
    </>
  )
}
