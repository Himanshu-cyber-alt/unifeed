
import React, { useEffect, useState } from "react";
import { MessageCircle, Repeat2, Heart, Share2, Trash2, Link, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Post({ post }) {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [repostedByUser, setRepostedByUser] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const name = post?.name || "User";
  const username = name.toLowerCase().replace(/\s+/g, "");
  const avatarUrl = post?.avatar;
  const imageUrl = post?.image_url || post?.image || null;

  // Generate the post URL
  const postUrl = `${window.location.origin}/post/${post?.post_id}`;

  // 🔹 Fetch comments
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_comments", post.post_id);

    const handleLoadComments = ({ postId, comments }) => {
      if (postId === post.post_id) setComments(comments);
    };

    socket.on("load_comments", handleLoadComments);
    return () => socket.off("load_comments", handleLoadComments);
  }, [post?.post_id]);

  // 🔹 Fetch likes for this post
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_likes", post.post_id);

    const handleLikes = ({ postId, likes, likedBy }) => {
      if (postId === post.post_id) {
        setLikes(likes);
        setLikedByUser(likedBy?.includes(user?.id));
      }
    };

    socket.on("load_likes", handleLikes);
    return () => socket.off("load_likes", handleLikes);
  }, [post?.post_id, user?.id]);

  // 🔹 Fetch reposts for this post
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_reposts", post.post_id);

    const handleReposts = ({ postId, reposts, repostedBy }) => {
      if (postId === post.post_id) {
        setReposts(reposts);
        setRepostedByUser(repostedBy?.includes(user?.id));
      }
    };

    socket.on("load_reposts", handleReposts);
    return () => socket.off("load_reposts", handleReposts);
  }, [post?.post_id, user?.id]);

  // 🔹 Like/unlike handler
  const updateLikes = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    socket.emit("update_like", {
      post_id: post.post_id,
      user_id: user.id,
    });
  };

  // 🔹 Repost handler
  const toggleRepost = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    socket.emit("toggle_repost", {
      post_id: post.post_id,
      user_id: user.id,
    });
  };

  // 🔹 Delete post handler
  const handleDelete = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    setConfirmOpen(true);
  };

  // 🔹 Confirm delete
  const confirmDelete = () => {
    socket.emit("delete_post", { post_id: post.post_id, user_id: user.id });
    setConfirmOpen(false);
  };

  // 🔹 Navigate to profile
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (post?.user_id) {
      navigate(`/profile/${post.user_id}`);
    }
  };

  // 🔹 Copy URL to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareModal(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 🔹 Share button handler
  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
      <div
        className="p-4 hover:bg-gray-950 transition cursor-pointer border-b border-gray-800"
        onClick={() => navigate(`/post/${post.post_id}`, { state: { post } })}
      >
        {/* Repost Indicator */}
        {post?.post_type === 'repost' && post?.reposted_by_name && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2 ml-12">
            <Repeat2 className="w-4 h-4" />
            <span>{post.reposted_by_name} reposted</span>
          </div>
        )}
        
        <div className="flex items-start space-x-3 relative">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-800 cursor-pointer hover:opacity-80 transition"
            onClick={handleProfileClick}
          />

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span 
                className="font-semibold text-white hover:underline cursor-pointer"
                onClick={handleProfileClick}
              >
                {name}
              </span>
              <span 
                className="text-gray-500 text-sm hover:underline cursor-pointer"
                onClick={handleProfileClick}
              >
                @{username}
              </span>
              <span className="text-gray-500 text-sm">
                ·{" "}
                {post?.created_at
                  ? new Date(post.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>

            {post?.content && (
              <p className="text-gray-100 mt-1 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Post"
                  className="rounded-2xl border border-gray-800 w-full object-cover max-h-96"
                />
              </div>
            )}

            {/* 🔹 Action buttons */}
            <div className="flex justify-between text-gray-500 mt-3 text-sm max-w-md">
              {/* Comments */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${post.post_id}`, { state: { post } });
                }}
                className="flex items-center space-x-2 hover:text-sky-500 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </button>

              {/* Repost */}
              <button
                onClick={toggleRepost}
                className={`flex items-center space-x-2 transition ${
                  repostedByUser ? "text-green-500" : "hover:text-green-500"
                }`}
              >
                <Repeat2
                  className={`w-4 h-4 ${
                    repostedByUser ? "text-green-500" : ""
                  }`}
                />
                <span>{reposts}</span>
              </button>

              {/* Likes */}
              <button
                onClick={updateLikes}
                className={`flex items-center space-x-2 transition ${
                  likedByUser ? "text-pink-500" : "hover:text-pink-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedByUser ? "fill-pink-500 text-pink-500" : ""
                  }`}
                />
                <span>{likes}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="hover:text-sky-500 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {user?.id === post?.user_id && (
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(false);
          }}
        >
          <div 
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Share Post</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareModal(false);
                }}
                className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Copy Link Option */}
            <div className="p-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-800 rounded-xl transition text-left"
              >
                <div className={`${copied ? "bg-green-500" : "bg-sky-500"} bg-opacity-20 p-3 rounded-full`}>
                  <Link className={`w-5 h-5 ${copied ? "text-green-500" : "text-sky-500"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {copied ? "Link copied!" : "Copy link"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {copied ? "You can now share it anywhere" : "Copy link to post"}
                  </p>
                </div>
                {copied && (
                  <div className="text-green-500 text-sm font-semibold">
                    ✓
                  </div>
                )}
              </button>
            </div>

            {/* URL Preview */}
            <div className="p-4 border-t border-gray-800">
              <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400 break-all">
                {postUrl}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setConfirmOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Post?</h3>
              <p className="text-gray-400 text-sm">
                This action cannot be undone. Are you sure you want to delete this post?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-4 border-t border-gray-800">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}