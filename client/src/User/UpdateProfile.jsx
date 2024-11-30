import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast,ToastContainer,Bounce } from 'react-toastify';

export default function UpdateProfile() {


  let [user,setUser]=useState({})
  let [firstname,setFirstname]=useState("")
  let [lastname,setLastname]=useState("")
  let [password,setPassword]=useState("")
  let navigate=useNavigate()

  const handleSubmit=async ()=>{

    if(firstname.trim() && firstname!=user?.firstname){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/firstname`,{firstname},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
                setFirstname("")
            }
        }
            catch( {response} ){
            console.log(response?.data?.message)
            toast.error(response?.data?.message)
        }
    }
    if(lastname.trim() && lastname!=user?.lastname){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/lastname`,{lastname},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
                setLastname("")
            }
        }
            catch( {response} ){
            console.log(response?.data?.message)
            toast.error(response?.data?.message)
        }
    }
    if(password.trim() && password!=user?.password){
        try{
            const {data}=await axios.patch(`http://localhost:8080/u/password`,{password},{withCredentials: true})
            if(!data.success){
                throw new Error(data.message)
            }
            else{
                setPassword("")
            }
        }
            catch( {response} ){
            console.log(response?.data?.message)
            toast.error(response?.data?.message)
        }
    }

    toast.success("Profile updated successfully")

  }

  useEffect( ()=>{
    axios.get(` http://localhost:8080/u `,{withCredentials:true})
    .then( ({data})=>{
        setUser(data?.data)
    } )
    .catch( ({response})=>{
        console.log(response?.data?.message)
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
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              className="hidden"
              onChange={() => console.log('File selected')}
            />
            <div className="mt-1 flex items-center">
                <input 
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="profile-picture" 
                type="file" 
                accept="image/*"
                />
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
  );
}