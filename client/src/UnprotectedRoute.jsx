
import React, { useEffect, useState } from 'react'
import { useUserStore } from './store'
import { Navigate, useLocation } from 'react-router'
import axios from 'axios'

function UnprotectedRoute({children}) {
    return <>{children}</>
}

export default UnprotectedRoute
