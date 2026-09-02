


import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { googleRegister, loginUser } from "../features/auth/authSlice";
import Footer from "./Footer";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null); // <-- track login errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // clear error when typing again
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/home");
      } else {
        // if rejected, show message
        const message =
          resultAction.payload?.message || "Invalid email or password.";
        setError(message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const resultAction = await dispatch(googleRegister());
      if (googleRegister.fulfilled.match(resultAction)) {
        navigate("/home", {
          state: { avatar: resultAction.payload.user.avatar },
        });
      } else {
        setError("Google login failed. Try again.");
      }
    } catch (err) {
      setError("Google login failed. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left logo */}
        <div className="flex w-full md:w-1/2 items-center justify-center py-12">
          <h1 className="text-9xl font-extrabold text-white-400">𐂂</h1>
        </div>

        {/* Right: Login form */}
        <div className="flex flex-col w-full md:w-1/2 justify-center px-8 items-center md:items-start">
          <h2 className="text-5xl font-bold mb-6">Welcome back</h2>
          <h3 className="text-2xl font-semibold mb-8">
            Log in to your UniFeed account.
          </h3>

          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-4 mb-4 w-80"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent border border-gray-500 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent border border-gray-500 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold rounded-full px-6 py-3 hover:bg-gray-200"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="bg-white text-black font-semibold rounded-full px-6 py-3 hover:bg-gray-200 mb-6 w-80"
          >
            {loading ? "Signing in..." : "Log in with Google"}
          </button>

          <p className="text-sm text-gray-400 mb-6 w-80 text-center md:text-left">
            By logging in, you agree to the Terms of Service and Privacy Policy.
          </p>

          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
