import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError("Error loading job details. Please try again later.");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || "Job not found"}</p>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Job Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Job Listings
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBriefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-xl text-gray-600 flex items-center mt-2">
                <FaBuilding className="mr-2" />
                {job.company}
              </p>
            </div>
          </div>
          <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            {job.job_type === "formal" ? "Formal" : "Informal"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2" />
            <span>{job.salary_range}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-500">
            Posted on{" "}
            {job.posted_date
              ? new Date(job.posted_date).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </div>
          <button
            onClick={() =>
              (window.location.href = `mailto:${
                job.contact_email || "contact@example.com"
              }`)
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
