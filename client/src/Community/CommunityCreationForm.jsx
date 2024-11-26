import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';

export default function CommunityCreationForm() {
  let [isPublic, setIsPublic] = useState(true);
  let [comm_name, setComm_name] = useState('');
  let [fullname, setFullname] = useState('');
  let [about, setAbout] = useState('');
  let [description, setDescription] = useState('');
  let [tags,setTags]=useState([])
  let [tag,setTag]=useState('')
  let navigate=useNavigate()

  const handleSubmit=async ()=>{
    try{
      const {data}=await axios.post(`http://localhost:8080/c/create`,{
        comm_name,fullname,about,description,type:(isPublic?"Public":"Private")
      },{withCredentials: true})
      if(!data.success){
        throw new Error(data.message)
      }
    }
    catch(err){
      console.log(err.message)
      return
    }
    try{
      const {data}=await axios.post(`http://localhost:8080/t/create`,{
        comm_name,tags
      },{withCredentials: true})
      if(data.success){
        navigate(`/c/${comm_name}`,{replace: true})
      }
      else{
        throw new Error(data.message)
      }
    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create a New Community</h1>
        <div  className="space-y-6 bg-slate-800 p-8 rounded-lg shadow-lg">

        <div>
            <label htmlFor="communityURL" className="block text-sm font-medium text-slate-300 mb-2">
              Community Unique name for URL
            </label>
            <input
              type="text"
              id="communityURL"
              value={comm_name}
              onChange={(e)=>setComm_name(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="communityName" className="block text-sm font-medium text-slate-300 mb-2">
              Community Full Name
            </label>
            <input
              type="text"
              id="communityName"
              value={fullname}
              onChange={(e)=>setFullname(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-slate-300 mb-2">
              About (30 words max)
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e)=>setAbout(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p className="text-sm text-slate-400 mt-1">
              {31 - about.trim().split(" ").length} words remaining
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description (300 words max)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p className="text-sm text-slate-400 mt-1">
              {301 - description.trim().split(/\s+/).length} words remaining
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-300 mb-2">Community Type</span>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="communityType"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="communityType"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Private</span>
              </label>
            </div>
          </div>

          <div>
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
                // required
                className="w-1/2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button onClick={()=>{
                let newTags=[...tags]
                newTags.push(tag)
                setTags(newTags)
                setTag("")
              }} className="px-3 py-1 h-10 bg-green-600 text-slate-200 font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-4">
                Add
              </button>
            </div>

              {tags.length>0 && tags.map( (value,index)=>{
                return <p onClick={ ()=>{
                  let newTags=tags.filter( (v,i)=>i!=index )
                  setTags(newTags)
                } } 
                className='bg-slate-900 inline-block w-fit mr-4 mt-4 text-center px-4 py-2 text-lg rounded-full text-slate-400 hover:bg-slate-950 cursor-pointer' > {value} </p>
              } )}

          </div>

          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-300 mb-2">
              Community Banner Image
            </label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              className="hidden"
              onChange={() => console.log('File selected')}
            />
            <div className="mt-1 flex items-center">
                <input 
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="profile-picture" 
                type="file" 
                accept="image/*"
                />
            </div>
          </div>

          <div>
            <button onClick={handleSubmit}
              className="w-full px-4 py-2 bg-slate-900 text-slate-300 rounded-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}