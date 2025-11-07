import app from "./app.js"
import db from "./config/db.js"
import dotenv from "dotenv"
dotenv.config()

db()
.then(
    app.listen(process.env.PORT||3000,()=>{
        console.log("[*] server started on: ",3000);
    })
)
.catch((e)=>{
    console.log("database connect error");
})