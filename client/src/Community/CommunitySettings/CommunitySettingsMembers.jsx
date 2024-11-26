import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router';
import { useUserStore } from '../../store';
import axios from 'axios';

function CommunitySettingsMembers() {

    let {comm_name}=useParams();

    let [searchTerm, setSearchTerm] = useState('');
    let [userCommunityInfo,setUserCommunityInfo]=useState({})
    let [members,setMembers]=useState([])

    const user=useUserStore(state=>state.user)

    const filteredMembers = members.filter(member => 
    member?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || member?.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange=(role,username,index)=>{
        if(role && username && role){
            let newMembers=[...members]
            newMembers[index].role=role
            axios.post( `http://localhost:8080/c/update_privlige`,{
                comm_name,updated_username: username,updated_role: role
            }, {withCredentials: true} )
            .then( ({data})=>{
                if(data.success){
                    setMembers(newMembers)
                }
                else{
                    throw new Error(data.message)
                }
            } )
            .catch(err=>console.log(err.message))
        }
        else{
            console.log("Error updating user role")
        }
    }

    const handleRemoval=(username,index)=>{
        console.log(username,index)
        if(username && index+1){
            axios.post(`http://localhost:8080/c/leave_community`,{comm_name,removed_username:username},{withCredentials:true})
            .then( ({data})=>{
                if(data.success){
                    let newMembers=members.filter( member=>member?.username!=username )
                    setMembers(newMembers)
                }
                else{
                    throw new Error(data.message)
                }
            } )
            .catch(err=>console.log(err.message))
        }
        else{
            console.log("Username not found")
        }
    }

    useEffect(()=>{
        axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
        .then( ({data})=>{
        if(data.success){
            setUserCommunityInfo(data.data)
        }
        } )

        axios.get(`http://localhost:8080/c/${comm_name}/get_community_roles`,{withCredentials: true})
        .then( ({data})=>{
            if(data.success){
                setMembers(data.data)
            }
            else{
                throw new Error(data.message)
            }
        } )
        .catch(err=>console.log(err.message))
    },[])

  return (
    <div>
        <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <ul className="space-y-4">
            {filteredMembers.map((member,index) => (
            <li key={member.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-md">
                <div className="flex items-center space-x-4">
                {member?.avatar_url ? <img src={member.avatar_url} alt={member?.firstname} className="w-10 h-10 rounded-full" />:               <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'>{member.username[0].toUpperCase()}</div>}
                <span>{member?.firstname+" "+member?.lastname}</span>
                </div>
                <div>
                <select
                    key={member?.username}
                    value={member.role}
                    onChange={(e) => {handleChange(e?.target?.value,member?.username,index)}}
                    className="bg-slate-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Member">Member</option>
                    <option value="Moderator">Moderator</option>
                    {userCommunityInfo?.info.role=="Admin" && <option value="Admin">Admin</option>}
                </select>
                <button onClick={()=>handleRemoval(member?.username,index)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4">
                    Remove
                </button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  )
}

export default CommunitySettingsMembers