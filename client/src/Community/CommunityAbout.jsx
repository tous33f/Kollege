import React from 'react';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import CommunitySidebar from './CommunitySidebar'
import { toast } from 'react-toastify';

export default function CommunityAbout() {

  const [community,setCommunity]=useState({})
  const {comm_name}=useParams()
  useEffect(()=>{
    axios.get(`http://localhost:8080/c/${comm_name}/get_community_about`)
    .then(({data})=>{
      if(data?.success){
        setCommunity(data.data)
      }
      else{
        throw new Error(data?.data?.message)
      }
    })
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
  },[])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold">{community?.fullname}</h1>
            
            {/* Main Banner */}
            <div className="bg-[#0a0b34] rounded-lg overflow-hidden ">
              { community?.banner_url ?
              <img
                src={` http://localhost:8080/images/${community?.banner_url} `} 
                alt={`${community?.fullname} banner`} 
                width={400} 
                height={800} 
                className="w-full h-64 object-cover"
                /> :
                <img
                src="https://g-p1v8sxx1jj4.vusercontent.net/placeholder.svg?height=100&width=200" 
                alt={`${community.fullname} banner`} 
                width={400} 
                height={800} 
                className="w-full h-64 object-cover"
                />
              }
            </div>

            {/* Community Info */}
            <div className="flex flex-wrap gap-8 py-6">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                <span>{community.type} group</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{community.total_members} members</span>
              </div>
              {/* free/paid tag  */}
              {/* <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Free</span>
              </div> */}
              <div className="flex items-center space-x-2">
                { community?.avatar_url ?
                <img 
                src={ ` http://localhost:8080/images/${community?.avatar_url} ` }
                alt="Creator avatar" 
                className="w-8 h-8 rounded-full"
                />:
                <img 
                  src={"https://via.placeholder.com/32" }
                  alt="Creator avatar" 
                  className="w-8 h-8 rounded-full"
                />
                }
                <span>By {community?.firstname+" "+community?.lastname}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300">
                {community?.description}
              </p>
            </div>
          </div>

        <CommunitySidebar />
      </div>
    </div>
  </div>
  );
}