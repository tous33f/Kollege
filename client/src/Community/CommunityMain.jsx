import React from 'react'
import CommunityNavbar from "./CommunityNavbar"
import { Outlet } from 'react-router'
import CommunitySidebar from './CommunitySidebar'

function CommunityMain() {

  return (
    <>
    <CommunityNavbar />
    <div className="min-h-screen bg-slate-900 text-slate-100">
    <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Outlet />
    <CommunitySidebar />
      </div>
    </div>
  </div>
  </>
  )
}

export default CommunityMain