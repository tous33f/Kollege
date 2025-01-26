import React, { useEffect,useState,useRef } from 'react'
import axios from "axios"
import { io } from 'socket.io-client';

let socket=null;

function ChatArea({recv,setSelectedUser}) {

  const handleRightClick=(e)=>{
    if(e.type=='contextmenu'){
      setSelectedUser(null)
    }
  }

    const dummy = useRef();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [send,setSend]=useState(null)

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if(!socket){
          return;
        }
        axios.post(`http://localhost:8080/ch/`,{recv:recv?.user_id,message:newMessage},{withCredentials: true})
        .then( ({data})=>{
          if(data?.success){
            setMessages([...messages, data?.data]);
            socket.emit("chat",data?.data)
            setNewMessage('');
          }
          else{
            throw new Error(data?.message)
          }
        } )
        .catch( ({response})=>{
          console.log(response?.data?.message)
        } )
      };

    useEffect(()=>{
      axios.get(`http://localhost:8080/u/`,{withCredentials:true})
      .then( ({data})=>{
        if(data?.success){
          setSend(data?.data)
          if(!socket){
            socket=io(`http://localhost:8080/?recv=${recv?.user_id}&send=${data?.data?.user_id}`,{path: "/p2p"})
            socket.on("chat",(msg)=>{
              setMessages(prev=>[...prev,msg])
            })
          }
        }
        else{
          throw new Error(data?.message)
        }
      } )
      .catch( ({response})=>{
        console.log(response?.data?.message)
      } )
      axios.get( `http://localhost:8080/ch/${recv?.user_id}`,{withCredentials:true} )
      .then( ({data})=>{
      if(data?.success){
          setMessages(data?.data)
      }
      else{
          throw new Error(data?.message)
      }
      } )
      .catch( ({response})=>{
        console.log(response?.data?.message)
      } )
      return ()=>{
        if(socket){
          socket.disconnect()
          socket=null;
        }
      }
    },[])

    useEffect(()=>{
      if(dummy){
        dummy.current.scrollIntoView();
      }
    },[messages])

  return (
    <div className="flex-1 flex flex-col bg-slate-900" onClick={handleRightClick} onContextMenu={handleRightClick} >
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="space-y-4">
                    {messages.map( (message,index) => (
                      <div
                        key={message.message_id}
                        className={`flex ${
                          message.send === send?.user_id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.send === send?.user_id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {message?.message} <span className='ml-3 text-[10px] text-slate-200 opacity-65' > { new Date(message?.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } </span>
                        </div>
                      </div>
                    ))}
                    <div ref={dummy} ></div>
                  </div>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-800">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            
          </div>
  )
}

export default ChatArea