
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import axios from "axios";

export default function PostComment() {
  const { user } = useSelector((state) => state.auth);
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");   
  const [loading, setLoading] = useState(true);

  // Fetch post if missing (for direct URL visits)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with ID:", postId);
        const res = await axios.get(`http://13.232.47.103:8000/api/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!post) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [postId, post]);

 
  // Fetch comments when post is loaded
  useEffect(() => {
    if (!postId) return;

    console.log("Setting up socket listeners for post:", postId);

    // Connect socket if not connected
    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    // Small delay to ensure socket is connected
    const timer = setTimeout(() => {
             
      socket.emit("fetch_comments", postId); // Send as string UUID
    }, 100);

    // Listen for comments
    const handleLoadComments = (data) => {
      console.log("Received load_comments:", data);
      // Compare as strings since postId is UUID
      if (data.postId === postId) {
        console.log("Comments match post ID, updating:", data.comments);
        setComments(data.comments);
      } else {
        console.log("Post ID mismatch:", data.postId, "vs", postId);
      }
    };

    const handleError = (msg) => {
      console.error("Socket error:", msg);
      alert(msg);
    };

    socket.on("load_comments", handleLoadComments);
    socket.on("error_message", handleError);

    return () => {
      clearTimeout(timer);
      console.log("Cleaning up socket listeners");
      socket.off("load_comments", handleLoadComments);
      socket.off("error_message", handleError);
    };
  }, [postId]);

  // Send a new comment
  const handleComment = () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    if (!user || !user.id) {
      alert("You must be logged in to comment");
      return;
    }

    console.log("Sending comment:", {
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
    });

    socket.emit("add_comment", {
      post_id: postId, // Send as string UUID
      user_id: user.id,
      content: newComment.trim(),
    });

    setNewComment("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center p-4">
      <div className="w-full max-w-2xl border border-gray-800 p-6 rounded-2xl">
        {/* Post Section */}
        <div className="flex items-start space-x-3 mb-4">
          <img
            src={post.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-lg font-bold">{post.name || "User"}</h2>
            <p className="text-gray-400 text-xs">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="text-gray-200 mb-3 whitespace-pre-wrap">{post.content}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="rounded-2xl w-full object-cover max-h-96 mb-4"
          />
        )}

        <hr className="border-gray-800 my-6" />

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h3>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.comment_id}
                  className="flex space-x-3 border-l-2 border-gray-700 pl-4 py-2"
                >
                  <img
                    src={c.avatar || "/default-avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex items-start space-x-3 border-t border-gray-800 pt-4">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full mt-1"
            />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:border-sky-500 transition"
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-full transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}