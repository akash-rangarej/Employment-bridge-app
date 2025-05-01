import React, { useState } from "react";
import axios from "axios";

const PostTraining = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    level: "",
    prerequisites: "",
    instructor: "",
    format: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      // Log the data being sent
      console.log("Sending training data:", formData);

      const response = await axios.post(
        "http://localhost:5000/training",
        formData
      );

      if (response.status === 201) {
        console.log("Training posted successfully:", response.data);
        setMessage("Training module posted successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          duration: "",
          level: "",
          prerequisites: "",
          instructor: "",
          format: "",
          videoUrl: "",
        });
      } else {
        throw new Error("Failed to post training module");
      }
    } catch (error) {
      console.error("Error posting training:", error);
      // More detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error posting training module. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
        Post Training Module
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-center text-lg font-medium transition-all duration-300 transform ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              placeholder="e.g. Advanced Web Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              placeholder="Describe the training module content..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
                placeholder="e.g. 8 weeks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Format</option>
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <input
                type="text"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
                placeholder="e.g. Basic programming knowledge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
                placeholder="Instructor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="Enter the URL of your training video"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:bg-blue-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Posting...
              </div>
            ) : (
              "Post Training Module"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostTraining;
