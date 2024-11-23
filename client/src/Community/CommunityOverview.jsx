import React from 'react'

function CommunityOverview() {
    const communityData = {
        name: "Tech Enthusiasts",
        type: "Public",
        description: "A place for tech lovers to discuss the latest innovations and share ideas. Join our vibrant community to stay up-to-date with cutting-edge technology, participate in exciting projects, and connect with like-minded individuals from around the globe.",
        members: 15000,
        image: "https://via.placeholder.com/1200x300",
        tags: ["Technology", "Innovation", "Networking"]
      }

    return (
        <>
        <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <img
            src="https://g-p1v8sxx1jj4.vusercontent.net/placeholder.svg?height=100&width=200" 
            alt={`${communityData.name} banner`} 
            width={400} 
            height={200} 
            className="w-full h-32 object-cover"
        />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl text-slate-200 font-bold mb-2">{communityData.name}</h1>
                <div className="flex items-center space-x-2 mb-2">
                <p className='text-slate-900 bg-slate-200 rounded-2xl px-2 py-1 font-semibold text-xs hover:bg-gray-300 cursor-default' >{communityData.type}</p>

                  <span className="text-sm text-gray-400">{communityData.members.toLocaleString()} members</span>
                </div>
              </div>
              <button size="sm" className="bg-slate-950 text-slate-200 text-base font-semibold px-5 py-3 rounded-lg" >Join Community</button>

            </div>
            <p className="text-gray-300 mb-6">{communityData.description}</p>
            <div className="flex flex-wrap gap-2">
              {/* {communityData.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-gray-400 border-gray-600">
                  {tag}
                </Badge>
              ))} */}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-200">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Discussions</h2>
            <ul className="space-y-4">
              <li className="border-b border-gray-700 pb-2">
                <a href="#" className="hover:text-primary">Latest advancements in AI</a>
                <p className="text-sm text-gray-400">Started by John Doe • 2 days ago</p>
              </li>
              <li className="border-b border-gray-700 pb-2">
                <a href="#" className="hover:text-primary">The future of quantum computing</a>
                <p className="text-sm text-gray-400">Started by Jane Smith • 1 week ago</p>
              </li>
              <li>
                <a href="#" className="hover:text-primary">Cybersecurity best practices</a>
                <p className="text-sm text-gray-400">Started by Alice Johnson • 2 weeks ago</p>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <ul className="space-y-4">
              <li className="border-b border-gray-700 pb-2">
                <a href="#" className="hover:text-primary">Tech Talk: The Impact of 5G</a>
                <p className="text-sm text-gray-400">Date: July 15, 2023 • Virtual</p>
              </li>
              <li className="border-b border-gray-700 pb-2">
                <a href="#" className="hover:text-primary">Hackathon: Build for the Future</a>
                <p className="text-sm text-gray-400">Date: August 1-3, 2023 • Online</p>
              </li>
              <li>
                <a href="#" className="hover:text-primary">Workshop: Introduction to Blockchain</a>
                <p className="text-sm text-gray-400">Date: August 20, 2023 • In-person</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
        </>
    )
}

export default CommunityOverview