import mysql from "mysql2/promise"

async function connect_db(){
    try{
        const con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: 3306
        })
        console.log(`Database connection established successfuly with host ${con.config.host}`)
        return con
    }
    catch(err){
        console.log(`Error connecting to database: ${err.message}`)
        process.exit(1)
    }
}

export {connect_db}