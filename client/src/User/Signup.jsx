import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {

    const naviage=useNavigate()

    const [form,setForm]=useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        avatar: null
    })

    const handleChange=(e)=>{
      const { name, value } = e.target;
      setForm(prevState => ({
      ...prevState,
      [name]: value
      }));
    }

    const handleSubmit=(e)=>{
        axios.post("http://localhost:8080/u/register",form)
        .then((response)=>{
            if(response.data.success){
                toast.success("Registered successfully.Please login.")
                setForm( ()=>({
                  username: "",
                  firstname: "",
                  lastname: "",
                  email: "",
                  password: "",
                  avatar: null
                }) )
            }
            else{
              throw Error(response.data.message)
            }
        })
        .catch( (err)=> toast.error(`Error: ${err.message}`))
    }

  return (
    <>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-300">Create Your Account</h1>
          <form className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" >
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="username" 
                type="text" 
                placeholder="Username"
                required
                value={form.username}
                onChange={handleChange}
                name="username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="firstname">
                First Name
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="firstname" 
                type="text" 
                placeholder="First Name"
                required
                value={form.firstname}
                onChange={handleChange}
                name="firstname"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="lastname">
                Last Name
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="lastname" 
                type="text" 
                placeholder="Last Name"
                required
                value={form.lastname}
                onChange={handleChange}
                name="lastname"
              />
            </div>
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
                value={form.email}
                onChange={handleChange}
                name="email"
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
                value={form.password}
                onChange={handleChange}
                name="password"
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="profile-picture">
                Profile Picture
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="profile-picture" 
                type="file" 
                accept="image/*"
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="font-semibold text-slate-200 bg-slate-900 hover:bg-slate-950 hover:text-slate-200 rounded-lg transition hover:cursor-pointer py-2 px-4 focus:outline-none focus:shadow-outline" 
                type="button"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-slate-300 hover:text-slate-400" href="#">
                Already have an account?
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

export default Signup