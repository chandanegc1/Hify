import Post from "../module/post.js";
import User from "../module/user.js";

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

export const updatecaption = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(401).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (String(post.owner._id) !== String(req.user._id)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized ",
        });
      }
  
      post.caption = req.body.caption;
      await post.save();
      res.status(200).json({
        success: true,
        message: "Caption updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const likeunlikepost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
          return res.status(500).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);
  
        post.likes.splice(index, 1);
        await post.save();
  
        return res.status(200).json({
          success: true,
          message: "Post Unliked",
        });
      } else {
        post.likes.push(req.user._id);
        await post.save();

        return res.status(200).json({
          success: true,
          message: "Post Liked",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const followUnfollow = async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      const loggedInUser = await User.findById(req.user._id);
  
      if (!userToFollow) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      if (loggedInUser.following.includes(userToFollow._id)) {
        const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
        const indexfollows = userToFollow.followers.indexOf(loggedInUser._id);
  
        loggedInUser.following.splice(indexfollowing, 1);
        userToFollow.followers.splice(indexfollows, 1);
  
        await loggedInUser.save();
        await userToFollow.save();
  
        res.status(200).json({
          success: true,
          message: "User Unfollowed",
        });
      } else {
        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);
  
        await loggedInUser.save();
        await userToFollow.save();
  
        res.status(200).json({
          success: true,
          message: "User Followed",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const getPostFollowing = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const posts = await Post.find({
        owner: {
          $in: user.following,
        },
      });
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const addcomment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(401).json({
          success: false,
          message: "Post not found",
        });
      }
  
      // checking if comment is already exists then add that comment
      let commentIndex = -1;
  
      post.comments.forEach((item, index) => {
        if (String(item.user) === String(req.user._id)) {
          commentIndex = index;
        }
      });
  
      if (commentIndex !== -1) {
        post.comments[commentIndex].comment = req.body.comment;
  
        await post.save();
        return res.status(200).json({
          success: true,
          message: "Comment added",
        });
      } else {
        post.comments.push({
          user: req.user._id,
          comment: req.body.comment,
        });
        await post.save();
      }
  
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(401).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (String(post.owner) === String(req.user._id)) {
        if (req.body.comment_id == undefined) {
          return res.status(401).json({
            success: false,
            message: "comment id required",
          });
        }
  
        post.comments.forEach((item, index) => {
          if (String(item._id) === String(req.body.id)) {
            return post.comments.splice(index, 1);
          }
        });
      } else {
        post.comments.forEach((item, index) => {
          if (String(item.user) === String(req.user._id)) {
            return post.comments.splice(index, 1);
          }
        });
  
        await post.save();
      }
      res.status(200).json({
        success: true,
        message: "Comment deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

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
