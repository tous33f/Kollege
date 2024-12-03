import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

function CommunityNavbar() {

  const active="px-3 py-4 text-white border-b-2 border-slate-300"
  const notActive="px-3 py-4 text-slate-300 hover:text-white"
  const {comm_name}=useParams()
  let [display,setDisplay]=useState(false)
  useEffect(()=>{
    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success && data?.data?.membership==2){
        setDisplay(true)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch( ({response})=>{
      toast.error(response?.data?.message)
    } )
  })

  return (
    <>
      {display && <nav className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <NavLink to="" end  className={({ isActive }) => (isActive ? active : notActive)} >Community</NavLink>
            <NavLink to="classroom"  className={({ isActive }) => (isActive ? active : notActive)} >Classroom</NavLink>
            <NavLink to="events"  className={({ isActive }) => (isActive ? active : notActive)} >Calendar</NavLink>
            <NavLink to="members"  className={({ isActive }) => (isActive ? active : notActive)} >Members</NavLink>
            <NavLink to="about" className={({ isActive }) => (isActive ? active : notActive)} >About</NavLink>
          </div>
        </div>
      </nav> }
    </>
  )
}

export default CommunityNavbar
