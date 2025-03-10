import React, {useEffect} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import {ModalProvider} from './context/ModalContext.jsx'
import {useAuth} from './context/AuthContext.jsx'

import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword.jsx'
import NotFound from './pages/NotFound.jsx'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import Investments from './pages/Dashboard/Investments.jsx'
import Documents from './pages/Dashboard/Documents.jsx'
import GuideForClient from './pages/Dashboard/GuideForClient.jsx'
import Profile from './pages/Dashboard/Profile.jsx'

function App() {
  const {token, logout} = useAuth()

  useEffect(() => {
    const handleClick = e => {
      if (e.defaultPrevented || e.button !== 0) return

      const target = e.target.closest('a')
      if (target && target.href) {
        e.preventDefault()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <ModalProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={<Navigate to="/dashboard/investments" replace />}
            />
            <Route path="investments" element={<Investments />} />
            <Route path="documents" element={<Documents />} />
            {/*<Route path="guide" element={<GuideForClient />} />*/}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard/investments" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <Navigate to="/dashboard/investments" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            token ? (
              <NotFound />
            ) : (
              (() => {
                logout()
                return <Navigate to="/login" replace />
              })()
            )
          }
        />
      </Routes>
    </ModalProvider>
  )
}

export default App
