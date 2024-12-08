'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import EventCreationForm from '../Event/EventCreationForm'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import EventModal from '../Event/EventModal'
import { toast } from 'react-toastify'

const localizer = momentLocalizer(moment)

export default function CommunityCalendar() {

  const {comm_name}=useParams()
  let navigate=useNavigate()

  const [view, setView] = useState('month')
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent,setSelectedEvent ] = useState(null);
  let [events,setEvents]=useState([])
  let [curEvents,setCurEvents]=useState([])
  let [userCommunityInfo,setUserCommunityInfo]=useState({})


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEventClick=({start})=>{
    start=start?.toDateString()
    let newEvents=events.filter( event=>{
      let eventStart=(new Date(event?.start) ).toDateString()
      if(eventStart==start){
        return true
      }
      else{
        return false
      }
    } )
    setCurEvents(newEvents)
  }

  useEffect(()=>{

    axios.get(`http://localhost:8080/e/${comm_name}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setEvents(data?.data)
        setCurEvents(data?.data.slice(0,6))
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch(({response})=>{
      toast.err(response?.message)
    })

    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setUserCommunityInfo(data.data)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch(({response})=>{
      toast.err(response?.message)
      navigate(`/${comm_name}/`)
    })

    
  },[])

  return (
    <>

    {/* event modal  */}
    {
      selectedEvent && 
      <EventModal
      event={selectedEvent}
      isOpen={setSelectedEvent}
      onClose={() => setSelectedEvent(null)} 
      setEvents={setEvents}
      setCurEvents={setCurEvents}
      comm_name={comm_name}
      role={userCommunityInfo?.info?.role}
      />
    }

    {/* Event Creation Form  */}
    {isEventFormOpen && (
        <EventCreationForm
        comm_name={comm_name}
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        setEvents={setEvents}
        setCurEvents={setCurEvents}
        />
      )}

    {/* <CommunityNavbar /> */}
    <div className="md:min-h-screen bg-slate-900 text-slate-200 flex flex-col md:px-20 px-16 py-8">

      {/* Main Content */}
      <h1 className="md:px-4 md:text-3xl text-xl font-bold mb-6">Community Calendar</h1>
      <div className="flex-grow md:p-4 flex flex-wrap">
        {/* Calendar Section */}
        <div className="flex-grow md:pr-4">
          <div className="md:h-[calc(100vh-200px)] h-[calc(100vh-600px)] min-h-72 bg-white rounded-lg overflow-hidden">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              views={['month']}
              style={{color:"black"}}
              onView={(newView) => setView(newView)}
              onSelectSlot={handleEventClick}
              selectable
              onSelectEvent={(e)=>setSelectedEvent(e)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-80 w-full mt-6 md:mt-0 bg-slate-800 rounded-lg p-4 h-fit  ">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ul className="space-y-2 mb-6">
            {curEvents.map((event, index) => (
              <li key={index} onClick={()=>setSelectedEvent(event)} className="bg-slate-700 cursor-pointer rounded p-2">
                <h3 className="font-medium">{event?.title}</h3>
                <p className="text-sm text-slate-400">{ formatDate(event?.start) }</p>
              </li>
            ))}
          </ul>

          <button onClick={()=>setCurEvents(events)}
           className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded">
            View all Events
          </button>

          { userCommunityInfo?.info?.role && userCommunityInfo?.info?.role!="Member" && <button onClick={()=>setIsEventFormOpen(true)} 
          className="w-full mt-6 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded">
            Create Event
          </button>}

        </div>
      </div>
    </div>
    </>
  )
}