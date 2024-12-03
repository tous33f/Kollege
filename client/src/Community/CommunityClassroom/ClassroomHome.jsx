import React, { useEffect, useState } from 'react'
import CourseCard from '../../Course/CourseCard'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

function ClassroomHome() {

  let [courses,setCourses]=useState([])
  let [userCommunityInfo,setUserCommunityInfo]=useState({})


  const {comm_name}=useParams()

  useEffect(()=>{
    axios.get(`http://localhost:8080/cr/${comm_name}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setCourses(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.message)
    })
    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setUserCommunityInfo(data.data)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.message)
    })
  },[])

  return (

    <div className=' flex-grow flex flex-col items-center justify-start px-6 py-12 text-slate-200'>
        <h1 className="text-4xl font-bold mb-6">Discover Courses</h1>{ userCommunityInfo && userCommunityInfo?.info?.role!="Member" && 
        <p className="text-xl mb-8 max-w-2xl text-center">or <Link className='text-orange-400 font-bold' to="create_course" >create a new course</Link> </p>
        }
        <div className="w-full max-w-7xl ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Link to={`${course?.course_id}`}> <CourseCard key={course?.course_id} course={course} /> </Link>
            ))}
          </div>
        </div>
    </div>
  )
}

export default ClassroomHome