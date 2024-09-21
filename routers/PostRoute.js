import express from "express";
import { DeletePost, PostCreate, addcomment, deleteComment, followUnfollow, getPostFollowing, likeunlikepost, updatecaption } from "../controller/PostController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.post("/postCreate/:id" , PostCreate);
router.delete("/deletepost/:id" , DeletePost);
router.put("/updatePost/:id", updatecaption);
router.get("/likeUnlike/:id" , likeunlikepost);
router.get("/followunfollow/:id" , followUnfollow);
router.get("/followingpost/:id" , getPostFollowing);
router.post("/comment/:id" , addcomment);
router.delete("/deletecomment/:id" , deleteComment);
export default router;  