import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import {
  getUserGoals,
  getPendingGoals,
  getCompletedGoals,
  getMedicalConditions,
} from "../lib/patientApi";
import type { IUserGoals, IGoalTracking, IMedicalCondition } from "../lib/types";

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [medicationGoals, setMedicationGoals] = useState<IUserGoals[]>([]);
  const [pendingGoals, setPendingGoals] = useState<IGoalTracking[]>([]);
  const [completedGoals, setCompletedGoals] = useState<IGoalTracking[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<IMedicalCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Get user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Fetch data from backend
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel
      const [medGoals, pending, completed, conditions] = await Promise.all([
        getUserGoals("medication"),
        getPendingGoals(),
        getCompletedGoals(),
        getMedicalConditions(),
      ]);

      setMedicationGoals(medGoals);
      setPendingGoals(pending);
      setCompletedGoals(completed);
      setMedicalConditions(conditions);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user?.fullname || user?.name || "Patient"}!
        </h1>
        <p className="text-blue-100 text-lg">Your MediTech Dashboard</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Medications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {medicationGoals.reduce((sum, goal) => sum + goal.value.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Goals</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingGoals.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div class