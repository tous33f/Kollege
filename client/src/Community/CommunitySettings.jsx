import React, { useState } from 'react';

// Mock data for demonstration
const members = [
  { id: 1, name: 'John Doe', role: 'Member', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', role: 'Moderator', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Bob Johnson', role: 'Admin', avatar: 'https://via.placeholder.com/40' },
];

const joinRequests = [
  { id: 1, name: 'Alice Brown', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Charlie Davis', avatar: 'https://via.placeholder.com/40' },
];

export default function CommunitySettings() {
  const [activeTab, setActiveTab] = useState('details');
  const [communityName, setCommunityName] = useState('Data Alchemy');
  const [communityDescription, setCommunityDescription] = useState('Your Community to Master the Fundamentals of Working with Data and AI — by Datalumina®');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">Community</a>
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">Classroom</a>
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">Calendar</a>
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">Members</a>
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">Leaderboards</a>
            <a href="#" className="px-3 py-4 text-gray-400 hover:text-white">About</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Community Settings</h1>

        <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <button
              className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Community Details
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'members' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              Manage Members
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Join Requests
            </button>
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="communityName" className="block text-sm font-medium text-gray-400 mb-2">
                Community Name
              </label>
              <input
                type="text"
                id="communityName"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="communityBanner" className="block text-sm font-medium text-gray-400 mb-2">
                Community Banner
              </label>
              <input
                type="file"
                id="communityBanner"
                accept="image/*"
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="communityDescription" className="block text-sm font-medium text-gray-400 mb-2">
                About Community
              </label>
              <textarea
                id="communityDescription"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <ul className="space-y-4">
              {filteredMembers.map(member => (
                <li key={member.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                    <span>{member.name}</span>
                  </div>
                  <div>
                    <select
                      value={member.role}
                      onChange={() => {}}
                      className="bg-gray-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Join Requests</h2>
            <ul className="space-y-4">
              {joinRequests.map(request => (
                <li key={request.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full" />
                    <span>{request.name}</span>
                  </div>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Accept
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-700">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Leave Community
          </button>
        </div>
      </div>
    </div>
  );
}