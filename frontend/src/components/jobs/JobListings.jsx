import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const JobListings = ({ showSearch = false }) => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [filters, setFilters] = useState({
    job_type: "",
    location: "",
    sector: "",
  });

  useEffect(() => {
    if (showSearch) {
      fetchJobs();
    }
  }, [filters, showSearch]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: filters,
      });
      // Ensure we're working with an array
      const jobsData = Array.isArray(response.data) ? response.data : [];
      console.log("Jobs data:", jobsData); // Debug log
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      if (!jobId) {
        console.error("Invalid job ID");
        return;
      }
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`);
      setAppliedJobs((prev) => new Set([...prev, jobId]));
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, applied: true } : job
        )
      );
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const jobTypes = [
    {
      value: "formal",
      label: t("jobs.formal"),
      description: t("jobs.formalDescription"),
    },
    {
      value: "informal",
      label: t("jobs.informal"),
      description: t("jobs.informalDescription"),
    },
  ];

  // Landing page view
  if (!showSearch) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 transition-all duration-300 hover:text-blue-600">
          Jobs Section
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Post Job Card */}
          <Link to="/jobs/post" className="group">
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
                  Post a Job
                </h3>
                <p className="text-gray-600">
                  Create and share job opportunities with the community.
                </p>
              </div>
            </div>
          </Link>

          {/* Search Jobs Card */}
          <Link to="/jobs/search" className="group">
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
                  Search Jobs
                </h3>
                <p className="text-gray-600">
                  Browse through available job opportunities and find your next
                  career.
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
        Search Jobs
      </h2>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">Filters</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Job Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              name="job_type"
              value={filters.job_type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
              <option value="">All Types</option>
              <option value="formal">Formal (Corporate, Full-time)</option>
              <option value="informal">Informal (Freelance, Part-time)</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
             <option value="Bangaluru">Bangaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sector
            </label>
            <select
              name="sector"
              value={filters.sector}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300 outline-none"
            >
              <option value="">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No jobs found</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBriefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaBuilding className="mr-2" />
                      {job.company}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                  {job.job_type === "formal" ? "Formal" : "Informal"}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {job.location}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FaClock className="mr-2" />
                  {job.salary_range}
                </p>
              </div>

              <p className="mt-4 text-gray-600 line-clamp-2">
                {job.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(job.posted_date).toLocaleDateString()}
                </span>
                <button
                  onClick={() => (window.location.href = `/jobs/${job._id}`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
