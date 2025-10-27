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
import { ToastProvider } from './contexts/ToastContext'
import { LoadingProvider } from './contexts/LoadingContext'
import ToastContainer from './components/ToastContainer'
import GlobalLoadingSpinner from './components/GlobalLoadingSpinner'
import ApiContextInitializer from './components/ApiContextInitializer'

function App() {
  const handleSearch = (query: string) => {
    console.log('Search:', query)
    // TODO: Implement search logic
  }

  return (
    <ToastProvider>
      <LoadingProvider>
        <ApiContextInitializer>
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
      <ToastContainer />
      <GlobalLoadingSpinner />
    </BrowserRouter>
        </ApiContextInitializer>
      </LoadingProvider>
    </ToastProvider>
  )
}

export default App
