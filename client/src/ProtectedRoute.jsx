
import React, { useEffect, useState } from 'react'
import { useUserStore } from './store'
import { Navigate, useLocation } from 'react-router'

function ProtectedRoute({children}) {

    let user=useUserStore(state=>state.user);
    const location=useLocation()
    
    return (
        user.username ? <>{children}</> : <Navigate to="/login" state={{path: location.pathname}} replace /> 
    )
}

export default ProtectedRoute
