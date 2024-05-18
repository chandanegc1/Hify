import Post from "../module/post.js";
import User from "../module/user.js";
import { ErrorHandler } from "../utils/ErrorHndler.js";

export const PostCreate = async (req, res) => {
    try {
        const { caption, post, userName } = req.body;
        const postData = new Post({ caption, post, userName , owner:req.user._id });
        await postData.save();
        const user = await User.findById(req.user._id);
        user.posts.push(post._id);
        await user.save();
        res.status(200).json({ success: true, post: postData });
    } catch (error) {
        res.status(501).json({
            sucess: false,
            message: error.message,
          });
    }
};

export const DeletePost = async(req , res)=>{
    try {
        const postn = await Post.findById(req.params.id);
        if (!postn) {
          return res.status(404).json({
            success: false,
            message: "Post not found",
          });
        }
    
        if (String(postn.owner) !== String(req.user._id)) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }
    
        await postn.deleteOne();
    
        const user = await User.findById(req.user._id);
    
        const index = user.posts.indexOf(req.params.id);
    
        user.posts.splice(index, 1);
        await user.save();
    
        return res.status(200).json({
          success: true,
          message: "Post deleted",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}

export const EditPost = async(req , res)=>{
    try {

    } catch (error) {
        
    }
}

export const LikePost = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const DislikePost = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const CreateComment = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const DeleteComment = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const EditComment = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const LikeComment = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const DislikeComment = async(req , res)=>{
    try {
        
    } catch (error) {
        
    }
}
