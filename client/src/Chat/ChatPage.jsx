import React, { useEffect, useState } from 'react';
import ChatArea from './ChatArea';
import axios from "axios"
import { useUserStore } from '../store'
import {useLocation} from "react-router-dom"

export default function ChatPage() {

  const {state}=useLocation()
  let user=useUserStore(state=>state.user)
  const [selectedUser, setSelectedUser] = useState(state?.user);
  const [users,setUsers]=useState([])

  useEffect( ()=>{
    axios.get( `http://localhost:8080/ch`,{withCredentials:true} )
    .then( ({data})=>{
      if(data?.success){
        setUsers( ()=>data?.data.map( val=>{
          if(val.u1_username==user?.username){
            return {user_id:val?.u2_user_id,username: val?.u2_username,firstname:val?.u2_firstname,lastname:val?.u2_lastname,avatar_url:val?.u2_avatar_url}
          }
          else{
            return {user_id:val?.u1_user_id,username: val?.u1_username,firstname:val?.u1_firstname,lastname:val?.u1_lastname,avatar_url:val?.u1_avatar_url}
          }
        } ) )
        setUsers( prev=>prev.filter( val=>val?.user_id!=state?.user?.user_id ) )
        if(state?.user){
          setUsers(prev=>[state?.user,...prev])
        }
      }
      else{
        throw new Error(data?.message)
      }
    } )
    .catch( ({response})=>{
      console.log(response?.data?.message)
    } )

  } ,[])

  return (
    <div className=" bg-slate-900">

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Users Sidebar */}
          <div className="w-1/5 bg-slate-800 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-2">
              {users.map(val => (
                <div
                  key={val?.user_id}
                  onClick={() => {
                    setSelectedUser(null)
                    setTimeout(()=>{
                      setSelectedUser(val)
                    },100)
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.user_id === val?.user_id
                      ? 'bg-slate-700'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  { val?.avatar_url ? <img
                    src={`http://localhost:8080/images/${val?.avatar_url}`}
                    alt={val?.firstname}
                    className="w-10 h-10 rounded-full"
                  /> :
                  <div 
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"
                  >
                  {val?.username ? val?.username[0].toUpperCase() : 'U'}
                  </div> 
                  }
                  <span className="text-slate-200">{val?.firstname+" "+val?.lastname}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedUser ? ( <ChatArea setSelectedUser={setSelectedUser} recv={selectedUser} />) : (
              <div  className="flex-1 flex items-center justify-center text-slate-500">
                Select a user to start chatting
              </div>
            )}
        </div>
    </div>
  );
}