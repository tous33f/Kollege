import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

function CommunitySettingsRequests() {

    const {comm_name}=useParams()
    let [requests,setRequests]=useState([])

    const handeleAccept=(username,index)=>{
        if(username && index+1){
            axios.post(`http://localhost:8080/c/accept_join_request`,{comm_name,updated_username:username},{withCredentials:true})
            .then( ({data})=>{
                if(data.success){
                    let newRequests=requests.filter( request=>request?.username!=username )
                    setRequests(newRequests)
                }
                else{
                    throw new Error(data.message)
                }
            } )
            .catch(({response})=>{
                toast.error(response?.data?.message)
            })
        }
        else{
            toast.error("Username not found")
        }
    }

    const handeleDecline=(username,index)=>{
        if(username && index+1){
            axios.post(`http://localhost:8080/c/cancel_join_request`,{comm_name,updated_username:username},{withCredentials:true})
            .then( ({data})=>{
                if(data.success){
                    let newRequests=requests.filter( request=>request?.username!=username )
                    setRequests(newRequests)
                }
                else{
                    throw new Error(data.message)
                }
            } )
            .catch(({response})=>{
                toast.error(response?.data?.message)
            })
        }
        else{
            toast.error("Username not found")
        }
    }

    useEffect(()=>{
        axios.get(`http://localhost:8080/c/${comm_name}/get_community_requests`,{withCredentials: true})
        .then( ({data})=>{
            if(data.success){
                setRequests(data.data)
            }
            else{
                throw new Error(data.message)
            }
        } )
        .catch(({response})=>{
            toast.error(response?.data?.message)
        })
    },[])

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">Pending Join Requests</h2>
        <ul className="space-y-4">
            {requests.map((request,index) => (
            <li key={request?.username} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
                <div className="flex items-center space-x-4">
                {request?.avatar_url ? <img src={` http://localhost:8080/images/${request?.avatar_url} `} alt={request?.firstname} className="w-10 h-10 rounded-full" />:               <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'>{request.username[0].toUpperCase()}</div>}
                <span>{request?.firstname+" "+request?.lastname}</span>
                </div>
                <div className="space-x-2">
                <button onClick={()=>handeleAccept(request?.username,index)} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Accept
                </button>
                <button onClick={()=>handeleDecline(request?.username,index)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                    Decline
                </button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  )
}

export default CommunitySettingsRequests