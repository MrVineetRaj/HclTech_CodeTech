import { useState } from "react";

export default function Goals() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "completed">("pending");

  // Sample goals data
  const pendingGoals = [
    {
      id: "1",
      title: "Daily Exercise",
      target: "Walk 30 minutes daily",
      progress: 60,
      dueDate: "2024-12-31",
      category: "fitness",
      assignedBy: "Dr. Smith",
    },
    {
      id: "2",
      title: "Blood Sugar Monitoring",
      target: "Check blood sugar twice daily",
      progress: 85,
      dueDate: "2024-12-31",
      category: "health",
      assignedBy: "Dr. Johnson",
    },
    {
      id: "3",
      title: "Weight Management",
      target: "Lose 5 kg in 3 months",
      progress: 40,
      dueDate: "2024-12-15",
      category: "fitness",
      assignedBy: "Dr. Smith",
    },
  ];

  const completedGoals = [
    {
      id: "4",
      title: "Initial Blood Work",
      target: "Complete comprehensive blood tests",
      completedDate: "2024-11-01",
      category: "health",
      assignedBy: "Dr. Johnson",
    },
    {
      id: "5",
      title: "Medication Schedule Setup",
      target: "Establish daily medication routine",
      completedDate: "2024-10-15",
      category: "medication",
      assignedBy: "Dr. Smith",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fitness":
        return "bg-purple-100 text-purple-700";
      case "health":
        return "bg-blue-100 text-blue-700";
      case "medication":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Goals</h1>
          <p className="text-gray-600 mt-1">Track your progress and achieve your health objectives</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          + Add Goal
        </button>
      </div>

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
              <p className="text-3xl font-bold text-blue-600 mt-2">78%</p>
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
            {pendingGoals.map((goal) => (
              <div key={goal.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>Assigned by {goal.assignedBy}</span>
                          <span>•</span>
                          <span>Due {new Date(goal.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Goals */}
        {selectedTab === "completed" && (
          <div className="divide-y">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{goal.target}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Assigned by {goal.assignedBy}</span>
                      <span>•</span>
                      <span>Completed {new Date(goal.completedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

