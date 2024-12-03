import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

function CommunitySettingsDetails() {
  
    const [community,setCommunity]=useState({})
    let [form,setForm]=useState({})
    const [banner_url,setBanner_url]=useState(null)
    const [clear,setClear]=useState(true)
    const {comm_name}=useParams()
    const navigate=useNavigate()
    const [tags,setTags]=useState([])
    const [tag,setTag]=useState([])
    const [curTags,setCurTags]=useState([])

    useEffect(()=>{
      //get community info
      axios.get(`http://localhost:8080/c/${comm_name}/get_community_about`)
      .then(({data})=>{
        if(data?.success){
          setCommunity(data.data)
          setForm(data.data)        }
        else{
          throw new Error(data?.data?.message)
        }
      })
      .catch(({response})=>{
        toast.error(response?.data?.message)
      })
      //get community tags
      axios.get(`http://localhost:8080/t/${comm_name}`,{withCredentials: true})
      .then( ({data})=>{
        if(data.success){
          setTags(data?.data)
          setCurTags(data?.data)
        }
        else{
          throw new Error(data?.data?.message)
        }
      } )
      .catch(({response})=>{
        toast.error(response?.data?.message)
      })
    },[])

    const handleSubmit=async()=>{
        try{
            if(community.comm_name!=form.comm_name){
                let {data}=await axios.post(`http://localhost:8080/c/update_comm_name`,{
                    comm_name,new_comm_name: form?.comm_name
                },{withCredentials: true})
                if(data?.success){
                    toast.success("Community name updated successfully")
                }
                else{
                    throw new Error("Error updating fullname:"+data?.message)
                }
            }
            if(community.fullname!=form.fullname){
                let {data}=await axios.post(`http://localhost:8080/c/update_fullname`,{
                    comm_name,new_fullname: form?.fullname
                },{withCredentials: true})
                if(data?.success){
                    toast.success("Community fullname updated successfully")
                }
                else{
                    throw new Error("Error updating fullname:"+data?.message)
                }
            }
            if(community.about!=form.about){
                let {data}=await axios.post(`http://localhost:8080/c/update_about`,{
                    comm_name,new_about: form?.about
                },{withCredentials: true})
                if(data?.success){
                    toast.success("Community about updated successfully")
                }
                else{
                    throw new Error("Error updating about:"+data?.message)
                }
            }
            if(community.description!=form.description){
                let {data}=await axios.post(`http://localhost:8080/c/update_description`,{
                    comm_name,new_description: form?.description
                },{withCredentials: true})
                if(data?.success){
                    toast.success("Community description updated successfully")
                }
                else{
                    throw new Error("Error updating description:"+data?.message)
                }
            }
            if(banner_url){
              let form=new FormData()
              form.append("banner_url",banner_url)
              form.append("comm_name",comm_name)
              let {data}=await axios.post(`http://localhost:8080/c/update_banner`,form,{withCredentials: true})
              if(data?.success){
                toast.success("Community banner updated successfully")
              }
              else{
                  throw new Error("Error updating banner:"+data?.message)
              }
            }
            navigate(`/c/${form?.comm_name}`)
        }
        catch({response}){
            toast.error(response?.data?.message)
        }
    }
    
    const handleChange=(e)=>{
        const { name, value } = e.target;
        setForm(prevState => ({
        ...prevState,
        [name]: value
        }));
      }

  return (
    <div className="space-y-6">
            <div>
              <label htmlFor="communityName" className="block text-sm font-medium text-slate-400 mb-2">
                Community Name
              </label>
              <input
                type="text"
                id="communityName"
                value={form?.comm_name}
                name="comm_name"
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="communityFullname" className="block text-sm font-medium text-slate-400 mb-2">
                Community Full Name
              </label>
              <input
                type="text"
                id="communityFullname"
                value={form?.fullname}
                name="fullname"
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* community banner  */}
            <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-300 mb-2">
              Upload a new user profile image
            </label>
            <div className="mt-1 flex items-center">
                <input key={clear}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="avatar" 
                type="file" 
                accept="image/*"
                name='banner_url'
                onChange={(e)=>setBanner_url(e.target.files[0])}
                />
                { banner_url && <svg onClick={()=>{
                  setClear(prev=>!prev)
                  setBanner_url(null)
                }} className='ml-3 cursor-pointer' fill="#4b5563" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "></polygon> </g></svg>
                }
                <button onClick={()=>{
                  //removing community banner
                  axios.post(`http://localhost:8080/c/remove_banner`,{comm_name},{withCredentials: true})
                  .then( ({data})=>{
                    if(data?.success){
                      toast.success("Community banner removed successfully")
                    }
                    else{
                      throw new Error(data?.message)
                    }
                  } )
                  .catch(({response})=>{
                    toast.error(response?.data?.message)
                  })

                }} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4">
                Remove Banner
                </button>
            </div>
            {/* community about  */}
            </div>
            <div>
              <label htmlFor="communityAbout" className="block text-sm font-medium text-slate-400 mb-2">
                About Community
              </label>
              <textarea
                id="communityAbout"
                value={form?.about}
                name='about'
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="communityDescription" className="block text-sm font-medium text-slate-400 mb-2">
                Community Description
              </label>
              <textarea
                id="communityDescription"
                value={form?.description}
                name='description'
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            {/* <div>
            <label htmlFor="communityName" className="block text-sm font-medium text-slate-300 mb-2">
              Community Tags
            </label>
            <div>
              <input
                type="text"
                id="communityTag"
                name="communityTag"
                value={tag}
                onChange={(e)=>setTag(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button onClick={()=>{
                let newTags=[...curTags]
                newTags.push(tag)
                setCurTags(newTags)
                setTag("")
              }} className="px-3 py-1 h-10 bg-green-600 text-slate-200 font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-4">
                Add
              </button>
            </div>
            {curTags.length>0 && curTags.map( (value,index)=>{
                return <p  onClick={()=>{

                }}
                className='bg-slate-800 inline-block w-fit mr-4 mt-4 text-center px-4 py-2 text-lg rounded-full text-slate-400 hover:bg-slate-950 cursor-pointer' > {value.tag_name} </p>
              } )}
            </div> */}
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
  )
}

export default CommunitySettingsDetails