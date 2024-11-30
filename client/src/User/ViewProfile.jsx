import React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ViewProfile() {

  let [user,setUser]=useState({})

    useEffect( ()=>{
        axios.get(` http://localhost:8080/u `,{withCredentials:true})
        .then( ({data})=>{
          console.log(data?.data)
            setUser(data?.data)
        } )
        .catch( ({response})=>{
            console.log(response?.data?.message)
            navigate(-1)
        } )
      }, [] )

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center ">
            { user?.avatar_url ?
                <img
                src={` http://localhost:8080/images/${user?.avatar_url} `}
                alt={`${ user?.firstname+" "+user?.lastname }'s profile picture`}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
              /> :
              <div 
              className="w-32 h-32 text-6xl mx-auto mb-4 border-4 border-blue-500 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"
                >
                {user?.username ? user?.username[0].toUpperCase() : 'U'}
                </div>
            }
              <h1 className="text-2xl font-bold text-white mb-2">{user?.firstname+" "+user?.lastname}</h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
            </div>
            <div className="mt-8 space-y-4">
              <Link to="/update_profile" > <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
                Edit Profile
              </button> </Link>
            </div>
          </div>
          <div className="bg-gray-700 px-8 py-4">
            <h2 className="text-lg font-semibold text-white mb-2">Account Information</h2>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="font-medium">Member since:</span> January 1, 2023
              </li>
              <li>
                <span className="font-medium">Last login:</span> Today at 2:30 PM
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}