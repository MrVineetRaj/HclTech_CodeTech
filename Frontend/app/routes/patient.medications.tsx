export default function Medications() {
  // Sample medication data
  const medications = [
    {
      id: "1",
      name: "Aspirin 100mg",
      dosage: "1 tablet",
      frequency: "Once daily",
      time: "Morning (9:00 AM)",
      purpose: "Blood thinner",
      prescribedBy: "Dr. Smith",
      startDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Metformin 500mg",
      dosage: "1 tablet",
      frequency: "Twice daily",
      time: "Morning & Evening",
      purpose: "Diabetes management",
      prescribedBy: "Dr. Johnson",
      startDate: "2024-01-10",
      status: "active",
    },
    {
      id: "3",
      name: "Lisinopril 10mg",
      dosage: "1 tablet",
      frequency: "Once daily",
      time: "Evening (8:00 PM)",
      purpose: "Blood pressure control",
      prescribedBy: "Dr. Smith",
      startDate: "2024-02-01",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600 mt-1">Manage your prescriptions and dosage schedule</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          + Add Medication
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Medications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{medications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">4</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">2</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medication List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Medications</h2>
        </div>
        <div className="divide-y">
          {medications.map((med) => (
            <div key={med.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{med.purpose}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Dosage:</span>
                        <span className="font-medium text-gray-900">{med.dosage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Frequency:</span>
                        <span className="font-medium text-gray-900">{med.frequency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium text-gray-900">{med.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Prescribed by {med.prescribedBy}</span>
                      <span>•</span>
                      <span>Started {new Date(med.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                  <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

