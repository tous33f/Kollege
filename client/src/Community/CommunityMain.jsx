import React from 'react'
import CommunityNavbar from "./CommunityNavbar"
import { Outlet } from 'react-router'

function CommunityMain() {

  return (
  <>
    <CommunityNavbar />
    <Outlet />
  </>
  )
}

export default CommunityMain