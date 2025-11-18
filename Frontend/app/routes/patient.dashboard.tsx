import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just get user from localStorage (already authenticated)
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user.fullname || user.name || "Patient"}!
        </h1>
        <p className="text-blue-100 text-lg">Your MediTech Dashboard</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm font-medium text-gray-500">User ID</p>
            <p className="text-lg">{user.id || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">User Type</p>
            <p className="text-lg capitalize">{user.userType || "patient"}</p>
          </div>
          {user.email && (
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition text-center">
            <div className="text-4xl mb-2">💊</div>
            <p className="font-semibold text-gray-900">Medications</p>
            <p className="text-sm text-gray-600 mt-1">View your medications</p>
          </button>

          <button className="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="font-semibold text-gray-900">Health Goals</p>
            <p className="text-sm text-gray-600 mt-1">Track your progress</p>
          </button>

          <button className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition text-center">
            <div className="text-4xl mb-2">🏥</div>
            <p className="font-semibold text-gray-900">Appointments</p>
            <p className="text-sm text-gray-600 mt-1">Schedule a visit</p>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="font-semibold text-yellow-800">Dashboard Under Development</p>
            <p className="text-yellow-700 mt-1">
              More features coming soon! Your backend currently only has authentication routes.
              Additional patient data endpoints will be added in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
