import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CertificateFormPopup from "./CertificateFormPopup";
import Certificate from "./Certificate";

const TrainingLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [fetchingCertificate, setFetchingCertificate] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);
  const { t } = useTranslation();

  // Function to check if user has a certificate for this training
  const checkForCertificate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/certifications/module/${id}`
      );
      if (response.data && response.data.certificate_id) {
        setHasCertificate(true);
        setCertificateData({
          ...response.data,
          module_title: training?.title,
          issue_date: new Date(response.data.issue_date).toLocaleDateString(),
          expiry_date: new Date(response.data.expiry_date).toLocaleDateString(),
        });
      } else {
        setHasCertificate(false);
      }
    } catch (err) {
      console.error("Error checking certificate:", err);
      setHasCertificate(false);
    }
  };

  // Function to fetch certificate data
  const fetchCertificateData = async () => {
    setFetchingCertificate(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/certifications/module/${id}`
      );

      if (response.data && response.data.certificate_id) {
        setCertificateData({
          ...response.data,
          module_title: training.title,
          issue_date: new Date(response.data.issue_date).toLocaleDateString(),
          expiry_date: new Date(response.data.expiry_date).toLocaleDateString(),
        });
        setShowCertificate(true);
      }
    } catch (err) {
      console.error("Error fetching certificate:", err);
      setError("Failed to load certificate data");
    } finally {
      setFetchingCertificate(false);
    }
  };

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        console.log("Training ID from params:", id); // Debug log

        if (!id) {
          console.error("No training ID provided");
          setError("Invalid training ID");
          setLoading(false);
          return;
        }

        console.log("Fetching training with ID:", id); // Debug log
        const response = await axios.get(
          `http://localhost:5000/training/${id}`
        );
        console.log("Training response:", response.data); // Debug log

        if (response.data) {
          setTraining(response.data);
          // Check for certificate after training data is loaded
          await checkForCertificate();
        } else {
          console.error("No training data received");
          setError("Training module not found");
        }
      } catch (err) {
        console.error("Error fetching training:", err);
        console.error("Error response:", err.response?.data); // Debug log
        setError(
          err.response?.data?.message || "Failed to load training module"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  const handleComplete = () => {
    setShowCertificateForm(true);
  };

  const handleCertificateSubmit = async (formData) => {
    setCompleting(true);
    setCompletionMessage("");
    setShowCertificateForm(false);

    try {
      console.log("Received form data:", formData); // Debug log

      // First, complete the training
      const completeResponse = await axios.post(
        `http://localhost:5000/training/${id}/complete`
      );

      // Then, issue the certificate
      const certificateData = {
        module_id: id,
        module_name: training.title,
        certificate_type: formData.certificate_type,
        name: formData.name,
        trainer_id: training.instructor,
      };

      // Add score only for learner certificates
      if (formData.certificate_type === "learner") {
        // Convert score to integer
        const score = parseInt(formData.score);
        if (isNaN(score) || score < 0 || score > 100) {
          throw new Error("Score must be between 0 and 100");
        }
        certificateData.score = score;
      }

      console.log("Certificate data being sent to backend:", certificateData); // Debug log

      const certificateResponse = await axios.post(
        "http://localhost:5000/certifications",
        certificateData
      );

      console.log("Certificate response:", certificateResponse.data); // Debug log

      if (certificateResponse.data && certificateResponse.data.certificate_id) {
        // Set certificate data and show certificate
        const newCertificateData = {
          ...certificateResponse.data,
          module_title: training.title,
          name: formData.name,
          certificate_type: formData.certificate_type,
          score:
            formData.certificate_type === "learner"
              ? parseInt(formData.score)
              : null,
          issue_date: new Date().toLocaleDateString(),
          expiry_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toLocaleDateString(),
          certificate_number: certificateResponse.data.certificate_id,
        };

        setCertificateData(newCertificateData);
        setShowCertificate(true);
        setHasCertificate(true);

        setCompletionMessage(
          `Congratulations ${formData.name}! Your certificate has been issued.`
        );
      } else {
        throw new Error("Certificate ID not received");
      }
    } catch (err) {
      console.error("Error completing training:", err);
      console.error("Error response:", err.response?.data); // Debug log
      if (err.response?.status === 400) {
        setCompletionMessage(
          err.response.data.message ||
            "Invalid certificate data. Please try again."
        );
      } else {
        setCompletionMessage("Failed to complete training. Please try again.");
      }
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Training module not found
        </div>
      </div>
    );
  }

  const isCompleted = hasCertificate;

  return (
    <div className="container mx-auto px-4 py-8">
      {showCertificate ? (
        <Certificate data={certificateData} />
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-blue-600 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">{training.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-blue-700 px-3 py-1 rounded-full">
                  {training.category}
                </span>
                <span className="bg-blue-700 px-3 py-1 rounded-full">
                  {training.level}
                </span>
                <span className="bg-blue-700 px-3 py-1 rounded-full">
                  {training.format}
                </span>
                <span className="bg-blue-700 px-3 py-1 rounded-full">
                  Duration: {training.duration}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {completionMessage && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    completionMessage.includes("successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {completionMessage}
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700">{training.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {Array.isArray(training.prerequisites) ? (
                    training.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))
                  ) : (
                    <li>
                      {training.prerequisites || "No prerequisites listed"}
                    </li>
                  )}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
                <p className="text-gray-700">{training.instructor}</p>
              </div>

              {training.videoUrl && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    Training Video
                  </h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={training.videoUrl}
                      title="Training Video"
                      className="w-full h-96 rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Training List
                </button>

                {isCompleted ? (
                  <button
                    onClick={fetchCertificateData}
                    disabled={fetchingCertificate}
                    className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
                      fetchingCertificate ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {fetchingCertificate ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading Certificate...
                      </div>
                    ) : (
                      "Show Certificate"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                      completing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {completing ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Completing...
                      </div>
                    ) : (
                      "Mark as Completed"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CertificateFormPopup
        isOpen={showCertificateForm}
        onClose={() => setShowCertificateForm(false)}
        onSubmit={handleCertificateSubmit}
        training={training}
      />
    </div>
  );
};

export default TrainingLessons;
