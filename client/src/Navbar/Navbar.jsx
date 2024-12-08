import React, { useEffect,useRef,useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {

  let user=useUserStore(state=>state.user)
  let setUser=useUserStore(state=>state.setUser)


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev=>!prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout=(e)=>{
    axios.post("http://localhost:8080/u/logout",{},{withCredentials: true})
    .then((response)=>{
      toast.success("Logged out successfully")
      setUser({username:"",email:""})
    })
    .catch(({response})=>toast.error(response?.data?.message))
  }

  return (
    <div className='flex justify-between bg-slate-950 md:h-12 h-8 items-center py-10 px-12'>
        <div className=' font-bold md:text-4xl text-3xl'> <Link to="/">
          <span className='text-orange-400'>k</span>
          <span className='text-red-800'>o</span>
          <span className='text-yellow-500'>l</span>
          <span className='text-blue-300'>l</span>
          <span className='text-red-800'>e</span>
          <span className='text-fuchsia-500'>g</span>
          <span className='text-yellow-500'>e</span> </Link>
        </div>
        {/* mobile view  */}
        <div className='w-4 text-slate-200 md:hidden cursor-pointer' onClick={toggleDropdown} ref={dropdownRef} >
        <svg fill="#e2e8f0" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 124 124" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z"></path> <path d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z"></path> <path d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z"></path> </g> </g></svg>
        {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-30 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to={"/"}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    toggleDropdown()
                  }}
                >
                  Home
                </Link>
                <Link
                  to={"/community"}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    toggleDropdown()
                  }}
                >
                  Community
                </Link>
                <Link
                  to={"/your_communities"}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    toggleDropdown()
                  }}
                >
                  Your Communities
                </Link>
                { user?.username && <> <Link
                  to={"/view_profile"}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    toggleDropdown()
                  }}
                >
                  View Profile
                </Link>
                <Link
                  to={"/update_profile"}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    toggleDropdown()
                  }}
                >
                  Update Profile
                </Link>
                <button
                  className="w-full text-start px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    handleLogout()
                    toggleDropdown()
                  }}
                >
                  Logout
                </button> </> }
              </div>
            )}
        </div>

        {/* desktop view */}
        <ul className=' text-slate-200 text-base items-center hidden md:flex'>
            <li className='hover:bg-slate-800 px-3 py-2 rounded-md hover:cursor-pointer transition'><Link to="/">Home</Link></li>
            <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/community'>Community</Link></li>
            {(!user.username || !user.email)?(
              <>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to="/login" >Sign in</Link></li>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to='/signup'>Join now <span >&#128521;</span> </Link></li>
              </>
            )
            :(
            <>
              <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/your_communities'>Your communities</Link></li>
              <div className=' ml-5 hover:bg-slate-800 px-3 py-2 rounded-full hover:cursor-pointer transition' > <Link to='/chat' >
              <svg fill="#e2e8f0" height="26px" width="26px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" stroke="#e2e8f0"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689 c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01 c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"></path> </g></svg>
              </Link>
              </div>
              <div className="relative ml-5" ref={dropdownRef}>
            { user?.avatar_url ? <img src={`http://localhost:8080/images/${user?.avatar_url}`} 
            alt={`${user?.firstname}'s avatar`} className='w-10 h-10 rounded-full cursor-pointer'
            onClick={toggleDropdown} /> :
              <div 
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white cursor-pointer"
              onClick={toggleDropdown}
              >
              {user?.username ? user?.username[0].toUpperCase() : 'U'}
              </div>
            }
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to={"/view_profile"}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  View Profile
                </Link>
                <Link
                  to={"/update_profile"}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  Update Profile
                </Link>
                <button
                  className="w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    handleLogout()
                    setIsDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

              </>
            )}
        </ul>
        
    </div>
  )
}

export default Navbar