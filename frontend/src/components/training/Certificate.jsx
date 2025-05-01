import React from "react";

const Certificate = ({ data }) => {
  const {
    name,
    certificate_type,
    module_title,
    score,
    issue_date,
    expiry_date,
    certificate_number,
  } = data;

  return (
    <div className="certificate-container bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto my-8">
      <div className="border-4 border-blue-600 p-8 relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-blue-600 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-600 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-600 rounded-br-lg"></div>

        {/* Certificate content */}
        <div className="text-center relative z-10">
          {/* Title */}
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Certificate of Completion
          </h1>

          {/* Certificate Type */}
          <h2 className="text-3xl font-bold text-blue-500 mb-8">
            {certificate_type === "trainer"
              ? "Master Trainer Certificate"
              : "Course Completion Certificate"}
          </h2>

          {/* Recipient Name */}
          <div className="text-4xl font-bold text-gray-800 mb-6">{name}</div>

          {/* Certificate Text */}
          <div className="text-xl text-gray-600 mb-6">
            <p>has successfully completed</p>
            <p>the training program</p>
          </div>

          {/* Training Details */}
          <div className="text-2xl font-bold text-gray-800 mb-6">
            {module_title}
          </div>

          {/* Score for Learners */}
          {certificate_type === "learner" && score && (
            <div className="text-xl text-gray-600 mb-6">
              with a score of {score}%
            </div>
          )}

          {/* Dates */}
          <div className="text-lg text-gray-600 mb-6">
            <p>Issued on: {issue_date}</p>
            <p>Valid until: {expiry_date}</p>
          </div>

          {/* Certificate Number */}
          <div className="text-sm text-gray-500">
            Certificate Number: {certificate_number}
          </div>

          {/* Signature */}
          <div className="mt-12">
            <div className="border-t-2 border-gray-400 w-48 mx-auto mb-4"></div>
            <div className="text-lg font-bold text-gray-800">
              Authorized Signature
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
