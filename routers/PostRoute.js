import express from "express";
import { DeletePost, PostCreate, addcomment, deleteComment, followUnfollow, getPostFollowing, likeunlikepost, updatecaption } from "../controller/PostController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.post("/PostCreate" , authenticateUser, PostCreate);
router.delete("/deletepost/:id" , authenticateUser, DeletePost);
router.put("/updatePost/:id" , authenticateUser, updatecaption);
router.get("/likeUnlike/:id" , authenticateUser, likeunlikepost);
router.get("/followunfollow/:id" , authenticateUser, followUnfollow);
router.get("/followingpost" , authenticateUser, getPostFollowing);
router.post("/comment/:id" , authenticateUser, addcomment);
router.delete("/deletecomment/:id" ,authenticateUser, deleteComment);
export default router;  