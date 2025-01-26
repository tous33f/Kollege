import React from 'react'
import { useState,useEffect,useRef } from 'react';
import { useUserStore } from '../store';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';

let socket=null;

function LivestreamPage() {

  const {comm_name}=useParams()


  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const chatContainerRef = useRef(null);
  const videoRef=useRef(null);
  let user=useUserStore(state=>state.user)

  useEffect(() => {
    if(!socket){
      socket=io(`http://localhost:8080/?comm_name=${comm_name}`,{path: "/live"})
      socket.on("chat_live",(msg)=>{
        setChatMessages(prev=>[...prev,msg])
      })
    }
    return ()=>{
      if(socket){
        socket.disconnect()
        socket=null;
      }
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        username: user?.username,
        message: newMessage.trim(),
        timestamp: new Date(),
      };
      socket.emit("chat_live",userMessage)
      setChatMessages(prevMessages => [...prevMessages, userMessage])
      setNewMessage('');
    }
  };

  const handleEndLivestream = () => {
    if(videoRef.current.srcObject){
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null; 
      setIsCameraEnabled(false)
      setIsAudioEnabled(false)
    }
    console.log("Ending livestream");
  };

  const toggleCamera = () => {
    if (isCameraEnabled) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null; 
      setIsCameraEnabled(!isCameraEnabled);
    } else {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setIsCameraEnabled(!isCameraEnabled);
        })
        .catch(err => console.log(err.message));
    }
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
    console.log(`Screen sharing ${isScreenSharing ? 'stopped' : 'started'}`);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    console.log(`Audio ${isAudioEnabled ? 'muted' : 'unmuted'}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">

      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        <section className="flex-grow md:w-2/3">
          <div className="bg-black aspect-video mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            ></video>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-full ${
                  isCameraEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={toggleScreenSharing}
                className={`p-2 rounded-full ${
                  isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-full ${
                  isAudioEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                onClick={handleEndLivestream} disabled={ (isCameraEnabled || isAudioEnabled)?false:true }
                className={`p-2 bg-red-600 hover:bg-red-700 rounded-full`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Stream Information</h2>
            <p className="text-gray-400 mb-2">Your Stream Title</p>
            <p className="text-sm text-gray-500">
              Stream description goes here. You can provide details about your stream's content and schedule.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-red-500">{viewerCount} viewers</span>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                Edit Stream Info
              </button>
            </div>
          </div>
        </section>

        <section className="md:w-1/3 bg-gray-800 rounded-lg overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Live Chat</h2>
          </div>
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-2">
                <span className={`font-bold ${msg.username === user?.username ? 'text-green-400' : 'text-blue-400'}`}>
                  {msg.username}:
                </span>
                <p className="text-gray-300">{msg.message}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LivestreamPage