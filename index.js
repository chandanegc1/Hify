import express from "express";
import { connection } from "./DB/DBConnection.js";
import router from "./routers/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./utils/hashPassword.js"

const app = express();
const PORT = 3000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/" , router); 


app.listen(PORT , ()=>{
    connection();
    console.log(`server connected Port no. ${PORT}`);
});