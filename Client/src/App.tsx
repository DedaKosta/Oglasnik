import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import HomePage from './features/home/components/HomePage'
import SignIn from './features/auth/components/SignIn'
import SignUp from './features/auth/components/SignUp'
import ForgotPassword from './features/auth/components/ForgotPassword'
import ResetPassword from './features/auth/components/ResetPassword'
import ProfilePage from './features/profile/components/ProfilePage'
import PrivacyPolicy from './features/legal/components/PrivacyPolicy'
import TermsAndConditions from './features/legal/components/TermsAndConditions'
import Contact from './features/legal/components/Contact'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
