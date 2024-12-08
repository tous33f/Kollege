import React, { useEffect,useState } from 'react'
import CommunityCard from '../Community/CommunityCard';
import axios from 'axios';
import { toast } from 'react-toastify';

function YourCommunities() {

  let [joined,setJoined]=useState([])
  let [created,setCreated]=useState([])
  let [requested,setRequested]=useState([])

  useEffect(()=>{
    axios.get("http://localhost:8080/c/get_created_communities",{withCredentials: true})
    .then( ({data})=>{
      setCreated(data.data)
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })

    axios.get("http://localhost:8080/c/get_joined_communities",{withCredentials: true})
    .then( ({data})=>{
      setJoined(data.data)
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })

    axios.get("http://localhost:8080/c/get_requested_communities",{withCredentials: true})
    .then( ({data})=>{
      setRequested(data.data)
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })

  },[])

  return (
    <div className=' flex-grow flex flex-col items-center justify-start px-6 py-12 text-slate-200 min-h-screen'>

        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Created Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {created.map((community, index) => {
              community.joined=true;
              return <CommunityCard key={community.comm_name} community={community} />
            })}
          </div>
        </div>

        <div className="w-full max-w-7xl mt-12">
          <h2 className="text-2xl font-bold mb-6">Joined Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joined.map((community, index) => {
              community.joined=true;
              return <CommunityCard key={community.comm_name} community={community} />
            })}
          </div>
        </div>

        <div className="w-full max-w-7xl mt-12">
          <h2 className="text-2xl font-bold mb-6">Requested Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requested.map((community, index) => {
              return <CommunityCard flag={true} key={community.comm_name} community={community} />
            })}
          </div>
        </div>

    </div>
  )
}

export default YourCommunities