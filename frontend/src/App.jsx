import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from './components/pages/SignUpPage'
import LoginPage from './components/pages/LoginPage'
import SettingsPage from './components/pages/SettingsPage'
import ProfilePage from './components/pages/ProfilePage'
import HomePage from './components/pages/HomePage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()

  //using theme
  const { theme } = useThemeStore()
  console.log("online: ", onlineUsers)

  useEffect(() => { checkAuth() }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>

      <Navbar />
      <Routes>

        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/signup" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

      </Routes>



      <Toaster
        position="top-center"
        reverseOrder={true} />
    </div>
  )
}

export default App
