import React, { useState } from "react";
import axios from "axios";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    sector: "",
    salary_range: "",
    job_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Job posted successfully!");
      setJobData({
        title: "",
        company: "",
        description: "",
        location: "",
        sector: "",
        salary_range: "",
        job_type: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error posting job. Please try again."
      );
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
        Post a New Job
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
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              placeholder="Describe the job role, requirements, and responsibilities..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="job_type"
                value={jobData.job_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Job Type</option>
                <option value="formal">Formal (Corporate, Full-time)</option>
                <option value="informal">
                  Informal (Freelance, Part-time)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <select
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Location</option>
                <option value="Bangaluru">Bangaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Sector
              </label>
              <select
                name="sector"
                value={jobData.sector}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                name="salary_range"
                value={jobData.salary_range}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
                placeholder="e.g. 50,000 - 70,000 RS"
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
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
