import React from 'react'
import { useUserStore } from '../store'

function Reply({reply,handleReplyDelete}) {

    const user=useUserStore(state=>state.user)

  return (
    <div key={1} className="flex space-x-3 bg-gray-600 rounded-lg p-3">
        {reply?.avatar_url ? <img src={ ` http://localhost:8080/images/${reply?.avatar_url}  ` } alt={`${reply?.firstname}'s avatar`} className="w-6 h-6 rounded-full" /> :
        <div className='ml-5 font-medium h-fit text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{reply?.firstname[0]}</div>}
        <div className='w-full'>
            <div className="flex justify-between items-center ">
                <span className="font-semibold text-sm">{ reply?.firstname+" "+reply?.lastname }</span>
                <span className="text-xs text-gray-400">{ new Date(reply.commented_on).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }</span>
            </div>
            <p className="text-sm mt-1">{reply?.comment}</p>
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
            { user.username==reply.username && <button onClick={handleReplyDelete} className="hover:text-white">Delete</button> }
            {/* <button className="hover:text-white">Like</button>
            <span>·</span>
            <span>{6} likes</span> */}
            </div>
        </div>
    </div>
  )
}

export default Reply