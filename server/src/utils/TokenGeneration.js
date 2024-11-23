
import jwt from "jsonwebtoken"

const generateAccessToken=function(username,email){
    return jwt.sign(
        {
            username,
            email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            algorithm: "HS256"
        }
    )
}

const generateRefreshToken=function(user_id){
    return jwt.sign(
        {
            user_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export {generateAccessToken,generateRefreshToken}
