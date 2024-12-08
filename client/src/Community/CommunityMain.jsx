import React, { useEffect } from 'react'
import CommunityNavbar from "./CommunityNavbar"
import { Outlet, useNavigate, useParams } from 'react-router'
import axios from 'axios'

function CommunityMain() {

  let navigate=useNavigate()
  const {comm_name}=useParams()

  useEffect(()=>{

    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success && data.data?.membership!=2){
        navigate(`/c/${comm_name}/about`,{replace:true})
      }
    } )
    
  },[])

  return (
  <>
    <CommunityNavbar />
    <Outlet />
  </>
  )
}

export default CommunityMain