import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer,toast } from 'react-toastify';

export default function PostCreationForm({ isOpen, onClose, onSubmit, tags, comm_name, handlePostCreation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  let [tagId,setTagId]=useState(tags[0].tag_id)
  let [tagName,setTagName]=useState(tags[0].tag_name)
  const [image, setImage] = useState(null);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleTitleChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 20) {
      setTitle(e.target.value);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title.trim() || !content.trim()){
      toast.error("Information is incomplete")
      return
    }
    axios.post(`http://localhost:8080/p/create`,{
      comm_name,tag_id:tagId,title,content
    },{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        axios.get(`http://localhost:8080/p/${comm_name}/${data?.data?.post_id}`,{withCredentials: true})
        .then( ({data})=>{
          if(data.success){
            handlePostCreation(data?.data)
            onClose()
          }
          else{
            throw new Error(data.message)
          }
        } )
        .catch( (err)=>{
          console.log(err.message)
          onClose()
        } )
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>{
      console.log(err.message)
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
          <h2 className="text-2xl font-bold mb-4 text-white">Create a New Post</h2>
          
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Tag
            </label>
            <select
              value={tagId}
              onChange={ (e)=>{
                setTagId(parseInt(e.target.value));
                for(let i=0;i<tags.length;i++){
                  if(tags[i].tag_id==parseInt(e.target.value)){
                    setTagName(tags[i].tag_name);
                    break;
                  }
                }
              } }
              className="bg-slate-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.isArray(tags) && tags.map( (val,index)=><option key={val?.tag_id} value={val?.tag_id} >{val?.tag_name}</option> )}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Image (optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Choose File
              </button>
              <span className="ml-3 text-sm text-gray-400">
                {image ? image.name : 'No file chosen'}
              </span>
            </div>
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
              Create Post
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
    </div>
  );
}