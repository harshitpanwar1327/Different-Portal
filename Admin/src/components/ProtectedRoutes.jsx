import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'

const ProtectedRoutes = () => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return isAuthenticated==="true" ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoutes