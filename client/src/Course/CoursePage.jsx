import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import VideoCreationForm from '../Video/VideoCreationForm';
import axios from 'axios';
import { toast } from 'react-toastify';

// 24GfgNtnjXc

export default function CoursePage() {

  const {comm_name,course_id}=useParams()
  let [lessons,setLessons]=useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(true);
  const [isVideoFormOpen,setIsVideoFormOpen]=useState(false);
  let [userCommunityInfo,setUserCommunityInfo]=useState({})
  const [course,setCourse]=useState({})
  const [key,setKey]=useState(-1)
  const [curKey,setCurKey]=useState(-1)

  useEffect(()=>{
    //course info
    axios.get(`http://localhost:8080/cr/${comm_name}/${course_id}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setCourse(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
    //videos
    axios.get(`http://localhost:8080/v/${comm_name}/${course_id}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        if(data?.data.length>0){
          setKey(data?.data.length)
          setCurKey(0)
          setLessons(data?.data)
          setCurrentLesson(data?.data[0])
        }
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
    //user community info
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

  const handleDelete=()=>{
    axios.post(`http://localhost:8080/v/delete`,{video_id: currentLesson.video_id,comm_name},{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setLessons(prev=>prev.filter( val=>val.video_id==currentLesson?.video_id?false:true ));
        setCurrentLesson(null)
        setCurKey(prev=>prev-1)
        setKey(-1)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })
  }

  return (

      <div className="flex text-slate-200">

        {/* Video creation form  */}
        <VideoCreationForm 
        comm_name={comm_name} 
        isOpen={isVideoFormOpen} 
        onClose={()=>setIsVideoFormOpen(false)} 
        course_id={course_id}
        setLessons={setLessons}
        />

        {/* Left Sidebar */}
        <div className="w-80 bg-slate-800 min-h-[calc(100vh-4rem)] p-6">

          <div>
            <div className='flex items-center justify-between py-4 cursor-pointer' onClick={()=>setProgress(prev=>!prev)} >
            <h3 className="text-lg font-semibold ">{course?.name}</h3>
            <p className={`w-3 inline-block ${!progress && "rotate-180"} `} >
                <svg viewBox="0 0 40 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.20503 0.498479C4.47811 0.223462 4.92268 0.222676 5.19673 0.496727L19.505 14.805C19.7784 15.0784 20.2216 15.0784 20.495 14.805L34.8033 0.496728C35.0773 0.222677 35.5219 0.223462 35.795 0.498479L39.5085 4.23836C39.7802 4.51201 39.7795 4.95388 39.5068 5.22656L20.495 24.2384C20.2216 24.5117 19.7784 24.5117 19.505 24.2384L0.49323 5.22656C0.220545 4.95388 0.219764 4.51201 0.491483 4.23836L4.20503 0.498479Z"></path></svg>
            </p>
            </div>

            { progress && <div>
            <ul className="space-y-2">
              {lessons.map((lesson,index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    curKey === index 
                      ? 'bg-blue-500/10 text-blue-500' 
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setCurrentLesson(lesson)
                    setCurKey(index)
                  } }
                >
                  {lesson.title}
                </li>
              ))}
            </ul>
          </div>}

            { userCommunityInfo?.info?.role!="Member" && <div className="mt-6">
                <button onClick={()=>setIsVideoFormOpen(true)} 
                className="w-full bg-slate-900 text-slate-200 font-medium py-2 px-4 rounded-md hover:bg-slate-950 transition duration-200">
                Add a new video
                </button>
            </div>}

          </div>
        </div>
{ lessons.length>0 && currentLesson &&
(        //{/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
              <button onClick={handleDelete} className="p-2 hover:bg-slate-800 rounded-full">
              <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${currentLesson?.video_url}`}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Lesson Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Lesson Summary:</h3>
              <p className="text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button 
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                disabled={curKey === 0}
                onClick={() => {
                  const prevLesson = lessons[curKey-1];
                  if (prevLesson){
                    setCurrentLesson(prevLesson);
                    setCurKey(prev=>prev-1)
                  }
                }}
              >
                Previous Lesson
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={curKey==key-1}
                onClick={() => {
                  const nextLesson = lessons[curKey+1];
                  if (nextLesson){
                    setCurrentLesson(nextLesson);
                    setCurKey(prev=>prev+1);
                  }
                }}
              >
                Next Lesson
              </button>
            </div>
          </div>
        </div>
)
}
      </div>
  );
}