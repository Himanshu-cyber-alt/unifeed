import { Link } from "react-router-dom";
import Footer from "../pages/Footer";

export default function HelpCenter() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col flex-1 items-center justify-center px-6 md:px-16 py-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-extrabold text-white">𐂂</h1>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-center">Help Center</h1>
        <p className="text-lg text-gray-300 max-w-3xl text-center leading-relaxed mb-10">
          Welcome to the UniFeed Help Center. We’re here to help you get the most out
          of your experience. Whether you’re having trouble signing in, managing your
          account, or just need guidance — you’ll find answers below.
        </p>

        <div className="max-w-3xl w-full space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Account & Login</h2>
            <p className="text-gray-300 mb-2">
              • If you can’t sign in, make sure your Google or Email account is linked properly.
            </p>
            <p className="text-gray-300">
              • Forgot your password? You can reset it from the login page using your registered email.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Posting & Interaction</h2>
            <p className="text-gray-300 mb-2">
              • To share a post, click on the “Create” button and express your thoughts.
            </p>
            <p className="text-gray-300">
              • You can like, comment, or reply to other users to engage in discussions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Privacy & Safety</h2>
            <p className="text-gray-300 mb-2">
              • Your privacy is important. We never share your data with third parties.
            </p>
            <p className="text-gray-300">
              • If you see inappropriate content, report it using the “Report” option under each post.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Need More Help?</h2>
            <p className="text-gray-300 mb-4">
              If you still have questions or issues, feel free to contact our support team.
              We’ll get back to you as soon as possible.
            </p>
            <p className="text-gray-300">
              📧 Email: <span className="text-white font-semibold">support@unifeed.com</span>
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-10 bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>

      <Footer />
    </div>
  );
}
