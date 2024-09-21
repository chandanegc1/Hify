import Post from "../model/post.js";
import User from "../model/user.js";

//Create post
export const PostCreate = async (req, res) => {
  try {
    const { caption, post, image } = req.body;
    const owner = req.params.id;
    if (!owner) {
      res.status(501).json({
        sucess: false,
        message: "Post not created because of user not identify..",
      });
    }
    const user = await User.findById(owner);
    if (!user) {
      res.status(501).json({
        sucess: false,
        message: "User not available in dataBase",
      });
    }
    const postData = new Post({ caption, post, owner, image });
    const postSave = await postData.save();

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

//Get post
export const getPostFollowing = async (req, res) => {
  try {
    const owner = req.params.id;
    const user = await User.findById(owner);
    if (!user) {
      res.status(501).json({
        sucess: false,
        message: "User not available in database..",
      });
    }

    const posts = await Post.find({
      owner: { $in: user.following },
    })
      .populate({
        path: "owner",
        select: "name avatar",
      })
      .populate({
        path: "likes.owner",
        select: "name avatar",  // Populate prblm
      });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete post
export const DeletePost = async (req, res) => {
  try {
    const postn = await Post.findById(req.params.id);
    if (!postn) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

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
};

// Update Post titles
export const updatecaption = async (req, res) => {
  try {
    const post = await Post.findById("66eef5608d5bd1fbe80e091c");

    if (!post) {
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });
    }
    const owner = req.params.id;
    if (String(post.owner._id) !== String(owner)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized ",
      });
    }

    post.caption = req.body.caption;
    const updatedData = await post.save();
    res.status(200).json({
      success: true,
      message: "Caption updated",
      data:updatedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Like and Dislike Post
export const likeunlikepost = async (req, res) => {
  try {
    const postId = req.params.id; //req.params.id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(500).json({
        success: false,
        message: "Post not found",
      });
    }

    const owner = "66ebb8a9370829947f917278";
    let isTrue = false;
    for (let i = 0; i < post.likes.length; i++) {
      isTrue = post.likes[i]._id == owner;
    }

    if (isTrue) {
      const index = post.likes.indexOf(owner);

      post.likes.splice(index, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      post.likes.push(owner);
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


//Follow and unfollow user
export const followUnfollow = async (req, res) => {
  try {
    const userToFollow = await User.findById("66ebe083eee06d2d97b15178"); //req.id
    if(!userToFollow){
      res.status(501).json({
        sucess: false,
        message: "Followed user not found",
      });
    }

    const owner = req.params.id;
    const loggedInUser = await User.findById(owner);
    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "Logged user not found...",
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


//Add comments
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

//delete comments
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });
    }

    console.log(String(post.owner) === String(req.user.userId));
    if (String(post.owner) === String(req.user.userId)) {
      // if (req.body.comment_id == undefined) {
      //   return res.status(401).json({
      //     success: false,
      //     message: "comment id required",
      //   });
      // }

      post.comments.forEach((item, index) => {
        if (String(item._id) === String(req.body.id)) {
          console.log(item._id);
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
