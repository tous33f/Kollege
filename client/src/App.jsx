import React, { useEffect } from 'react'
import Navbar from './Navbar/Navbar'
import Home from './Pages/Home'
import Footer from './Footer/Footer'
import CommunityHome from './Community/CommunityHome'
import CommunityCreationForm from './Community/CommunityCreationForm'
import CommunityMain from "./Community/CommunityMain"
import { Route, Routes } from 'react-router'
import Signup from './User/Signup'
import Login from './User/Login'
import CommunityAbout from './Community/CommunityAbout'
import 'react-toastify/dist/ReactToastify.css';
import SearchCommunity from './Pages/SearchCommunity'
import YourCommunities from './Pages/YourCommunities'
import ProtectedRoute from './ProtectedRoute'
import axios from 'axios'
import { useUserStore } from './store'
import CommunityMembers from './Community/CommunityMembers'
import CommunitySettingsMain from './Community/CommunitySettings/CommunitySettingsMain'
import CommunitySettingsDetails from './Community/CommunitySettings/CommunitySettingsDetails'
import CommunitySettingsMembers from './Community/CommunitySettings/CommunitySettingsMembers'
import CommunitySettingsRequests from './Community/CommunitySettings/CommunitySettingsRequests'


function App() {

  let {user,setUser}=useUserStore()

  useEffect(()=>{
    axios.get("http://localhost:8080/u",{withCredentials: true})
    .then((response)=>{
      if(response.data.success){
        setUser({username:response.data.data.username,email:response.data.data.email})
      }
      else{
        throw Error(response.data.data.message)
      }
    })
    .catch((err)=>console.log(err.response.data.message))
  },[])

  return (
    <div className='bg-slate-900 h-full' >
      <Navbar />

      {/* Routes  */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='your_communities' element={<ProtectedRoute> <YourCommunities /> </ProtectedRoute>} />
        <Route path='community' element={<SearchCommunity />} />
        <Route path='create_community' element={<ProtectedRoute> <CommunityCreationForm /> </ProtectedRoute>} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='c/:comm_name' element={<CommunityMain /> }>
          <Route path='' element={<ProtectedRoute> <CommunityHome /> </ProtectedRoute>} />
          <Route path='members' element={<ProtectedRoute> <CommunityMembers /> </ProtectedRoute>} />
          <Route path='about' element={<CommunityAbout />} />
        </Route>
        <Route path='c/:comm_name/settings' element={<ProtectedRoute> <CommunitySettingsMain /> </ProtectedRoute>}>
          <Route path='' element={<CommunitySettingsDetails />} />
          <Route path='members' element={<CommunitySettingsMembers />} />
          <Route path='requests' element={<CommunitySettingsRequests />} />
        </Route>
      </Routes>

      <Footer/>
    </div>
  )
}

export default App