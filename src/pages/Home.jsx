
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import Post from "../pages/Post";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Home,
  Bell,
  User,
  LogOut,
  ImagePlus,
  X,
  Plus,
  Search,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
   const [allUsers, setAllUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch posts via socket
  useEffect(() => {
    const handleLoadPosts = (data) => setPosts(data);
    socket.on("load_posts", handleLoadPosts);

    if (!socket.connected) socket.connect();
    socket.emit("fetch_posts");





    return () => socket.off("load_posts", handleLoadPosts);

  }, [user]);


  useEffect(()=>{
     const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://13.232.47.103:8000/api/users");
  
        setAllUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchAllUsers();
  },[])

 

  // Get unique users for suggested accounts
  const uniqueUsers = posts
    .filter(
      (p, index, self) =>
        index === self.findIndex(u => u.user_id === p.user_id)
    )
    .slice(0, 3);







  const searchResults = searchQuery.trim()
    ? allUsers
        .filter(
          (p, index, self) =>
            index === self.findIndex(u => u.id === p.id)
        )
        .filter(
          (user) =>
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  const handleLogout = () => {
    dispatch(logout());
    socket.disconnect();
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post("http://13.232.47.103:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) return;
    const imageUrl = await uploadImage();
    socket.emit("new_post", { user, content, imageUrl });
    setContent("");
    setImage(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#121212] text-white font-sans min-h-screen">
     
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 z-40 flex items-center justify-center">
        <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              𐂂 UniFeed
          </h1>
        

          
         
          <div className="hidden md:flex flex-1 max-w-sm ml-8 items-center bg-gray-800 rounded-full px-4 py-2 relative">
            <input 
              type="text" 
              placeholder="Search accounts" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              className="bg-transparent w-full text-white outline-none"
            />
            <Search className="text-gray-500"/>
            
       
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                {searchResults.map((sUser) => (
                  <div
                    key={sUser.user_id}
                    onClick={() => {
                      navigate(`/profile/${sUser.id}`);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 transition"
                  >
                    <img
                      src={sUser.avatar}
                      alt={sUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-white">{sUser.username}</p>
                      <p className="text-sm text-gray-400">{sUser.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

           
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-400 z-50">
                No users found
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition">
              <Plus className="w-5 h-5"/>
              <span>Upload</span>
            </button>
            <img src={user?.avatar} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/profile/${user?.id}`)} />
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1200px] mx-auto flex">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block fixed top-16 h-[calc(100vh-4rem)] w-72 border-r border-gray-800 py-6 pr-4 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <button onClick={() => navigate("/home")} className="flex items-center gap-4 text-xl font-bold px-4 py-3 bg-gray-800 text-white rounded-lg">
              <Home className="w-7 h-7" />
              <span>For You</span>
            </button>


            {/* <button className="flex items-center gap-4 text-xl font-bold px-4 py-3 hover:bg-gray-800 text-gray-300 rounded-lg transition">
              <Users className="w-7 h-7" />
              <span>Following</span>
            </button> */}


            <button onClick={() => navigate(`/profile/${user?.id}`)} className="flex items-center gap-4 text-xl font-bold px-4 py-3 hover:bg-gray-800 text-gray-300 rounded-lg transition">
              <User className="w-7 h-7" />
              <span>ProfileHereHereHere</span>
            </button>
          </nav>
          <hr className="border-gray-800 my-4"/>
          <div className="px-4 text-gray-500 font-semibold">Suggested accounts</div>
          <div className="flex flex-col gap-2 mt-3">
            <div>
              {uniqueUsers.map(sUser => (
                <div
                  key={sUser.user_id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <img  
                    src={sUser.avatar}
                    alt={sUser.name}
                    className="w-10 h-10 rounded-full"
                    onClick={() => navigate(`/profile/${sUser?.user_id}`)}
                  />
                  <div>
                    <p className="font-bold text-white">{sUser.username}</p>
                    <p className="text-sm text-gray-400">{sUser.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-6 text-left flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-lg p-2 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN FEED */}
        <main className="w-full md:ml-72 pt-20 pb-20 md:pb-8">
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p>It's quiet here... Upload the first post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.post_id} className="border-b border-gray-800 pb-6">
                  <Post post={post} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* BOTTOM NAV - MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 z-40 flex justify-around items-center h-16">
        <button onClick={() => navigate('/home')} className="p-2 text-white">
          <Home className="w-7 h-7" />
        </button>

       


<button
  onClick={() => setShowSearchResults((prev) => !prev)}
  className="p-2 text-gray-400 md:hidden"
>
  <Search className="w-7 h-7" />
</button>

{showSearchResults && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col p-4">
    <div className="flex items-center bg-gray-900 rounded-full px-4 py-2">
      <input
        type="text"
        placeholder="Search accounts"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
        className="bg-transparent w-full text-white outline-none"
      />
      <Search className="text-gray-500" />
      <button
        onClick={() => {
          setSearchQuery("");
          setShowSearchResults(false);
        }}
        className="ml-2 text-gray-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    <div className="mt-3 bg-gray-900 rounded-lg max-h-80 overflow-y-auto border border-gray-700">
      {searchResults.length > 0 ? (
        searchResults.map((sUser) => (
          <div
            key={sUser.id}
            onClick={() => {
              navigate(`/profile/${sUser.id}`);
              setSearchQuery("");
              setShowSearchResults(false);
            }}
            className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0"
          >
            <img src={sUser.avatar} alt={sUser.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold text-white">{sUser.username}</p>
              <p className="text-sm text-gray-400">{sUser.name}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-gray-400">No users found</p>
      )}
    </div>
  </div>
)}




        <button onClick={() => setIsModalOpen(true)} className="p-2">
          <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-black" />
          </div>
        </button>

        {/* <button className="p-2 text-gray-400">
          <Bell className="w-7 h-7" />
        </button> */}
        
        <button onClick={() => navigate(`/profile/${user?.id}`)} className="p-2 text-gray-400">
          <User className="w-7 h-7" />
        </button>
      </nav>

      {/* CREATE POST MODAL */}
    {isModalOpen && (
       <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
              <h2 className="text-xl font-bold">Create Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex space-x-3">
                <img src={user?.avatar} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-gray-700" />
                <div className="flex-1">
                  <textarea rows="5" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?" className="w-full bg-transparent text-white placeholder-gray-500 resize-none border-none outline-none text-lg" />
                  {imagePreview && (
                    <div className="relative mt-4 rounded-2xl overflow-hidden border border-gray-700">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
                      <button onClick={() => { setImage(null); setImagePreview(null); }} className="absolute top-3 right-3 bg-black/80 backdrop-blur text-white rounded-full p-2 hover:bg-black transition-all">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-800/50">
              <label className="cursor-pointer flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="p-2 hover:bg-sky-500/10 rounded-full transition-all">
                  <ImagePlus className="w-5 h-5" />
                </div>
              </label>
              <button onClick={handlePost} disabled={uploading || (!content.trim() && !image)} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg disabled:shadow-none">
                {uploading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Posting...</span>
                  </span>
                ) : ("Post")}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

