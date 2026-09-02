import { Link} from "react-router-dom";
import Footer from "../pages/Footer";



  
export default function About() {

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col flex-1 items-center justify-center px-6 md:px-16 py-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-extrabold text-white">𐂂</h1>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-center">About UniFeed</h1>

        <p className="text-lg text-gray-300 max-w-3xl text-center leading-relaxed mb-10">
          UniFeed is a platform where people come together to share ideas,
          connect with others, and express their thoughts freely. It’s a place
          built for open conversations, creativity, and meaningful interactions
          — all in a simple, fast, and modern experience.
        </p>

        <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
        <p className="text-lg text-gray-300 max-w-2xl text-center leading-relaxed mb-10">
          We believe in building a digital space where everyone can have a voice
          and engage in authentic discussions. UniFeed aims to make online
          interaction more genuine, respectful, and enjoyable.
        </p>

        <h2 className="text-3xl font-semibold mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-300 text-lg space-y-2 max-w-md text-left mb-10">
          <li>Share your thoughts with a global audience</li>
          <li>Engage with posts that inspire you</li>
          <li>Discover new perspectives and communities</li>
          <li>Enjoy a fast and responsive interface</li>
          <li>Stay connected anytime, anywhere</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">Our Goal</h2>
        <p className="text-lg text-gray-300 max-w-2xl text-center leading-relaxed mb-10">
          Our goal is to build a community-driven platform where ideas matter
          more than status. UniFeed focuses on meaningful content and real
          connections, not algorithms or noise.
        </p>

        <Link
          to="/"
          className="mt-4 bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>

      <Footer />
    </div>
  );
}


