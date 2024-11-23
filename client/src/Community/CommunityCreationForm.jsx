import React, { useState, useRef } from 'react';

export default function CommunityCreationForm() {
  const [isPublic, setIsPublic] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');


  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create a New Community</h1>
        <form  className="space-y-6 bg-slate-800 p-8 rounded-lg shadow-lg">

        <div>
            <label htmlFor="communityURL" className="block text-sm font-medium text-slate-300 mb-2">
              Community Unique name for URL
            </label>
            <input
              type="text"
              id="communityURL"
              name="communityURL"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="communityName" className="block text-sm font-medium text-slate-300 mb-2">
              Community Name
            </label>
            <input
              type="text"
              id="communityName"
              name="communityName"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-300 mb-2">
              Short Description (30 words max)
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p className="text-sm text-slate-400 mt-1">
              {30 - shortDescription.trim().split(/\s+/).length} words remaining
            </p>
          </div>

          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium text-slate-300 mb-2">
              Full Description (300 words max)
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={6}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p className="text-sm text-slate-400 mt-1">
              {300 - fullDescription.trim().split(/\s+/).length} words remaining
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-300 mb-2">Community Type</span>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="communityType"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="communityType"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="form-radio text-slate-600 h-5 w-5"
                />
                <span className="ml-2">Private</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-300 mb-2">
              Community Banner Image
            </label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              className="hidden"
              onChange={() => console.log('File selected')}
            />
            <div className="mt-1 flex items-center">
                <input 
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="profile-picture" 
                type="file" 
                accept="image/*"
                />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 text-slate-300 rounded-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}