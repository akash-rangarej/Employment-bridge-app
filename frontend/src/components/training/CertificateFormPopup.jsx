import React, { useState } from "react";

const CertificateFormPopup = ({ isOpen, onClose, onSubmit, training }) => {
  const [formData, setFormData] = useState({
    name: "",
    certificate_type: "learner",
    score: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate name
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    // Validate certificate type
    if (!formData.certificate_type) {
      setError("Certificate type is required");
      return;
    }

    // Validate score for learner certificates
    if (formData.certificate_type === "learner") {
      const score = parseInt(formData.score);
      if (isNaN(score) || score < 0 || score > 100) {
        setError("Score must be between 0 and 100");
        return;
      }
    }

    console.log("Form data before submission:", formData); // Debug log
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Certificate Details
          </h2>
          <p className="text-gray-600 mt-2">
            Please fill in your details to generate your certificate
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name as it should appear on the certificate"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Certificate Type Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Certificate Type
            </label>
            <select
              value={formData.certificate_type}
              onChange={(e) =>
                setFormData({ ...formData, certificate_type: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="learner">Course Completion Certificate</option>
              <option value="trainer">Trainer Certificate</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.certificate_type === "learner"
                ? "Select this if you have completed this training module"
                : "Select this if you are the instructor of this training module"}
            </p>
          </div>

          {/* Score Field (only for learners) */}
          {formData.certificate_type === "learner" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Completion Score
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) =>
                    setFormData({ ...formData, score: e.target.value })
                  }
                  placeholder="Enter your score"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter your score as a percentage (0-100)
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Generate Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateFormPopup;
