import express from "express";
import { connection } from "./DB/DBConnection.js";
import authRouter  from "./routers/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./utils/hashPassword.js"
import postRouter from "./routers/PostRoute.js";

const app = express();
const PORT = 4000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth" , authRouter); 
app.use("/api/v1/post" , postRouter); 


app.listen(PORT , ()=>{
    connection();
    console.log(`server connected Port no. ${PORT}`);
});