import express from "express";
import {Registration, deleteuser, getAllUser, getUserPrfl, login, logout, updateUserPrfl} from "../controller/userController.js";
const router = express.Router();

router.post("/registration" , Registration);
router.get("/login" , login);
router.get("/logout" , logout);
router.get("/current/:id" , getUserPrfl);
router.get("/all" , getAllUser);
router.put("/update" , updateUserPrfl);
router.get("/delete/:id" , deleteuser);

export default router; 