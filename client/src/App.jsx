import React, { useEffect, useState } from 'react'
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
import { Bounce, toast, ToastContainer } from 'react-toastify'
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
import UnprotectedRoute from './UnprotectedRoute'
import CommunityCalendar from './Community/CommunityCalendar'
import UpdateProfile from './User/UpdateProfile'
import ViewProfile from './User/ViewProfile'
import ClassroomMain from './Community/CommunityClassroom/ClassroomMain'
import ClassroomHome from './Community/CommunityClassroom/ClassroomHome'
import CourseCreationForm from './Course/CourseCreationForm'
import CoursePage from './Course/CoursePage'

function App() {

  let [loggedIn,setLoggedIn]=useState(false)

  let {user,setUser}=useUserStore()

  useEffect(()=>{
    axios.get("http://localhost:8080/u",{withCredentials: true})
    .then((response)=>{
      if(response.data.success){
        setUser({username:response.data.data.username,email:response.data.data.email,avatar_url:response.data.data?.avatar_url})
      }
      else{
        throw Error(response.data.data.message)
      }
    })
    .catch(({response})=>{
      console.log(response.data.message)
      toast.error(response?.data?.message)
    })
  },[])

  return (
    <div className='bg-slate-900 h-full' >
      <Navbar />

      {/* Routes  */}
      <Routes>
        <Route path='/' element={<UnprotectedRoute> <Home /> </UnprotectedRoute>} />
        <Route path='your_communities' element={<ProtectedRoute> <YourCommunities /> </ProtectedRoute>} />
        <Route path='community' element={<UnprotectedRoute> <SearchCommunity /> </UnprotectedRoute>} />
        <Route path='create_community' element={<ProtectedRoute> <CommunityCreationForm /> </ProtectedRoute>} />
        <Route path='update_profile' element={<ProtectedRoute> <UpdateProfile /> </ProtectedRoute>} />
        <Route path='view_profile' element={<ProtectedRoute> <ViewProfile /> </ProtectedRoute>} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='c/:comm_name' element={<CommunityMain /> }>
          <Route path='' element={<ProtectedRoute> <CommunityHome /> </ProtectedRoute>} />
          <Route path='members' element={<ProtectedRoute> <CommunityMembers /> </ProtectedRoute>} />
          <Route path='about' element={<UnprotectedRoute> <CommunityAbout /> </UnprotectedRoute>} />
          <Route path='events' element={<ProtectedRoute> <CommunityCalendar /> </ProtectedRoute>} />
          <Route path='classroom' element={<ProtectedRoute> <ClassroomMain /> </ProtectedRoute>}>
            <Route path='' element={<ProtectedRoute> <ClassroomHome /> </ProtectedRoute>} />
            <Route path='create_course' element={<ProtectedRoute> <CourseCreationForm /> </ProtectedRoute>} />
            <Route path=':course_id' element={<ProtectedRoute> <CoursePage /> </ProtectedRoute>} />
          </Route>
        </Route>
        <Route path='/c/:comm_name/settings' element={<ProtectedRoute> <CommunitySettingsMain /> </ProtectedRoute>}>
          <Route path='' element={<CommunitySettingsDetails />} />
          <Route path='members' element={<CommunitySettingsMembers />} />
          <Route path='requests' element={<CommunitySettingsRequests />} />
        </Route>
      </Routes>

      <Footer/>

      <ToastContainer
      position="bottom-right"
      autoClose={1500}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      />

    </div>
  )
}

export default App