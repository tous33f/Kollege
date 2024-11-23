
import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router';
import PostModal from '../Post/PostModal';
import CommunitySidebar from './CommunitySidebar';
import PostCreationForm from '../Post/PostCreationForm';

const posts = [
    {
      id: 1,
      author: "Dave Ebbelaar",
      avatar: null,
      time: "20d ago",
      category: "Wins",
      isPinned: false,
      title: "Introducing: The GenAI Launchpad 🚀",
      image: "https://g-p1v8sxx1jj4.vusercontent.net/placeholder.svg?height=100&width=200",
      content: "After two years of building with GenAI, here's what I wish I'd had from day one... This has been a long time in the making, and I'm excited to finally pull back the curtain on",
      likes: 94,
      totalcomments: 74,
      commenters: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      comments: [
        {
          id: 1,
          author: "Jane Doe",
          avatar: "https://via.placeholder.com/40",
          content: "This is exactly what I've been looking for! Can't wait to get started.",
          timestamp: "2 hours ago",
          likes: 5
        },
        // More comments...
      ],
      lastComment: "1d ago"
    },
    {
      id: 2,
      author: "Dave Ebbelaar",
      avatar: null,
      time: "Jul '23",
      category: "Announcements",
      isPinned: false,
      title: "Welcome to Data Alchemy - Start Here",
      content: "Welcome to Data Alchemy! This is your starting point for mastering the fundamentals of working with data and AI. In this post, we'll cover the essentials you need to know to get started on your journey.",
      likes: 150,
      totalcomments: 42,
      commenters: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      lastComment: "2d ago"
    }
  ];
  

function CommunityHome() {

  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  return (
    <>

      {/* Post Model  */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Post Creation Form  */}
      {isPostFormOpen && (
        <PostCreationForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onSubmit={(postData) => {
          // Handle the post submission here
          console.log(postData);
          setIsPostFormOpen(false);
        }}
        />
      )}
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Input */}
            <div onClick={() => setIsPostFormOpen(true)} className="cursor-pointer bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-4">
              {(false)?<img src={"/"} a className="rounded-full" />:
                  <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{"T"}</div>}
                <div
                  placeholder="Write something"
                  className="bg-slate-700 text-slate-300 rounded-lg px-4 py-2 w-full "
                >Write something</div>
              </div>
            </div>

            {/* Upcoming Event */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-center">
                📅 Data Freelancer Q&A Call is happening in 5 hours
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button className="bg-slate-700 px-4 py-2 rounded-full text-slate">All</button>
              <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-700">General</button>
              <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-700">🏆 Wins</button>
              <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-700">💡 Help</button>
              <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-700">📚 Recommendations</button>
              <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-700">😊 Fun</button>
            </div>

            {/* Posts */}
            {posts.map(post => (
              <div key={post.id} className="bg-slate-800 rounded-lg p-6 cursor-pointer" onClick={() => setSelectedPost(post)} >
                {post.isPinned && (
                  <div className="flex justify-between items-center mb-4 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded">
                    <span>📌 Pinned</span>
                    <button className="text-sm">Hide</button>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  {(post.avatar)?<img src={post.avatar} alt={`${post.author}'s avatar`} className="rounded-full" />:
                  <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{"T"}</div>}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{post.author}</h3>
                      <span className="text-slate-400 text-sm">{post.time}</span>
                      <span className="text-slate-400">in</span>
                      <span className="text-blue-400">{post.category}</span>
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
                          <span>{post.totalcomments}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {post.commenters.map((commenter, index) => (
                            <img key={index} src={commenter} alt="Commenter avatar" className="w-6 h-6 rounded-full border-2 border-slate-800" />
                          ))}
                        </div>
                        <span className="text-slate-400 text-sm">Last comment {post.lastComment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

    </>
  )
}

export default CommunityHome
