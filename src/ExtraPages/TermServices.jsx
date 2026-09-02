import { Link } from "react-router-dom";
import Footer from "../pages/Footer";

export default function TermServices() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col flex-1 items-center justify-center px-6 md:px-16 py-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-extrabold text-white">𐂂</h1>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-center">Terms of Service</h1>
        <p className="text-lg text-gray-300 max-w-3xl text-center leading-relaxed mb-10">
          Welcome to UniFeed. By accessing or using our platform, you agree to comply
          with the following terms and conditions. Please read them carefully before
          using the service.
        </p>

        <div className="max-w-3xl w-full space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By creating an account or using UniFeed, you agree to follow all rules,
              policies, and updates we provide. If you do not agree, please stop using
              the platform immediately.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. User Responsibilities</h2>
            <p className="text-gray-300 mb-2">
              • You are responsible for any activity under your account.
            </p>
            <p className="text-gray-300">
              • You agree not to post or share harmful, offensive, or illegal content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Privacy</h2>
            <p className="text-gray-300">
              We value your privacy. Personal data shared on UniFeed will only be used
              to improve user experience and will not be sold or misused.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Content Ownership</h2>
            <p className="text-gray-300">
              You retain ownership of your posts. However, by posting on UniFeed, you
              grant us a license to display and distribute your content within the
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Account Termination</h2>
            <p className="text-gray-300">
              We may suspend or terminate accounts that violate our rules or harm the
              community in any way.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
            <p className="text-gray-300">
              UniFeed may update these Terms of Service at any time. Continued use of
              the platform means you accept any future changes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about these terms, feel free to contact us at{" "}
              <span className="text-white font-semibold">support@unifeed.com</span>.
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
