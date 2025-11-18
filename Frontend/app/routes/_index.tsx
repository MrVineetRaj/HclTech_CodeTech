import { Link } from "react-router";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">MediTech</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Your Health, Simplified
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage medications, track health goals, and stay connected with your
          healthcare provider. All in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            Register
          </Link>
          <a
            href="#features"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 text-lg font-semibold border border-blue-600"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💊</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Medication Tracking
            </h4>
            <p className="text-gray-600">
              Never miss a dose with smart reminders and AI-powered phone calls
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Health Goals
            </h4>
            <p className="text-gray-600">
              Set and track daily health goals with your healthcare provider
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🥗</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Diet Plans
            </h4>
            <p className="text-gray-600">
              Follow personalized diet plans created by your doctor
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              AI Voice Assistant
            </h4>
            <p className="text-gray-600">
              Receive friendly reminder calls to take your medications on time
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📰</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Health News
            </h4>
            <p className="text-gray-600">
              Stay updated with the latest health news and wellness tips
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Doctor Connection
            </h4>
            <p className="text-gray-600">
              Stay connected with your healthcare provider seamlessly
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Sign Up
              </h4>
              <p className="text-gray-600">
                Receive an invitation from your doctor and create your account
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Get Your Plan
              </h4>
              <p className="text-gray-600">
                View medications, goals, and diet plans set by your provider
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Stay on Track
              </h4>
              <p className="text-gray-600">
                Get reminders, track progress, and achieve your health goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of patients managing their health better with
            MediTech
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-lg font-semibold"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold">MediTech</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your trusted partner in medication management
          </p>
          <div className="flex gap-6 justify-center text-sm text-gray-400">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2024 MediTech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
