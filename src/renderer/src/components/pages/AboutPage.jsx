import { Sidebar } from '../page_components/Sidebar'
import { Header } from '../page_components/Header'

export const AboutPage = () => {
  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="About Us" />
      </div>
    </>
  )
}
