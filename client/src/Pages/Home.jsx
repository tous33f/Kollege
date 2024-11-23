
import React, { useEffect, useState } from 'react'
import CommunityCard from '../Community/CommunityCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../store';

function Home() {

  let [communities,setCommunities]=useState([])

  let [pageCount,setPageCount]=useState(0)

  let user=useUserStore(state=>state.user)
  
  let [curPage,setCurPage]=useState(1)
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
        console.log("error")
      }
    } )
  }

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
      }
      else{
        console.log("error")
      }
    } )
  },[user] )

  return (
    <div className=' flex-grow flex flex-col items-center justify-start px-6 py-12 text-slate-200'>
        <h1 className="text-4xl font-bold mb-6">Welcome to Kollege</h1>
        <p className="text-xl mb-8 max-w-2xl text-center">Connect, learn, and grow with like-minded individuals in our thriving community platform.</p>
        <Link to="community" ><button size="lg" className="bg-slate-950 text-lg font-semibold px-5 py-3 rounded-lg" >Explore Communities</button></Link>

        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Featured Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community, index) => (
              <CommunityCard flag={true /*true if want to display community about only*/ } key={community.comm_name} community={community} />
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

export default Home
