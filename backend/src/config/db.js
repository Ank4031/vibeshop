import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const db = async()=>{
    try{
        const mong = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        console.log("DB connection complete...");
        
    }catch(error){
        console.log("DB connection failed");
        console.log(error.message||"(-_-)");
        
    }
}

export default db