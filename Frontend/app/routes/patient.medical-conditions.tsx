import { useEffect, useState } from "react";
import { getMedicalConditions } from "../lib/patientApi";
import type { IMedicalCondition } from "../lib/types";

export default function MedicalConditions() {
  const [conditions, setConditions] = useState<IMedicalCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Conditions", icon: "🏥" },
    { value: "allergy", label: "Allergies", icon: "🤧" },
    { value: "chronic_condition", label: "Chronic Conditions", icon: "💊" },
    { value: "medication", label: "Current Medications", icon: "💉" },
    { value: "surgery", label: "Surgical History", icon: "🏥" },
    { value: "family_history", label: "Family History", icon: "👨‍👩‍👧‍👦" },
    { value: "lifestyle", label: "Lifestyle", icon: "🏃" },
    { value: "other", label: "Other", icon: "📋" },
  ];

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMedicalConditions();
      setConditions(data);
    } catch (err) {
      console.error("Error fetching medical conditions:", err);
      setError(err instanceof Error ? err.message : "Failed to load medical conditions");
    } finally {
      setLoading(false);
    }
  };

  const filteredConditions =
    selectedCategory === "all"
      ? conditions
      : conditions.filter((c) => c.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "allergy":
        return "bg-red-100 text-red-700 border-red-200";
      case "chronic_condition":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medication":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "surgery":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "family_history":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "lifestyle":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
        <h1 className="text-3xl font-bold text-gray-900">Medical Conditions</h1>
        <p className="text-gray-600 mt-1">View your complete medical history and conditions</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{conditions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Allergies</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {conditions.filter((c) => c.category === "allergy").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Chronic</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {conditions.filter((c) => c.category === "chronic_condition").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-500 uppercase">Medications</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {conditions.filter((c) => c.category === "medication").length}
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCategory === "all"
              ? "All Medical Conditions"
              : categories.find((c) => c.value === selectedCategory)?.label}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredConditions.length} condition(s)
          </p>
        </div>

        {filteredConditions.length > 0 ? (
          <div className="divide-y">
            {filteredConditions.map((condition) => (
              <div
                key={condition._id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                    {categories.find((c) => c.value === condition.category)?.icon || "📋"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {condition.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{condition.value}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                          condition.category
                        )}`}
                      >
                        {condition.category.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Added: {new Date(condition.createdAt).toLocaleDateString()}</span>
                      {condition.updatedAt !== condition.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated: {new Date(condition.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No conditions found
            </h3>
            <p className="text-gray-600">
              {selectedCategory === "all"
                ? "Your medical conditions will appear here once your provider adds them."
                : "No conditions in this category yet."}
            </p>
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800">Important Notice</p>
            <p className="text-yellow-700 text-sm mt-1">
              Medical conditions are managed by your healthcare provider. If you notice any errors or need to add new conditions, please contact your provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

