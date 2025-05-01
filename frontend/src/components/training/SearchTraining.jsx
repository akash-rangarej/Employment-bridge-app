import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    format: "",
    searchQuery: "",
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/training");
      console.log("Fetched trainings:", response.data);
      setTrainings(response.data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
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

  const filteredTrainings = trainings.filter((training) => {
    const matchesCategory =
      !filters.category || training.category === filters.category;
    const matchesLevel = !filters.level || training.level === filters.level;
    const matchesFormat = !filters.format || training.format === filters.format;
    const matchesSearch =
      !filters.searchQuery ||
      training.title
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      training.description
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesFormat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
        Search Training Modules
      </h2>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Search by title or description..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">All Levels</option>
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
                value={filters.format}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
              >
                <option value="">All Formats</option>
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredTrainings.map((training) => (
            <div
              key={training._id}
              className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {training.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {training.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Category:</span>
                  {training.category}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Level:</span>
                  {training.level}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Duration:</span>
                  {training.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Format:</span>
                  {training.format}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Instructor:</span>
                  {training.instructor}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/training/${training._id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-blue-700"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTrainings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No training modules found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTraining;
