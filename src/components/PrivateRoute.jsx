import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import React from 'react'

const PrivateRoute = () => {
  const {user, token, isAuthLoaded} = useAuth()

  // console.log('🔍 PrivateRoute State:', {isAuthLoaded, token, user})

  if (!isAuthLoaded) {
    // console.log('⏳ Waiting for auth to load...')
    return (
      <div className="loader__container fixed top-0 left-0 flex items-center justify-center w-full h-full">
        {/*<div className="loader"></div>*/}
      </div>
    )
  }

  // console.log('🔎 PrivateRoute final check:', {isAuthLoaded, token, user})

  return user && token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
