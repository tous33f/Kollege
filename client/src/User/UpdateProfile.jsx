import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useUserStore } from '../store';

export default function UpdateProfile() {

  let setUser=useUserStore(state=>state.setUser)
  let user=useUserStore(state=>state.user)
  let [curUser,setCurUser]=useState({})
  let [firstname,setFirstname]=useState("")
  let [lastname,setLastname]=useState("")
  let [password,setPassword]=useState("")
  let [avatar,setAvatar]=useState(null)
  let [clear,setClear]=useState(true)
  let navigate=useNavigate()

  const handleSubmit=async ()=>{

    if(firstname.trim() && firstname!=curUser?.firstname){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/firstname`,{firstname},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
                setCurUser(prev=>{
                  return {...prev,firstname}
                })
                toast.success("Firstname updated successfully")
            }
        }
            catch( {response} ){
            console.log(response?.data?.message)
            toast.error(response?.data?.message)
        }
    }
    else{
      setFirstname(curUser?.firstname)
    }
    if(lastname.trim() && lastname!=curUser?.lastname){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/lastname`,{lastname},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
              setCurUser(prev=>{
                return {...prev,lastname}
              })
                toast.success("Lastname updated successfully")
            }
        }
            catch( {response} ){
            console.log(response?.data?.message)
            toast.error(response?.data?.message)
        }
    }
    else{
      setLastname(curUser?.lastname)
    }
    if(password.trim()){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/password`,{password},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
                setPassword("")
                toast.success("Password updated successfully")
            }
        }
        catch( {response} ){
          setPassword("")
          console.log(response?.data?.message)
          toast.error(response?.data?.message)
        }
    }
    if(avatar){
      try{
        const form=new FormData()
        form.append("avatar",avatar)
          const {data}=await axios.patch(`http://localhost:8080/u/avatar_url`,form,{withCredentials: true})
          if(!data.success){
            throw new Error(data.message)
          }
          else{
              setAvatar(null)
              setClear(prev=>!prev)
              let newUser=user;
              setUser({...newUser,avatar_url:data?.data?.avatar_url})
              toast.success("User profile updated successfully")
          }
      }
      catch( {response} ){
        setPassword("")
        console.log(response?.data?.message)
        toast.error(response?.data?.message)
      }
  }
    
  }

  useEffect( ()=>{
    axios.get(` http://localhost:8080/u `,{withCredentials:true})
    .then( ({data})=>{
        setCurUser(data?.data)
        setFirstname(data?.data?.firstname)
        setLastname(data?.data?.lastname)
    } )
    .catch( ({response})=>{
        console.log(response?.data?.message)
        toast.error(response?.data?.message)
        navigate(-1)
    } )
  }, [] )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Update your profile</h1>
        <div  className="space-y-6 bg-slate-800 p-8 rounded-lg shadow-lg">

        <div>
            <label  className="block text-sm font-medium text-slate-300 mb-2">
              Enter a new firstname
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e)=>setFirstname(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>

        <div>
            <label  className="block text-sm font-medium text-slate-300 mb-2">
              Enter a new lastname
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e)=>setLastname(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>

        <div>
            <label  className="block text-sm font-medium text-slate-300 mb-2">
              Enter a new password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>

          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-300 mb-2">
              Upload a new user profile image
            </label>
            <div className="mt-1 flex items-center">
                <input key={clear}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="avatar" 
                type="file" 
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                />
                { avatar && <svg onClick={()=>{
                  setClear(prev=>!prev)
                  setAvatar(null)
                }} className='ml-3 cursor-pointer' fill="#4b5563" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "></polygon> </g></svg>
                }
                <button onClick={()=>{
                  //removing community banner
                  axios.delete(`http://localhost:8080/u/avatar_url`,{withCredentials: true})
                  .then( ({data})=>{
                    if(data?.success){
                      let newUser=user;
                      setUser({...newUser,avatar_url:""})
                      toast.success("Profile avatar removed successfully")
                    }
                    else{
                      throw new Error(data?.message)
                    }
                  } )
                  .catch(({response})=>{
                    console.log(response?.data?.message)
                    toast.error(response?.data?.message)
                  })

                }} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4">
                Remove Avatar
                </button>
            </div>
          </div>

          <div>
            <button onClick={handleSubmit}
              className="w-full px-4 py-2 bg-slate-900 text-slate-300 rounded-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Update profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}