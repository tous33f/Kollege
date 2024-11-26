import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';

function CommunitySettingsDetails() {
  
    const [community,setCommunity]=useState({})
    let [form,setForm]=useState({})
    const {comm_name}=useParams()
    const navigate=useNavigate()
    const [tags,setTags]=useState([])
    const [tag,setTag]=useState([])
    const [curTags,setCurTags]=useState([])

    useEffect(()=>{
      //get community info
      axios.get(`http://localhost:8080/c/${comm_name}/get_community_about`)
      .then(({data})=>{
          setCommunity(data.data)
          setForm(data.data)
      })
      .catch((err)=>{
          console.log(err.message)
      })
      //get community tags
      axios.get(`http://localhost:8080/t/${comm_name}`,{withCredentials: true})
      .then( ({data})=>{
        if(data.success){
          setTags(data?.data)
          setCurTags(data?.data)
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(err=>console.log(err.message))
    },[])

    const handleSubmit=async()=>{
        try{
            if(community.comm_name!=form.comm_name){
                let {data}=await axios.post(`http://localhost:8080/c/update_comm_name`,{
                    comm_name,new_comm_name: form?.comm_name
                },{withCredentials: true})
                if(data?.success){
                    console.log("Community name updated successfully")
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
                    console.log("Community fullname updated successfully")
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
                    console.log("Community about updated successfully")
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
                    console.log("Community description updated successfully")
                }
                else{
                    throw new Error("Error description about:"+data?.message)
                }
            }
            navigate(`/c/${form?.comm_name}`)
        }
        catch(err){
            console.log(err.message)
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
            <div>
              <label htmlFor="communityBanner" className="block text-sm font-medium text-slate-400 mb-2">
                Community Banner
              </label>
              <input
                type="file"
                id="communityBanner"
                accept="image/*"
                className="w-full px-3 py-2 bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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