import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsAndConditions from './components/TermsAndConditions'
import Contact from './components/Contact'
import Sidebar from './components/Sidebar'
import Layout from './components/Layout'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Search:', query)
    // TODO: Implement search logic
  }

  const handleFilterOpen = () => {
    setIsFilterOpen(true)
  }

  return (
    <BrowserRouter>
      <Sidebar />
      <Layout onSearch={handleSearch} onFilterOpen={handleFilterOpen}>
        <Routes>
          <Route path="/" element={<HomePage onSearch={handleSearch} onFilterOpen={handleFilterOpen} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
