import express from "express";
import {Registration, currentUser, login, logout} from "../controller/userController.js";
const router = express.Router();

router.post("/registration" , Registration);
router.get("/login" , login);
router.get("/logout" , logout);
router.get("/current-user" , currentUser);

export default router;