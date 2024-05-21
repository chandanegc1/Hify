import express from "express";
import { DeletePost, PostCreate, addcomment, followUnfollow, getPostFollowing, likeunlikepost, updatecaption } from "../controller/PostController.js";

const router = express.Router();

router.post("/PostCreate" , PostCreate);
router.delete("/deletepost" , DeletePost);
router.put("/updatePost" , updatecaption);
router.get("/likeUnlike" , likeunlikepost);
router.get("/followunfollow" , followUnfollow);
router.get("/followingpost" , getPostFollowing);
router.post("/comment" , addcomment);
// router.delete("/comment" , deleteComment);
export default router; 