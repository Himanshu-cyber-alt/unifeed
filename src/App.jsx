

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PostComment from "./pages/PostComment";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from './ExtraPages/About'
import HelpCenter from "./ExtraPages/HelpCenter";
import TermServices from "./ExtraPages/TermServices";
import Privacy from "./ExtraPages/Privacy";




function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path = "/about" element={<About/>} /> 
        <Route path = "/help-center" element={<HelpCenter/>} /> 
        <Route path="/term-of-service" element={<TermServices/>} />
        <Route path="/privacy" element={<Privacy/>}/>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <PostComment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}


export default App;