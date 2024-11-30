import React from 'react'

function PostCard({post,handleClick}) {
  return (
    <div key={post.post_id} className="bg-slate-800 rounded-lg p-6 cursor-pointer" onClick={handleClick} >
                {post.isPinned && (
                  <div className="flex justify-between items-center mb-4 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded">
                    <span>📌 Pinned</span>
                    <button className="text-sm">Hide</button>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  {(post.avatar_url)?<img src={` http://localhost:8080/images/${post.avatar_url} `} alt={`${post.firstname}'s avatar`} className="w-10 h-10 rounded-full" />:
                  <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{post.firstname[0]}</div>}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{post.firstname + " " + post.lastname}</h3>
                      <span className="text-slate-400 text-sm">{ (new Date(post.created_on)).toDateString() }</span>
                      <span className="text-slate-400">in</span>
                      <span className="text-blue-400">{post.tag_name}</span>
                    </div>
                    <h2 className="text-xl font-bold mt-2">{post.title}</h2>
                    <p className="mt-2 text-slate-300">
                      {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                    </p>
                    {post.content.length > 150 && (
                      <button className="text-blue-400 hover:text-blue-300 mt-2">Read more</button>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-slate-400 hover:text-slate">
                          <span>👍</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-slate-400 hover:text-slate">
                          <span>💬</span>
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {post.commenters.map((commenter, index) => (
                            <img key={index} src={commenter} alt="Commenter avatar" className="w-6 h-6 rounded-full border-2 border-slate-800" />
                          ))}
                        </div>
                        <span className="text-slate-400 text-sm">Last comment {post.lastComment}</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default PostCard