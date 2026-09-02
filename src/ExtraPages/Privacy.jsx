import { Link } from "react-router-dom";
import Footer from "../pages/Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col flex-1 items-center justify-center px-6 md:px-16 py-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-extrabold text-white">𐂂</h1>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-lg text-gray-300 max-w-3xl text-center leading-relaxed mb-10">
          Your privacy matters to us. This Privacy Policy explains how UniFeed collects,
          uses, and protects your information when you use our platform.
        </p>

        <div className="max-w-3xl w-full space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect basic account information such as your name, email, and profile
              picture when you sign up. We may also collect usage data to improve your
              experience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-2">
              • To provide, maintain, and improve our services. <br />
              • To personalize your experience and show relevant content. <br />
              • To ensure platform security and prevent unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
            <p className="text-gray-300">
              We use secure technologies and best practices to protect your information.
              However, no online service is completely risk-free, and we encourage users
              to protect their accounts responsibly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Sharing of Information</h2>
            <p className="text-gray-300">
              We do not sell or rent your personal information. Your data is only shared
              when required by law or to improve the functionality of our service (such as
              authentication).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Cookies</h2>
            <p className="text-gray-300">
              UniFeed uses cookies to enhance performance and remember your preferences.
              You can control or disable cookies in your browser settings if you wish.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to access, update, or delete your personal information.
              For any data-related requests, please contact us at{" "}
              <span className="text-white font-semibold">support@unifeed.com</span>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">7. Changes to Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. Any major changes will
              be notified on the platform, and continued use will signify your acceptance.
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
