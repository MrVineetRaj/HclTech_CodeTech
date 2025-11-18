import { useEffect, useState } from "react";
import {
  getPatientProfile,
  getUserGoals,
  getPendingGoals,
  getCompletedGoals,
  getMedicalConditions,
  updateGoalTracking,
} from "../lib/patientApi";
import type {
  IPatient,
  IUserGoals,
  IGoalTracking,
  IMedicalCondition,
} from "../lib/types";

export default function PatientDashboard() {
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [medicationGoals, setMedicationGoals] = useState<IUserGoals[]>([]);
  const [pendingGoals, setPendingGoals] = useState<IGoalTracking[]>([]);
  const [completedGoals, setCompletedGoals] = useState<IGoalTracking[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<
    IMedicalCondition[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        profileData,
        medicationData,
        pendingData,
        completedData,
        conditionsData,
      ] = await Promise.all([
        getPatientProfile(),
        getUserGoals("medication"),
        getPendingGoals(),
        getCompletedGoals(),
        getMedicalConditions(),
      ]);

      setPatient(profileData);
      setMedicationGoals(medicationData);
      setPendingGoals(pendingData);
      setCompletedGoals(completedData);
      setMedicalConditions(conditionsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await updateGoalTracking(goalId, { completed: true });
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error completing goal:", err);
      alert("Failed to complete goal");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {patient?.fullname}!
        </h1>
        <p className="text-blue-100">Here's your health overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Goals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Goals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {pendingGoals.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* Completed Goals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Today
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {completedGoals.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Medications
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {medicationGoals.reduce(
                  (sum, goal) => sum + goal.value.length,
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Goals List */}
      {pendingGoals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Today's Pending Goals
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pendingGoals.map((goal) => (
                <div
                  key={goal._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Goal #{goal._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteGoal(goal._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    Mark Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medication Goals */}
      {medicationGoals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Medication Schedule
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicationGoals.map((goal) => (
                <div
                  key={goal._id}
                  className="p-4 border rounded-lg hover:border-blue-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">💊</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {goal.category.charAt(0).toUpperCase() +
                          goal.category.slice(1)}
                      </p>
                      <ul className="space-y-1">
                        {goal.value.map((medication, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • {medication}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medical Conditions */}
      {medicalConditions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Medical Conditions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicalConditions.map((condition) => (
                <div key={condition._id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {condition.category}
                  </p>
                  <p className="font-medium text-gray-900">{condition.label}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {condition.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
