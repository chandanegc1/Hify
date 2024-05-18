import express from "express";
import { PostCreate } from "../controller/PostController.js";

const router = express.Router();

router.post("/PostCreate" , PostCreate);
export default router;