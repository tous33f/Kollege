import React from 'react'
import { useNavigate } from 'react-router'
import { useUserStore } from '../store'

function CourseCard({course}) {
  const navigate=useNavigate()

  return (
    <div 
     className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer">
        {(course.banner_url)?<img
            src={` http://localhost:8080/images/${course?.banner_url} `}
            alt={`${course?.name} banner`} 
            width={350} 
            height={180} 
            className="w-full h-32 object-cover"
        />:<img
        src="https://g-p1v8sxx1jj4.vusercontent.net/placeholder.svg?height=100&width=200" 
        alt={`${course?.name} banner`} 
        width={400} 
        height={200} 
        className="w-full h-44 object-cover"
        />
        }
        <div className="p-4 flex-col justify-between  mb-2 text-slate-200 ">
            <h3 className=" text-2xl font-semibold mb-2">{course?.name}</h3>
            <p className=' text-lg font-normal ' >{course?.about}</p>
        </div>
    </div>
  )
}

export default CourseCard
