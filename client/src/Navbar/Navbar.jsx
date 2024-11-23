import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {

  let user=useUserStore(state=>state.user)
  let setUser=useUserStore(state=>state.setUser)

  const handleLogout=(e)=>{
    axios.post("http://localhost:8080/u/logout",{},{withCredentials: true})
    .then((response)=>{
      toast.success("Logged out successfully")
      setUser({username:"",email:""})
    })
    .catch((err)=>toast.error(err.response.data.message))
  }

  return (
    <div className='flex justify-between bg-slate-950 h-12 items-center py-10 px-16'>
        <div className=' font-bold text-4xl'> <Link to="/">
          <span className='text-orange-400'>k</span>
          <span className='text-red-800'>o</span>
          <span className='text-yellow-500'>l</span>
          <span className='text-blue-300'>l</span>
          <span className='text-red-800'>e</span>
          <span className='text-fuchsia-500'>g</span>
          <span className='text-yellow-500'>e</span> </Link>
        </div>
        <ul className='flex text-slate-200 text-base items-center'>
            <li className='hover:bg-slate-800 px-3 py-2 rounded-md hover:cursor-pointer transition'><Link to="/">Home</Link></li>
            <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/community'>Community</Link></li>
            <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' >Events</li>
            <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' >Resources</li>
            {(!user.username || !user.email)?(
              <>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to="/login" >Sign in</Link></li>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to='/signup'>Join now <span >&#128521;</span> </Link></li>
              </>
            )
            :(
              <>
              <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/your_communities'>Your communities</Link></li>
              <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-800  px-4 py-2 rounded-full' onClick={handleLogout} >{user.username[0].toUpperCase()}</div>
              </>
            )}
        </ul>
        
    </div>
  )
}

export default Navbar