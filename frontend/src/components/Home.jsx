import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-down">
              {t("welcome.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up max-w-3xl mx-auto">
              {t("welcome.description")}
            </p>
            <div className="space-x-4 animate-fade-in-up">
              <button
                onClick={() => navigate("/jobs")}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg 
                         transform hover:scale-105 transition-all duration-300 
                         shadow-lg hover:shadow-xl active:scale-95 font-semibold"
              >
                {t("welcome.findJobs")}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-transparent text-white border-2 border-white px-8 py-4 
                         rounded-lg hover:bg-white/10 transform hover:scale-105 
                         transition-all duration-300 shadow-lg hover:shadow-xl 
                         active:scale-95 font-semibold"
              >
                {t("auth.register.title")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up">
              {t("features.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                          transform hover:-translate-y-1 transition-all duration-300 
                          border border-gray-100"
            >
              <div
                className="w-12 h-12 bg-primary-100 rounded-lg flex items-center 
                            justify-center mb-4"
              >
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.jobs.title")}
              </h3>
              <p className="text-gray-600">{t("features.jobs.description")}</p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                          transform hover:-translate-y-1 transition-all duration-300 
                          border border-gray-100"
            >
              <div
                className="w-12 h-12 bg-primary-100 rounded-lg flex items-center 
                            justify-center mb-4"
              >
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.training.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.training.description")}
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                          transform hover:-translate-y-1 transition-all duration-300 
                          border border-gray-100"
            >
              <div
                className="w-12 h-12 bg-primary-100 rounded-lg flex items-center 
                            justify-center mb-4"
              >
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.certifications.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.certifications.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-up max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary-600 text-white px-8 py-4 rounded-lg 
                     transform hover:scale-105 transition-all duration-300 
                     shadow-lg hover:shadow-xl active:scale-95 font-semibold"
          >
            {t("cta.button")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
