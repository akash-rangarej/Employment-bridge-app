import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaClock,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TrainingList = ({ showSearch = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    format: "",
  });

  useEffect(() => {
    if (showSearch) {
      fetchTrainings();
    }
  }, [filters, showSearch]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/training", {
        params: filters,
      });
      const trainingsData = Array.isArray(response.data) ? response.data : [];
      console.log("Trainings data:", trainingsData);
      // Log each training's ID
      trainingsData.forEach((training) => {
        console.log("Training ID:", training._id);
        console.log("Training title:", training.title);
      });
      setTrainings(trainingsData);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Landing page view
  if (!showSearch) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
          Training Section
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Post Training Card */}
          <Link to="/training/post" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Post Training
                </h3>
                <p className="text-gray-600">
                  Create and share training modules with the community.
                </p>
              </div>
            </div>
          </Link>

          {/* Search Training Card */}
          <Link to="/training/search" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Search Training
                </h3>
                <p className="text-gray-600">
                  Browse through available training modules and enhance your
                  skills.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // Search page view
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
        Search Training
      </h2>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">Filters</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="soft-skills">Soft Skills</option>
              <option value="leadership">Leadership</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Format
            </label>
            <select
              name="format"
              value={filters.format}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
              <option value="">All Formats</option>
              <option value="online">Online</option>
              <option value="in-person">In Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Training List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : trainings.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No training modules found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <div
              key={training._id}
              className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBook className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {training.title}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaChalkboardTeacher className="mr-2" />
                      {training.instructor}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                  {training.category}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-gray-600 flex items-center">
                  <FaClock className="mr-2" />
                  {training.duration}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FaUserGraduate className="mr-2" />
                  {training.level}
                </p>
              </div>

              <p className="mt-4 text-gray-600 line-clamp-2">
                {training.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(training.created_at).toLocaleDateString()}
                </span>
                <Link
                  to={`/training/${training._id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingList;
