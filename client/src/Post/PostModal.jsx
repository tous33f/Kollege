import React, { useEffect, useRef } from 'react';

export default function PostModal({ post, onClose, isOpen }) {

  const modalRef=useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      document.body.style.overflow = 'hidden';
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto ">
      <div ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {post.avatar?<img 
              src={post.avatar} 
              alt={`${post.author}'s avatar`}
              className="w-10 h-10 rounded-full"
            />:
            <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{"T"}</div>}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{post.author}</h3>
                <span className="text-gray-400 text-sm">{post.time}</span>
                <span className="text-gray-400">in</span>
                <span className="text-blue-400">{post.category}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
          
          {post.image && (
            <div className="mt-4">
              <img
                src={post.image} 
                alt="Post attachment" 
                className="rounded-lg max-h-[400px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <span>👍</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <span>💬</span>
                <span>{post.totalcomments}</span>
              </button>
            </div>
            <button 
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              onClick={() => console.log('Jump to latest comment')}
            >
              Jump to latest comment
            </button>
          </div>
        </div>

          {/* Comments Section */}
        <div className="border-t border-gray-700 p-4">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-xs text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-400">
                    <button className="hover:text-white">Like</button>
                    <span>·</span>
                    <button className="hover:text-white">Reply</button>
                    <span>·</span>
                    <span>{comment.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
          <form className="flex space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}