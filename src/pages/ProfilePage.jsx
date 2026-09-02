


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import { ArrowLeft, Calendar, Users, Heart, MessageCircle, Repeat2, Home, User, LogOut, Menu, X } from "lucide-react";
import Post from "./Post";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [repostedPosts, setRepostedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (!userId || !currentUser) {
      console.log("❌ Missing userId or currentUser");
      return;
    }

   
    
    socket.emit("fetch_profile", { userId, currentUserId: currentUser.id });
    socket.emit("fetch_user_posts", userId);
    socket.emit("fetch_user_likes", userId);
    socket.emit("fetch_user_reposts", userId);
    socket.emit("fetch_user_comments", userId);
    socket.emit("fetch_followers", userId);
    socket.emit("fetch_following", userId);
    socket.emit("fetch_suggested_users");

    const handleLoadProfile = (data) => {
      console.log("📥 Received profile data:", data);
      if (data.error) {
        console.error("Profile error:", data.error);
        return;
      }
      setProfileUser(data.user);
      setStats(data.stats);
      setIsFollowing(data.isFollowing);
    };

    const handleLoadPosts = (data) => {
      console.log("📥 Received posts:", data.length);
      setPosts(data);
    };
    const handleLoadLikes = (data) => {
      console.log("📥 Received likes:", data.length);
      setLikedPosts(data);
    };
    const handleLoadReposts = (data) => {
      console.log("📥 Received reposts:", data.length);
      setRepostedPosts(data);
    };
    const handleLoadComments = (data) => {
      console.log("📥 Received comments:", data.length);
      setComments(data);
    };
    const handleLoadFollowers = (data) => {
      console.log("📥 Received followers:", data.length);
      setFollowers(data);
    };
    const handleLoadFollowing = (data) => {
      console.log("📥 Received following:", data.length);
      setFollowing(data);
    };
    const handleLoadSuggestedUsers = (data) => {
      console.log("📥 Received suggested users:", data.length);
      setSuggestedUsers(data);
    };

    socket.on("load_profile", handleLoadProfile);
    socket.on("load_user_posts", handleLoadPosts);
    socket.on("load_user_likes", handleLoadLikes);
    socket.on("load_user_reposts", handleLoadReposts);
    socket.on("load_user_comments", handleLoadComments);
    socket.on("load_followers", handleLoadFollowers);
    socket.on("load_following", handleLoadFollowing);
    socket.on("load_suggested_users", handleLoadSuggestedUsers);

    return () => {
      socket.off("load_profile", handleLoadProfile);
      socket.off("load_user_posts", handleLoadPosts);
      socket.off("load_user_likes", handleLoadLikes);
      socket.off("load_user_reposts", handleLoadReposts);
      socket.off("load_user_comments", handleLoadComments);
      socket.off("load_followers", handleLoadFollowers);
      socket.off("load_following", handleLoadFollowing);
      socket.off("load_suggested_users", handleLoadSuggestedUsers);
    };
  }, [userId, currentUser]);

  const handleFollowToggle = () => {
    if (!currentUser || !userId) return;
    socket.emit("toggle_follow", {
      follower_id: currentUser.id,
      following_id: userId,
    });
    setIsFollowing(!isFollowing);
    setStats((prev) => ({
      ...prev,
      followersCount: isFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    }));
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const username = profileUser.name?.toLowerCase().replace(/\s+/g, "") || "user";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* MOBILE SIDEBAR TOGGLE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-16 left-4 z-40 p-2 hover:bg-gray-900 rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

     
      <aside className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block fixed md:relative top-16 md:top-16 left-0 right-0 md:right-auto z-30 md:z-0 h-[calc(100vh-4rem)] w-full md:w-72 border-r border-gray-800 py-6 pr-4 overflow-y-auto bg-black md:bg-transparent`}>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => {
              navigate("/home");
              setSidebarOpen(false);
            }} 
            className="flex items-center gap-4 text-xl font-bold px-4 py-3 bg-gray-800 text-white rounded-lg w-full"
          >
            <Home className="w-7 h-7 flex-shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button 
            onClick={() => {
              navigate(`/profile/${currentUser?.id}`);
              setSidebarOpen(false);
            }} 
            className="flex items-center gap-4 text-xl font-bold px-4 py-3 hover:bg-gray-800 text-gray-300 rounded-lg transition w-full"
          >
            <User className="w-7 h-7 flex-shrink-0" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </nav>
        <hr className="border-gray-800 my-4"/>
        <div className="px-4 text-gray-500 font-semibold text-sm">Suggested accounts</div>
        <div className="flex flex-col gap-2 mt-3">
          {suggestedUsers.map(sUser => (
            <div
              key={sUser.user_id}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => {
                navigate(`/profile/${sUser?.user_id}`);
                setSidebarOpen(false);
              }}
            >
              <img  
                src={sUser.avatar}
                alt={sUser.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{sUser.username}</p>
                <p className="text-xs text-gray-400 truncate">{sUser.name}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            handleLogout();
            setSidebarOpen(false);
          }}
          className="w-full mt-6 text-left flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-lg p-2 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <div className="flex-1 w-full md:max-w-2xl border-x border-gray-800">
          {/* Header */}
          <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800 z-10">
            <div className="flex items-center space-x-2 md:space-x-4 p-3 md:p-4">
              <button
                onClick={() => navigate(-1)}
                className="hover:bg-gray-900 rounded-full p-2 transition flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold truncate">{profileUser.name}</h1>
                <p className="text-xs md:text-sm text-gray-500">{stats.postsCount} posts</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="border-b border-gray-800">
            <div className="h-32 md:h-48 bg-gradient-to-r from-sky-900 to-blue-900"></div>

            <div className="px-3 md:px-4 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 -mt-12 md:-mt-16 mb-4">
                <img
                  src={profileUser.avatar}
                  alt="Profile"
                  className="w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-black object-cover flex-shrink-0"
                />
                {!isOwnProfile && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 md:px-6 py-2 rounded-full font-semibold transition text-sm md:text-base flex-shrink-0 ${
                      isFollowing
                        ? "bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold truncate">{profileUser.name}</h2>
                  <p className="text-gray-500 text-sm">@{username}</p>
                </div>

                {profileUser.bio && (
                  <p className="text-sm md:text-base text-gray-100 line-clamp-3">{profileUser.bio}</p>
                )}

                <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    Joined {new Date(profileUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>

                <div className="flex space-x-4 md:space-x-6 text-xs md:text-sm">
                  <button
                    onClick={() => setActiveTab("following")}
                    className="hover:underline whitespace-nowrap"
                  >
                    <span className="font-bold text-white">
                      {stats.followingCount}
                    </span>{" "}
                    <span className="text-gray-500">Following</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("followers")}
                    className="hover:underline whitespace-nowrap"
                  >
                    <span className="font-bold text-white">
                      {stats.followersCount}
                    </span>{" "}
                    <span className="text-gray-500">Followers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="border-b border-gray-800 flex overflow-x-auto scrollbar-hide">
            {["posts", "reposts", "likes", "comments", "followers", "following"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 md:py-4 text-center font-semibold transition relative whitespace-nowrap px-3 md:px-4 text-sm md:text-base flex-shrink-0 ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-500 hover:bg-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {activeTab === "posts" && (
              <div className="divide-y divide-gray-800">
                {posts.length > 0 ? (
                  posts.map((post, index) => <Post key={`${post.post_id}-${index}`} post={post} />)
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500 text-sm">
                    No posts yet
                  </div>
                )}
              </div>
            )}

            {activeTab === "reposts" && (
              <div className="divide-y divide-gray-800">
                {repostedPosts.length > 0 ? (
                  repostedPosts.map((post) => <Post key={post.post_id} post={post} />)
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <Repeat2 className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reposts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="divide-y divide-gray-800">
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => <Post key={post.post_id} post={post} />)
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <Heart className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No liked posts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="divide-y divide-gray-800">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 md:p-4 hover:bg-gray-950 transition cursor-pointer"
                      onClick={() => navigate(`/post/${comment.post_id}`)}
                    >
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <img
                          src={profileUser.avatar}
                          alt="Profile"
                          className="w-8 md:w-10 h-8 md:h-10 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                            <span className="font-semibold truncate">
                              {profileUser.name}
                            </span>
                            <span className="text-gray-500 hidden sm:inline">@{username}</span>
                            <span className="text-gray-500 hidden sm:inline">·</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-100 mt-1 text-sm break-words">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <MessageCircle className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="divide-y divide-gray-800">
                {followers.length > 0 ? (
                  followers.map((follower) => (
                    <div
                      key={follower.id}
                      className="p-3 md:p-4 hover:bg-gray-950 transition flex items-center justify-between gap-2"
                    >
                      <div
                        className="flex items-center space-x-2 md:space-x-3 flex-1 cursor-pointer min-w-0"
                        onClick={() => navigate(`/profile/${follower.id}`)}
                      >
                        <img
                          src={follower.avatar}
                          alt="Profile"
                          className="w-10 md:w-12 h-10 md:h-12 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm md:text-base truncate">{follower.name}</p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">
                            @{follower.name.toLowerCase().replace(/\s+/g, "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <Users className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No followers yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="divide-y divide-gray-800">
                {following.length > 0 ? (
                  following.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 md:p-4 hover:bg-gray-950 transition flex items-center justify-between gap-2"
                    >
                      <div
                        className="flex items-center space-x-2 md:space-x-3 flex-1 cursor-pointer min-w-0"
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-10 md:w-12 h-10 md:h-12 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm md:text-base truncate">{user.name}</p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">
                            @{user.name.toLowerCase().replace(/\s+/g, "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <Users className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Not following anyone yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - Hidden on mobile and tablet */}
        <aside className="hidden 2xl:sticky 2xl:top-16 2xl:block w-80 border-l border-gray-800 py-6 pl-4 pr-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Profile Card */}
          <div className="bg-gradient-to-b from-sky-900 to-blue-900 rounded-2xl overflow-hidden mb-6 sticky top-0">
            <div className="h-24 bg-gradient-to-r from-sky-800 to-blue-800"></div>

            <div className="px-4 pb-4">
              <div className="-mt-12 mb-4">
                <img
                  src={profileUser.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-gray-900 object-cover"
                />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{profileUser.name}</h3>
              <p className="text-sm text-gray-300 mb-4">@{username}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Followers</p>
                  <p className="text-xl font-bold text-white">{stats.followersCount}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Following</p>
                  <p className="text-xl font-bold text-white">{stats.followingCount}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Posts</p>
                  <p className="text-xl font-bold text-white">{stats.postsCount}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Join Date</p>
                  <p className="text-xs font-bold text-white">
                    {new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {profileUser.bio && (
                <div className="mb-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                  <p className="text-sm text-gray-200">{profileUser.bio}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  Joined {new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">About</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p>This is a complete profile view of all user activities and statistics.</p>
              <p className="mt-3 text-gray-500">
                Last active:{' '}
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 