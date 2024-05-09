import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'

export const ProfilePage = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Header title="Profile" />
      </main>
    </>
  )
}
