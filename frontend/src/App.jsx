import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import JobListings from "./components/jobs/JobListings";
import JobDetails from "./components/jobs/JobDetails";
import PostJob from "./components/jobs/PostJob";
import TrainingListView from "./components/training/TrainingListView";
import TrainingLessons from "./components/training/TrainingLessons";
import PostTraining from "./components/training/PostTraining";
import SearchTraining from "./components/training/SearchTraining";
import "./App.css";

// Initialize language from localStorage or default to English
const savedLanguage = localStorage.getItem("language") || "en";
i18n.changeLanguage(savedLanguage);

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/post" element={<PostJob />} />
              <Route
                path="/jobs/search"
                element={<JobListings showSearch={true} />}
              />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/training" element={<TrainingListView />} />
              <Route path="/training/post" element={<PostTraining />} />
              <Route path="/training/search" element={<SearchTraining />} />
              <Route path="/training/:id" element={<TrainingLessons />} />
            </Routes>
          </main>
        </div>
      </Router>
    </I18nextProvider>
  );
};

export default App;
