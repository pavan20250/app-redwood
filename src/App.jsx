import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import Header from './components/Header'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './components/Dashboard/Dashboard'
import AddStartup from './components/Dashboard/AddStartup'
import AddKeyPerson from './components/Dashboard/AddKeyPerson'
import AddFund from './components/Dashboard/AddFund'

function App() {

  return (
    <Router>
        <AuthProvider>
          <Header/>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/verify" element={<Verify/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/add-startup" element={<AddStartup />} />
              <Route path="/add-key-person" element={<AddKeyPerson />} />
              <Route path="/add-fund" element={<AddFund />} />
              <Route path="/profile" element={<Profile/>}/>

            </Route>
          </Routes>
        </AuthProvider>
    </Router>
  )
}

export default App