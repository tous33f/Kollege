import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

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
import { verifyAuth } from "./middlewares/auth.middleware.js"

app.use("/u",userRoutes)
app.use("/c",communityRoutes)
app.use("/p",verifyAuth,postRoutes)
app.use("/t",verifyAuth,tagRoutes)
app.use("/l",verifyAuth,likeRoutes)
app.use("/r",verifyAuth,commentRoutes)

export {app}
