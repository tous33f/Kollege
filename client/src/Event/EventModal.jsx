import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const EventModal = ({ event, onClose, isOpen, setEvents, setCurEvents, comm_name, role }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete=()=>{
    axios.post(`http://localhost:8080/e/delete`,{
        comm_name,event_id:event?.event_id
      },{withCredentials: true})
      .then( ({data})=>{
        if(data.success){
            setEvents( prev=>{
                return prev.filter( (val)=>{
                    if(val?.event_id==event?.event_id){
                        return false;
                    }
                    else{
                        return true
                    }
                } )
            } )
            setCurEvents( prev=>{
                return prev.filter( (val)=>{
                    if(val?.event_id==event?.event_id){
                        return false;
                    }
                    else{
                        return true
                    }
                } )
            } )
            onClose()
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(({response})=>{
        console.log(response?.data?.message)
        onClose()
      })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-start z-10">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-300">Description</h3>
            <p className="text-gray-400 mt-2">{event.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300">Event Type</h3>
            <p className="text-gray-400 mt-2">{event.type}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300">Start Date</h3>
            <p className="text-gray-400 mt-2">{formatDate(event.start)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300">End Date</h3>
            <p className="text-gray-400 mt-2">{formatDate(event.end)}</p>
          </div>

        </div>

        <div className="border-t border-gray-700 p-4 flex justify-end">
        { (role && role!="Member") && <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >Delete
        </button>}
        <button
            onClick={onClose}
            className="px-4 ml-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >Close
        </button>
        </div>

      </div>
    </div>
  );
};

export default EventModal;