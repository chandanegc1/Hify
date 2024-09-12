import Post from "../model/post.js";
import User from "../model/user.js";

export const PostCreate = async (req, res) => {
    try {
        const { caption, post, userName } = req.body;
        const postData = new Post({ caption, post, userName , owner:req.user.userId});
        const postSave = await postData.save();
        const user = await User.findById(req.user.userId);
        user.posts.push(postSave._id);
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
        console.log(postn);
    
        if (String(postn.owner) !== String(req.user.userId)) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }
        await postn.deleteOne();
    
        const user = await User.findById(req.user.userId);
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
  
      if (String(post.owner._id) !== String(req.user.userId)) {
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
  
      let isTrue = false;
      for(let i = 0 ; i<post.likes.length ;i++){
          isTrue = (post.likes[i]._id == req.user.userId);
      }

      if (isTrue) {
        const index = post.likes.indexOf(req.user.userId);
  
        post.likes.splice(index, 1);
        await post.save();
  
        return res.status(200).json({
          success: true,
          message: "Post Unliked",
        });
      } else {
        post.likes.push(req.user.userId);
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
      const loggedInUser = await User.findById(req.user.userId);
      console.log(loggedInUser);
      if (!userToFollow) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      if (loggedInUser.following.includes(userToFollow._id)) {
        const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
        const indexfollows = userToFollow.followers.indexOf(loggedInUser.userId);
  
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
      const user = await User.findById('664f0085c66d5ab4bd5f2dc8');
     
      const posts = await Post.find({
        owner: {
          $in: user.following,
        },
      }).populate({
        path:"owner",
        select:"name avatar"
      })
      console.log(posts)
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      console.log(error)
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
        if (String(item.user) === String(req.user.userId)) {
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
          userName: req.user.userId,
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
  
      console.log(String(post.owner) ===String(req.user.userId))
      if (String(post.owner) === String(req.user.userId)) {
        // if (req.body.comment_id == undefined) {
        //   return res.status(401).json({
        //     success: false,
        //     message: "comment id required",
        //   });
        // }
  
        post.comments.forEach((item, index) => {
          if (String(item._id) === String(req.body.id)) {
            console.log(item._id)
            return post.comments.splice(index, 1);
          }
        });
      } else {
        post.comments.forEach((item, index) => {
          if (String(item.userName) === String(req.user.userId)) {
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