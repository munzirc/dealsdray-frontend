import React, { useContext} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const ProtectedRoutes = () => {
  
  const {authUser} = useContext(UserContext)


  return (
    
    authUser ? <Outlet /> : <Navigate to='/' />
  )
}

export default ProtectedRoutes