import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";

import {
  getPatientById,
  getPatientMedicalConditions,
  getPatientGoals,
  addMedicalCondition,
  deleteMedicalConditionForPatient,
  addUserGoal,
  deleteUserGoalForPatient,
  sendReminderCall,
} from "../lib/providerApi";
import type { IPatient, IMedicalCondition, IUserGoals } from "../lib/types";

type TabType = "overview" | "conditions" | "goals" | "calls";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [conditions, setConditions] = useState<IMedicalCondition[]>([]);
  const [goals, setGoals] = useState<IUserGoals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Form states
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [conditionForm, setConditionForm] = useState({
    category: "allergy",
    label: "",
    value: "",
  });
  const [goalForm, setGoalForm] = useState({
    category: "medication" as "medication" | "general" | "healthcheckup",
    value: "",
  });

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const [patientData, conditionsData, goalsData] = await Promise.all([
        getPatientById(id),
        getPatientMedicalConditions(id).catch(() => []),
        getPatientGoals(id).catch(() => []),
      ]);

      setPatient(patientData);
      setConditions(conditionsData);
      setGoals(goalsData);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load patient data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await addMedicalCondition(id, conditionForm);
      setConditionForm({ category: "allergy", label: "", value: "" });
      setShowAddCondition(false);
      await fetchPatientData();
      alert("Medical condition added successfully!");
    } catch (err) {
      alert(
        "Failed to add condition: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleDeleteCondition = async (conditionId: string) => {
    if (!id || !confirm("Are you sure you want to delete this condition?"))
      return;

    try {
      await deleteMedicalConditionForPatient(id, conditionId);
      await fetchPatientData();
      alert("Condition deleted successfully!");
    } catch (err) {
      alert(
        "Failed to delete condition: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !goalForm.value.trim()) return;

    try {
      const values = goalForm.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      await addUserGoal(id, {
        category: goalForm.category,
        value: values,
      });
      setGoalForm({ category: "medication", value: "" });
      setShowAddGoal(false);
      await fetchPatientData();
      alert("Goal added successfully!");
    } catch (err) {
      alert(
        "Failed to add goal: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!id || !confirm("Are you sure you want to delete this goal?")) return;

    try {
      await deleteUserGoalForPatient(id, goalId);
      await fetchPatientData();
      alert("Goal deleted successfully!");
    } catch (err) {
      alert(
        "Failed to delete goal: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleSendReminder = async () => {
    if (!id || !patient) return;

    try {
      await sendReminderCall({
        patientId: id,
        type: "medication",
        message: `Hi ${patient.fullname}, this is a reminder to take your medications.`,
      });
      alert("Reminder call initiated successfully!");
    } catch (err) {
      alert(
        "Failed to send reminder: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || "Patient not found"}
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "conditions", label: "Medical Conditions", icon: "🏥" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "calls", label: "AI Calls", icon: "📞" },
  ];

  const conditionCategories = [
    "allergy",
    "chronic_condition",
    "medication",
    "surgery",
    "family_history",
    "lifestyle",
    "other",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/provider/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            ← Back
          </button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {patient.fullname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.fullname}
            </h1>
            <p className="text-gray-600">{patient.email}</p>
          </div>
        </div>
        <button
          onClick={handleSendReminder}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          📞 Send Reminder Call
        </button>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Phone</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {patient.phone || "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Location</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {patient.city}, {patient.state}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Conditions</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {conditions.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Active Goals</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {goals.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Full Name
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.fullname}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.phone || "Not provided"}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Address
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Street Address
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.address}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        City, State
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.city}, {patient.state} {patient.pincode}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Country
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {patient.country}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Information
                </h3>
                <p className="text-sm text-gray-600">
                  Registered: {new Date(patient.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated: {new Date(patient.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Medical Conditions Tab */}
          {activeTab === "conditions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Conditions
                </h3>
                <button
                  onClick={() => setShowAddCondition(!showAddCondition)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  + Add Condition
                </button>
              </div>

              {showAddCondition && (
                <form
                  onSubmit={handleAddCondition}
                  className="bg-gray-50 p-4 rounded-lg border space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={conditionForm.category}
                      onChange={(e) =>
                        setConditionForm({
                          ...conditionForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {conditionCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={conditionForm.label}
                      onChange={(e) =>
                        setConditionForm({
                          ...conditionForm,
                          label: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Peanut Allergy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={conditionForm.value}
                      onChange={(e) =>
                        setConditionForm({
                          ...conditionForm,
                          value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Severe reaction, carries EpiPen"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCondition(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {conditions.length > 0 ? (
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <div
                      key={condition._id}
                      className="bg-white p-4 border rounded-lg flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                            {condition.category.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          {condition.label}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {condition.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Added:{" "}
                          {new Date(condition.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCondition(condition._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No medical conditions recorded
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Goals
                </h3>
                <button
                  onClick={() => setShowAddGoal(!showAddGoal)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  + Add Goal
                </button>
              </div>

              {showAddGoal && (
                <form
                  onSubmit={handleAddGoal}
                  className="bg-gray-50 p-4 rounded-lg border space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={goalForm.category}
                      onChange={(e) =>
                        setGoalForm({
                          ...goalForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="medication">Medication</option>
                      <option value="general">General</option>
                      <option value="healthcheckup">Health Checkup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goals (comma-separated)
                    </label>
                    <textarea
                      value={goalForm.value}
                      onChange={(e) =>
                        setGoalForm({ ...goalForm, value: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Take aspirin twice daily, Monitor blood pressure"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddGoal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {goals.length > 0 ? (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal._id}
                      className="bg-white p-4 border rounded-lg flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                            {goal.category.toUpperCase()}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {goal.value.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-400 mt-2">
                          Created:{" "}
                          {new Date(goal.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No goals assigned</p>
                </div>
              )}
            </div>
          )}

          {/* AI Calls Tab */}
          {activeTab === "calls" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                AI Voice Call Management
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📞</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Send AI Reminder Call
                    </h4>
                    <p className="text-blue-800 text-sm mb-4">
                      Send an automated voice call reminder to{" "}
                      {patient.fullname} about their medications or health
                      goals.
                    </p>
                    <button
                      onClick={handleSendReminder}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      📞 Initiate Call Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Call history feature coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
