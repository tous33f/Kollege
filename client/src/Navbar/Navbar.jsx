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
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className='flex justify-between bg-slate-950 h-12 items-center py-10 px-16'>
        <div className=' font-bold text-4xl'> <Link to="/">
          <span className='text-orange-400'>k</span>
          <span className='text-red-800'>o</span>
          <span className='text-yellow-500'>l</span>
          <span className='text-blue-300'>l</span>
          <span className='text-red-800'>e</span>
          <span className='text-fuchsia-500'>g</span>
          <span className='text-yellow-500'>e</span> </Link>
        </div>
        <ul className='flex text-slate-200 text-base items-center'>
            <li className='hover:bg-slate-800 px-3 py-2 rounded-md hover:cursor-pointer transition'><Link to="/">Home</Link></li>
            <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/community'>Community</Link></li>
            {/* <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' >Events</li> */}
            {/* <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' >Resources</li> */}
            {(!user.username || !user.email)?(
              <>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to="/login" >Sign in</Link></li>
              <li className='ml-5 px-3 py-1 font-semibold bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition hover:cursor-pointer' ><Link to='/signup'>Join now <span >&#128521;</span> </Link></li>
              </>
            )
            :(
            <>
              <li className='ml-5 hover:bg-slate-800 px-3 py-2 rounded-lg hover:cursor-pointer transition' ><Link to='/your_communities'>Your communities</Link></li>
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