import {app} from "./app.js";
import { connect_db } from "./db/connection.js";
import { config } from "dotenv";

let con

try{
    config()
    con = await connect_db()
    app.listen(8080,()=>console.log(`App started listening on port 8080...`))
    }
catch(err){
    console.log(`Error starting server: ${err.message}`)
}

export {con}
