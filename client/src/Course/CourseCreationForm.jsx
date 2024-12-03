import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

export default function CourseCreationForm() {
  let [banner_url,setBanner_url]=useState(null)
  let [name, setName] = useState('');
  let [about, setAbout] = useState('');
  let [error,setError]=useState('')
  let navigate=useNavigate()
  const {comm_name}=useParams()

  const handleSubmit=async ()=>{

    let form=new FormData()

    form.append("comm_name",comm_name)
    if(!name || !name.trim()){
      setError("Please enter a course name")
      return
    }
    form.append("name",name)
    if(!about || about.trim().split(" ").length>30){
      setError("About section is not given or length is invalid")
      return
    }
    form.append("about",about)
    if(banner_url){
      form.append("banner_url",banner_url)
    }

    try{
      const {data}=await axios.post(`http://localhost:8080/cr/create`,form,{withCredentials: true})
      if(!data.success){
        throw new Error(data.message)
      }
      else{
        navigate(`/c/${comm_name}/classroom/${data?.data?.course_id}`,{replace: true})
      }
    }
    catch({response}){
      toast.error(response?.data?.message)
      return
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create a New Course</h1>
        <div  className="space-y-6 bg-slate-800 p-8 rounded-lg shadow-lg">

          <div>
            <label htmlFor="communityName" className="block text-sm font-medium text-slate-300 mb-2">
              Course Name
            </label>
            <input
              type="text"
              id="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
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
            <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-300 mb-2">
              Community Banner Image
            </label>
            <div className="mt-1 flex items-center">
                <input 
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="banner_url"
                type="file" 
                accept="image/*"
                name='banner_url'
                onChange={(e) => setBanner_url(e.target.files[0])}
                />
            </div>
          </div>

          <p className='text-center text-red-500 text-lg font-medium' >{error}</p>

          <div>
            <button onClick={handleSubmit}
              className="w-full px-4 py-2 bg-slate-900 text-slate-300 rounded-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}