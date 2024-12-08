import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"

const app=express()

// middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({
    limit: '16kb'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use(express.static("public"))

app.use(cookieParser())

import userRoutes from "./routes/user.routes.js"
import communityRoutes from "./routes/community.routes.js"
import postRoutes from "./routes/post.routes.js"
import tagRoutes from "./routes/tag.routes.js"
import likeRoutes from "./routes/like.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import replyRoutes from "./routes/reply.routes.js"
import eventRoutes from "./routes/event.routes.js"
import courseRoutes from "./routes/course.routes.js"
import videoRoutes from "./routes/video.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import { verifyAuth } from "./middlewares/auth.middleware.js"

app.use("/u",userRoutes)
app.use("/c",communityRoutes)
app.use("/p",verifyAuth,postRoutes)
app.use("/t",verifyAuth,tagRoutes)
app.use("/l",verifyAuth,likeRoutes)
app.use("/r",verifyAuth,commentRoutes)
app.use("/rc",verifyAuth,replyRoutes)
app.use("/e",verifyAuth,eventRoutes)
app.use("/cr",verifyAuth,courseRoutes)
app.use("/v",verifyAuth,videoRoutes)
app.use("/ch",verifyAuth,chatRoutes)

let server=http.createServer(app)

//websocket server
import {Server} from "socket.io"

let io=new Server(server,{cors: {origin: "http://localhost:5173",methods: ["GET","POST"]}})

io.on("connection",(socket)=>{
    let {send,recv}=socket.handshake.query
    // console.log(` ${send} connected`)
    if(socket.rooms.has(`${send}:${recv}`)){
        socket.join(`${recv}:${send}`)
    }
    else{
        socket.join(`${send}:${recv}`)
    }

    socket.on("chat",(msg)=>{
        let {send,recv}=msg;
        // console.log(msg)
        if(socket.rooms.has(`${send}:${recv}`)){
            socket.to(`${recv}:${send}`).emit("chat",msg)
        }
        else{
            socket.to(`${send}:${recv}`).emit("chat",msg)
        }
    })

    // socket.on("disconnect",()=>console.log(` ${send} disconnected`))
})

export {server as app}
