import axios from 'axios'
import React, { useEffect, useState,useRef } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { collapseToast, toast } from 'react-toastify'

function CommunityNavbar() {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev=>!prev);
  };

  const active="px-3 py-4 text-white border-b-2 border-slate-300"
  const notActive="px-3 py-4 text-slate-300 hover:text-white"
  const {comm_name}=useParams()
  let [display,setDisplay]=useState(false)
  let location=useLocation()
  let path=location.pathname.split("/")
  let cur=(path.length>3?path[3]:"home")
  let pages=["home","classroom","events","members","about"]
  console.log(path)

  useEffect(()=>{

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success && data?.data?.membership==2){
        setDisplay(true)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch( ({response})=>{
      toast.error(response?.data?.message)
    } )

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  })

  return (
    <>

      {
        display && 
        <>
        <div className='md:hidden' onClick={toggleDropdown} ref={dropdownRef}  >
          <p className=' text-center mt-6' ><span className='text-slate-200 text-lg font-semibold bg-slate-800 px-4 py-2' > {cur[0].toUpperCase()+cur.slice(1)} </span> </p>
          { isDropdownOpen && <div className="absolute left-1/2 -translate-x-1/2  mt-2 w-30 bg-gray-800 rounded-md shadow-lg py-1 z-10">
            {pages.map(val=>{
              if(val!=(cur[0].toLowerCase()+cur.slice(1)) ){
                console.log(val)
                return <NavLink to={(val=="home")?"":val} end  className="block w-full px-4 py-2 text-slate-200 text-lg font-semibold hover:bg-gray-700" >{val[0].toUpperCase()+val.slice(1)}</NavLink>
              }
            })}
          </div>}
        </div>
        </>
      }

      {display && <nav className=" hidden md:block bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 flex-wrap ">
            <NavLink to="" end  className={({ isActive }) => (isActive ? active : notActive)} >Community</NavLink>
            <NavLink to="classroom"  className={({ isActive }) => (isActive ? active : notActive)} >Classroom</NavLink>
            <NavLink to="events"  className={({ isActive }) => (isActive ? active : notActive)} >Calendar</NavLink>
            <NavLink to="members"  className={({ isActive }) => (isActive ? active : notActive)} >Members</NavLink>
            <NavLink to="about" className={({ isActive }) => (isActive ? active : notActive)} >About</NavLink>
          </div>
        </div>
      </nav> }
    </>
  )
}

export default CommunityNavbar
