import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'

export const AboutPage = () => {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Header title="About Us" />
      </main>
    </>
  )
}
