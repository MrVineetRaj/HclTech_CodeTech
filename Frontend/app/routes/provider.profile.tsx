import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { getAllPatients } from "../lib/providerApi";
import type { IHealthProvider } from "../lib/types";

export default function ProviderProfile() {
  const [provider, setProvider] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeThisWeek: 0,
    newThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      setProvider(user);

      // Fetch patient statistics
      const patients = await getAllPatients().catch(() => []);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      setStats({
        totalPatients: patients.length,
        activeThisWeek: patients.filter(p => new Date(p.updatedAt) > weekAgo).length,
        newThisMonth: patients.filter(p => new Date(p.createdAt) > monthAgo).length,
      });
    } catch (err) {
      console.error("Error fetching provider data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Provider Profile</h1>
        <p className="text-gray-600 mt-1">View your professional information and statistics</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-6 pb-6 border-b">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {provider?.name?.charAt(0).toUpperCase() || "D"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dr. {provider?.name || "Provider"}</h2>
            <p className="text-gray-600">{provider?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Healthcare Provider
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Email</dt>
                  <dd className="text-sm text-gray-900 mt-1">{provider?.email || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Phone</dt>
                  <dd className="text-sm text-gray-900 mt-1">{provider?.phone || "Not provided"}</dd>
                </div>
              </dl>
            </div>
            <div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Address</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {provider?.address ? (
                      <>
                        {provider.address}<br />
                        {provider.city}, {provider.state} {provider.pincode}<br />
                        {provider.country}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Patients</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalPatients}</p>
              </div>
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active This Week</p>
                <p className="text-4xl font-bold text-green-900 mt-2">{stats.activeThisWeek}</p>
              </div>
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">New This Month</p>
                <p className="text-4xl font-bold text-purple-900 mt-2">{stats.newThisMonth}</p>
              </div>
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">📈</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <dt className="text-sm font-medium text-gray-600">Account Type</dt>
            <dd className="text-sm text-gray-900 font-semibold">Healthcare Provider</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-sm font-medium text-gray-600">Provider ID</dt>
            <dd className="text-sm text-gray-900 font-mono">{provider?.id || provider?._id || "N/A"}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-sm font-medium text-gray-600">Member Since</dt>
            <dd className="text-sm text-gray-900">
              {provider?.createdAt ? new Date(provider.createdAt).toLocaleDateString() : "N/A"}
            </dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-sm font-medium text-gray-600">Last Login</dt>
            <dd className="text-sm text-gray-900">
              {provider?.updatedAt ? new Date(provider.updatedAt).toLocaleString() : "N/A"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/provider/patients/invite"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-semibold text-gray-900">Invite Patient</p>
              <p className="text-sm text-gray-600">Add a new patient to your practice</p>
            </div>
          </a>
          <a
            href="/provider/dashboard"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition"
          >
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-semibold text-gray-900">View Patients</p>
              <p className="text-sm text-gray-600">Manage your patient list</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

