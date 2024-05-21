import express from "express";
import {Registration, deleteuser, getAllUser, getUserPrfl, login, logout, updateUserPrfl} from "../controller/userController.js";
import {authenticateUser} from "../middleware/authentication.js" 
const router = express.Router();

router.post("/registration" , Registration);
router.get("/login" , login);
router.get("/logout" ,authenticateUser, logout);
router.get("/current/:id" , authenticateUser ,getUserPrfl);
router.get("/all" , authenticateUser , getAllUser);
router.put("/update" ,authenticateUser, updateUserPrfl);
router.get("/delete/:id" ,authenticateUser , deleteuser);

export default router; 