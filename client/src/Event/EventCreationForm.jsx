import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function EventCreationForm({ isOpen, onClose, onSubmit, tags, comm_name, setEvents, setCurEvents }) {

    let [error,setError]=useState("")
    let [title, setTitle] = useState('');
    let [description, setDescription] = useState('');
    let [type,setType]=useState("Online")
    let [startDateTime, setStartDateTime] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });
    let [endDateTime, setEndDateTime] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

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
    if(!title.trim() || (20 - title.trim().split(/\s+/).length)>20){
        setError("Title for event is invalid")
        return
    }
    if(!description.trim()){
        setError("Description for event is invalid")
        return
    }
    let start=(new Date(startDateTime))
    let end=(new Date(endDateTime))
    if( start.getTime()==end.getTime() || start>end ){
        setError("Event start or end dates are invalid")
        return
    }
    
    axios.post(`http://localhost:8080/e/create`,{
      comm_name,title,description,start:startDateTime,end:endDateTime,type
    },{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setEvents( prev=>[data?.data,...prev] )
        setCurEvents( prev=>[data?.data,...prev] )
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
        className="bg-gray-800 rounded-lg shadow-xl md:w-full w-5/6 max-w-2xl"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Create a New Event</h2>
          
          {/* title  */}
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
              { (20 - title.trim().split(/\s+/).length)>=0 ? (20 - title.trim().split(/\s+/).length) : (0) } words remaining
            </p>
          </div>

            {/* description  */}
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

            {/* type  */}
          <div className="mb-4 text-slate-200">
          <span className="block text-sm font-medium mb-2">Community Type</span>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Online"
                  checked={type=="Online"?true:false}
                  onChange={() => setType("Online")}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Online</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Onsite"
                  checked={type=="Onsite"?true:false}
                  onChange={() => setType("Onsite")}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Onsite</span>
              </label>
            </div>
          </div>

            {/* start date time  */}
            <div className="mb-4">
                <label htmlFor="eventDateTime" className="block text-sm font-medium text-gray-300 mb-2">
                Event Start Date and Time
                </label>
                <input
                type="datetime-local"
                id="eventDateTime"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            {/* end date time  */}
            <div className="mb-4">
                <label htmlFor="eventDateTime" className="block text-sm font-medium text-gray-300 mb-2">
                Event End Date and Time
                </label>
                <input
                type="datetime-local"
                id="eventDateTime"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            {/* error  */}
            {error && <p className='text-center text-red-500 text-lg font-medium mb-4' >{error}</p> }

            {/* create and cancel button  */}
            <div className="flex justify-end space-x-4 ">
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
                Create Event
                </button>
            </div>
            
        </div>
      </div>
    </div>
  );
}