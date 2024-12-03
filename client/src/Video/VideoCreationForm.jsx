import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function VideoCreationForm({ isOpen, onClose, course_id, comm_name, setLessons}) {

    const [title, setTitle] = useState('');
    const [description,setDescription]=useState("")
    const [video_url,setVideo_url]=useState("")
    const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title.trim() || !description.trim() || title.trim().split(/\s+/).length>20){
      return
    }
    axios.post(`http://localhost:8080/v/create`,{comm_name,course_id,title,description,video_url},{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setLessons(prev=>[...prev,data?.data])
        onClose()
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
      onClose()
    })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Create a New Video</h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title (20 words max)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              {20 - title.trim().split(/\s+/).length} words remaining
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-300 mb-2">
              Youtube Video URL ID
            </label>
            <input
              type="text"
              id="video_url"
              value={video_url}
              onChange={(e)=>setVideo_url(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
            onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}