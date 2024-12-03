import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {

  let [error,setError]=useState('')

    let [form,setForm]=useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        avatar: null
    })

    let [clear,setClear]=useState(false)

    const handleChange=(e)=>{
      let { name, value } = e.target;
      if(name=="avatar"){
        value=e.target.files[0]
      }
      setForm(prevState => ({
      ...prevState,
      [name]: value
      }));
    }

    const handleSubmit=(e)=>{

      let newForm=new FormData()

      if(!form.username){
        setError("Please add a username")
        return
      }
      newForm.append("username",form.username)
      if(!form.firstname){
        setError("Please add a firstname")
        return
      }
      newForm.append("firstname",form.firstname)
      if(!form.lastname){
        setError("Please add a lastname")
        return
      }
      newForm.append("lastname",form.lastname)
      if(!form.email){
        setError("Please add an email")
        return
      }
      newForm.append("email",form.email)
      if(!form.password){
        setError("Please add a password")
        return
      }
      newForm.append("password",form.password)
      if(form?.avatar){
        newForm.append("avatar",form.avatar)
      }

      axios.post("http://localhost:8080/u/register",newForm)
      .then((response)=>{
          if(response.data.success){
              setForm( ()=>({
                username: "",
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                avatar: null
              }) )
              setClear(prev=>!prev)
              toast.success("Account created successfully.Please Login with your new credentials.")
          }
          else{
            throw Error(response.data.message)
          }
      })
      .catch( ({response})=> {
        console.log(response?.data?.message)
        toast.error(response?.data?.message)
        setForm( ()=>({
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          avatar: null
        }) )
        setClear(prev=>!prev)
      })
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
                key={clear}
                type="file" 
                onChange={handleChange}
                name="avatar"
                accept="image/*"
              />
            </div>

            <p className='text-center text-red-500 text-lg font-medium mb-6' >{error}</p>

            <div className="flex items-center justify-between">
              <button 
                className="font-semibold text-slate-200 bg-slate-900 hover:bg-slate-950 hover:text-slate-200 rounded-lg transition hover:cursor-pointer py-2 px-4 focus:outline-none focus:shadow-outline" 
                type="button"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <Link to="/login" className="inline-block align-baseline font-bold text-sm text-slate-300 hover:text-slate-400" href="#">
                Already have an account?
              </Link>
            </div>
          </form>

        </div>

      </main>
    </>
  )
}

export default Signup