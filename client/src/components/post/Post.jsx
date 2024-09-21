import React, { useEffect, useState } from "react";
import "./post.css";
import axios from "axios";

const Post = () => {
  const [postData, setPostData] = useState([]);
  const [flag, setFlag] = useState(false);
  const userId = "66ebb8a9370829947f917278";
  // Fetch posts from the API
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/post/followingpost/${userId}`
      );
      if (res) {
        setPostData(res.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flag]);

  // Like/Unlike post handler
  const likeUnlikeHandler = async (postId) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/post/likeUnlike/${postId}`
      );
      if (res) {
        setFlag(!flag);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="post">
        <div className="container">
          {postData.map((item, index) => {
            const isLike = item.likes.some(
              (like) => like._id === "66ebb8a9370829947f917278"
            );

            return (
              <div key={index} className="single-post">
                <div className="post-header">
                  <img className="post-avatar" src="logo.png" alt="Avatar" />
                  <div className="caption">
                    <h3 className="post-username">{item.owner.name}</h3>
                    <p>{item.caption}</p>
                  </div>
                </div>
                <div className="post-image">
                  <img src={item.image.url || "post.png"} alt="Post" />
                </div>
                <div className="post-actions">
                  <button
                    className="post-like-button"
                    onClick={() => likeUnlikeHandler(item._id)}
                  >
                    {isLike ? "Dislike" : "Like"} ({item.likes.length})
                  </button>
                  <button className="post-comment-button">Comment</button>
                  <button className="post-share-button">Share</button>
                </div>
                <div className="post-comment-section">
                  <div className="post-comments">
                    <div className="post-comment">
                      <span className="post-comment-username">Commenter1:</span>
                      <span className="post-comment-text">
                        This is an amazing post!
                      </span>
                    </div>
                    <div className="post-comment">
                      <span className="post-comment-username">Commenter2:</span>
                      <span className="post-comment-text">I love it!</span>
                    </div>
                  </div>
                  <div className="post-add-comment">
                    <input
                      className="post-comment-input"
                      type="text"
                      placeholder="Add a comment..."
                    />
                    <button className="post-comment-submit">Submit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Post;
