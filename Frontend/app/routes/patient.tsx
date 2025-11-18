import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutPatient } from "../lib/auth";

export default function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logoutPatient();
    navigate("/login");
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediTech</h1>
                <p className="text-xs text-gray-500">Patient Portal</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.fullname}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/patient/dashboard"
              className={`px-3 py-4 text-sm font-medium border-b-2 transition ${
                location.pathname === "/patient/dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600"
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/patient/medications"
              className={`px-3 py-4 text-sm font-medium border-b-2 transition ${
                location.pathname === "/patient/medications"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600"
              }`}
            >
              💊 Medications
            </Link>
            <Link
              to="/patient/goals"
              className={`px-3 py-4 text-sm font-medium border-b-2 transition ${
                location.pathname === "/patient/goals"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600"
              }`}
            >
              🎯 Goals
            </Link>
            <Link
              to="/patient/medical-conditions"
              className={`px-3 py-4 text-sm font-medium border-b-2 transition ${
                location.pathname === "/patient/medical-conditions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600"
              }`}
            >
              🏥 Medical Conditions
            </Link>
            <Link
              to="/patient/profile"
              className={`px-3 py-4 text-sm font-medium border-b-2 transition ${
                location.pathname === "/patient/profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600"
              }`}
            >
              👤 Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
