import axios from 'axios';
import React, { useState } from 'react'
import { useUserStore } from '../store';
import { useLocation, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

  let navigate=useNavigate()
  let path=useLocation().state?.path || "/"
  let user=useUserStore(state=>state.user)
  if(user?.username){
    navigate(path)
  }

  let [form,setForm]=useState({
    email:"",
    password: ""
  })

  const handleChange=(e)=>{
    const { name, value } = e.target;
    setForm(prevState => ({
    ...prevState,
    [name]: value
    }));
  }

  const handleSubmit=(e)=>{
    axios.post("http://localhost:8080/u/login",form,{withCredentials: true})
    .then( (response)=>{
      if(response.data.success){
        const {username,email}=response.data.data
        setUser( {username,email} )
        navigate(path,{replace: true})
      }
      else{
        throw Error(response.data.data.message)
      }
    } )
    .catch((err)=>toast.error(err.response.data.message))
  }

  return (
    <>
        <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-300">Log In to Your Account</h1>
          <form className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="email" 
                type="email" 
                placeholder="Email"
                required
                name='email'
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                id="password" 
                type="password" 
                placeholder="******************"
                required
                name='password'
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={handleSubmit}
                className="font-semibold text-slate-200 bg-slate-900 hover:bg-slate-950 hover:text-slate-200 rounded-lg transition hover:cursor-pointer py-2 px-4 focus:outline-none focus:shadow-outline" 
                type="button"
              >
                Log In
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-slate-300 hover:text-slate-400" href="#">
                Need an account?
              </a>
            </div>
          </form>
        </div>
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      </main>
    </>
  )
}

export default Login