import React, { useEffect, useState }  from 'react'
import CommunityCard from '../Community/CommunityCard'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store';
import axios from 'axios';
import { toast } from 'react-toastify';

function SearchCommunity() {

  let [communities,setCommunities]=useState([])
  let [pageCount,setPageCount]=useState(0)
  let [curPage,setCurPage]=useState(1)
  let [searchTerm, setSearchTerm] = useState('');
  
  const filteredCommunities = communities.filter(community => 
    community?.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || community?.comm_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearch=(e)=>{
    if(user.username){
      route="get_communities_protected"
    }
    else{
      route="get_communities_unprotected"
    }
    if(e.target.value==""){
      setSearchTerm("")
      axios.get(`http://localhost:8080/c/${route}?p=${curPage}`,{
        withCredentials: true
      })
      .then( ({data})=>{
        if(data.success){
          setCommunities(data.data.communities)
        }
        else{
          throw new Error(data?.data?.message)
        }
      } )
      .catch(({response})=>{
        toast.error(response?.data?.message)
      })
      return
    }
    setSearchTerm(e.target.value)
    axios.get(`http://localhost:8080/c/${route}?p=${-1}`,{
      withCredentials: true
    })
    .then( ({data})=>{
      if(data.success){
        setCommunities(data.data.communities)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
  }

  const handlePagination=()=>{
    if(user.username){
      route="get_communities_protected"
    }
    else{
      route="get_communities_unprotected"
    }
    axios.get(`http://localhost:8080/c/${route}?p=${curPage+1}`,{
      withCredentials: true
    })
    .then( ({data})=>{
      if(data.success){
        const {page,pageCount}=data.data;
        setCommunities((prev)=>{
          return [...prev,...data.data.communities]
        })
        setCurPage((prev)=>prev+1)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
  }

  let user=useUserStore(state=>state.user)
  let route;
  useEffect( ()=>{
    if(user.username){
      route="get_communities_protected"
    }
    else{
      route="get_communities_unprotected"
    }
    axios.get(`http://localhost:8080/c/${route}`,{
      withCredentials: true
    })
    .then( ({data})=>{
      if(data.success){
        setPageCount(data.data.pageCount);
        setCommunities(data.data.communities)
        console.log(data.data,curPage,pageCount)
      }
      else{
        throw new Error(data?.data?.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
  },[] )

  return (
    <div className=' flex-grow flex flex-col items-center justify-start px-6 py-12 text-slate-200'>
        <h1 className="text-4xl font-bold mb-6">Discover Communities</h1>
        <p className="text-xl mb-8 max-w-2xl text-center">or <Link className='text-orange-400 font-bold' to="/create_community" >create your own</Link> </p>
        <div className='flex items-center bg-slate-800 mb-12 px-1 py-3 rounded-lg text-slate-300 w-2/5' >
            <input type="text" className='outline-none bg-transparent px-3 w-full text-lg font-semibold' placeholder='Search for anything' value={searchTerm} onChange={(e)=>handleSearch(e)} />
        </div>

        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community, index) => (
              <CommunityCard key={community.comm_name} community={community} />
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
              {(curPage<pageCount)?<button onClick={handlePagination}
               className=" text-slate-200 bg-slate-950 px-3 py-2 rounded-lg ">
                Load more
              </button>:<></>}
          </div>

        </div>
    </div>
  )
}

export default SearchCommunity