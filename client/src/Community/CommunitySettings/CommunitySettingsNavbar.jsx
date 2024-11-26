import React from 'react'
import {  NavLink } from 'react-router-dom'

function CommunitySettingsNavbar() {

    const active="px-3 py-4 text-white border-b-2 border-slate-300"
    const notActive="px-3 py-4 text-slate-300 hover:text-white"

  return (
    <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <NavLink to="" end className={({ isActive }) => (isActive ? active : notActive)}>
              Community Details
            </NavLink>
            <NavLink to="members" className={({ isActive }) => (isActive ? active : notActive)} >
              Manage Members
            </NavLink>
            <NavLink to="requests" className={({ isActive }) => (isActive ? active : notActive)}>
              Join Requests
            </NavLink>
          </div>
        </div>
  )
}

export default CommunitySettingsNavbar