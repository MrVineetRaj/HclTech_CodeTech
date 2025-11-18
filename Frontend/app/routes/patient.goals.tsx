import { useEffect, useState } from "react";
import {
  getUserGoals,
  getPendingGoals,
  getCompletedGoals,
  updateGoalTracking,
} from "../lib/patientApi";
import type { IUserGoals, IGoalTracking } from "../lib/types";

export default function Goals() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "completed">("pending");
  const [allGoals, setAllGoals] = useState<IUserGoals[]>([]);
  const [pendingGoals, setPendingGoals] = useState<IGoalTracking[]>([]);
  const [completedGoals, setCompletedGoals] = useState<IGoalTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const fetchGoalsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [goals, pending, completed] = await Promise.all([
        getUserGoals(),
        getPendingGoals(),
        getCompletedGoals(),
      ]);

      setAllGoals(goals);
      setPendingGoals(pending);
      setCompletedGoals(completed);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError(err instanceof Error ? err.message : "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await updateGoalTracking(goalId, { completed: true });
      // Refresh data
      await fetchGoalsData();
      alert("Goal marked as complete!");
    } catch (err) {
      console.error("Error completing goal:", err);
      alert("Failed to mark goal complete");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "fitness":
      case "exercise":
        return "bg-purple-100 text-purple-700";
      case "health":
      case "wellness":
        return "bg-blue-100 text-blue-700";
      case "medication":
        return "bg-green-100 text-green-700";
      case "nutrition":
      case "diet":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalGoals = allGoals.length;
  const successRate = totalGoals > 0 
    ? Math.round((completedGoals.length / (completedGoals.length + pendingGoals.length)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Goals</h1>
          <p className="text-gray-600 mt-1">Track your progress and achieve your health objectives</p>
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
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingGoals.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Goals</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedGoals.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setSelectedTab("pending")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                selectedTab === "pending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending Goals ({pendingGoals.length})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                selectedTab === "completed"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed ({completedGoals.length})
            </button>
          </div>
        </div>

        {/* Pending Goals */}
        {selectedTab === "pending" && (
          <div className="divide-y">
            {pendingGoals.length > 0 ? (
              pendingGoals.map((goal) => {
                const goalData = goal.goalID as any;
                return (
                  <div key={goal._id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {goalData?.category ? `${goalData.category.charAt(0).toUpperCase() + goalData.category.slice(1)} Goal` : 'Health Goal'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  Target: {goal.target || goalData?.target || 'Not specified'}
                                </p>
                              </div>
                              {goalData?.category && (
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(goalData.category)}`}>
                                  {goalData.category}
                                </span>
                              )}
                            </div>

                            {/* Goal Details */}
                            {goalData?.value && Array.isArray(goalData.value) && (
                              <div className="mt-3 space-y-1">
                                {goalData.value.map((item: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              {goal.healthProviderId && (
                                <>
                                  <span>Assigned by {typeof goal.healthProviderId === 'object' ? (goal.healthProviderId as any).name : 'Provider'}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>Created {new Date(goal.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompleteGoal(goal._id)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Goals</h3>
                <p className="text-gray-600">
                  Great job! You have no pending goals at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Completed Goals */}
        {selectedTab === "completed" && (
          <div className="divide-y">
            {completedGoals.length > 0 ? (
              completedGoals.map((goal) => {
                const goalData = goal.goalID as any;
                return (
                  <div key={goal._id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {goalData?.category ? `${goalData.category.charAt(0).toUpperCase() + goalData.category.slice(1)} Goal` : 'Health Goal'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Target: {goal.target || goalData?.target || 'Completed'}
                            </p>
                          </div>
                          {goalData?.category && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(goalData.category)}`}>
                              {goalData.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          {goal.healthProviderId && (
                            <>
                              <span>Assigned by {typeof goal.healthProviderId === 'object' ? (goal.healthProviderId as any).name : 'Provider'}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>Completed {new Date(goal.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Goals Yet</h3>
                <p className="text-gray-600">
                  Complete your first goal to see it here!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Motivational Box */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="font-semibold text-purple-800">Keep Going!</p>
            <p className="text-purple-700 mt-1">
              You're making great progress on your health journey. Stay consistent with your goals and celebrate small wins!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
