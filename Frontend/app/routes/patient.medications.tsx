import { useEffect, useState } from "react";
import { getUserGoals } from "../lib/patientApi";
import type { IUserGoals } from "../lib/types";

export default function Medications() {
  const [medicationGoals, setMedicationGoals] = useState<IUserGoals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError("");
      const goals = await getUserGoals("medication");
      setMedicationGoals(goals);
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError(err instanceof Error ? err.message : "Failed to load medications");
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

  const totalMedications = medicationGoals.reduce((sum, goal) => sum + goal.value.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600 mt-1">Manage your prescriptions and dosage schedule</p>
        </div>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalMedications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medication Groups</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{medicationGoals.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Target</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{medicationGoals.filter(g => g.frequency === "daily").length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medication List */}
      {medicationGoals.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Medications</h2>
          </div>
          <div className="divide-y">
            {medicationGoals.map((goal) => (
              <div key={goal._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)} Goal
                      </h3>
                      
                      {/* Medications List */}
                      <div className="space-y-2 mb-4">
                        {goal.value.map((medication, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span className="text-gray-900 font-medium">{medication}</span>
                          </div>
                        ))}
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {goal.target && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Target:</span>
                            <span className="font-medium text-gray-900">{goal.target}</span>
                          </div>
                        )}
                        {goal.frequency && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Frequency:</span>
                            <span className="font-medium text-gray-900">{goal.frequency}</span>
                          </div>
                        )}
                        {goal.dosage && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Dosage:</span>
                            <span className="font-medium text-gray-900">{goal.dosage}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {goal.healthProviderId && (
                          <>
                            <span>Prescribed by Dr. {typeof goal.healthProviderId === 'object' ? (goal.healthProviderId as any).name : 'Provider'}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Added {new Date(goal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">No Medications Yet</h3>
          <p className="text-blue-700">
            Your medications will appear here once your healthcare provider prescribes them.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-blue-800">Reminder</p>
            <p className="text-blue-700 mt-1">
              Always take your medications as prescribed. If you miss a dose, consult your healthcare provider.
              Never stop taking medication without medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
