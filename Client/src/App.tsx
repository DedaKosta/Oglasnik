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
import AddListing from './components/AddListing'
import Messages from './components/Messages'
import AccountSettings from './components/AccountSettings'
import Layout from './components/Layout'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Search:', query)
    // TODO: Implement search logic
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onSearch={handleSearch}><HomePage /></Layout>} />
        <Route path="/signin" element={<Layout onSearch={handleSearch}><SignIn /></Layout>} />
        <Route path="/signup" element={<Layout onSearch={handleSearch}><SignUp /></Layout>} />
        <Route path="/forgot-password" element={<Layout onSearch={handleSearch}><ForgotPassword /></Layout>} />
        <Route path="/reset-password" element={<Layout onSearch={handleSearch}><ResetPassword /></Layout>} />
        <Route path="/privacy" element={<Layout onSearch={handleSearch}><PrivacyPolicy /></Layout>} />
        <Route path="/terms" element={<Layout onSearch={handleSearch}><TermsAndConditions /></Layout>} />
        <Route path="/contact" element={<Layout onSearch={handleSearch}><Contact /></Layout>} />
        <Route path="/add-listing" element={<Layout onSearch={handleSearch}><AddListing /></Layout>} />
        <Route path="/messages" element={<Layout onSearch={handleSearch}><Messages /></Layout>} />
        <Route path="/settings" element={<Layout onSearch={handleSearch}><AccountSettings /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
