
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserStore=create( devtools( 
    (set)=>({
        user: {username: "",email:"",avatar_url:""},
        setUser: (newUser)=>set({user: {username: newUser.username,email: newUser.email,avatar_url:newUser.avatar_url}})
    })
 ) )
