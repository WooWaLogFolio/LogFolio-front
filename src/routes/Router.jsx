import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import OnboardingPage from "../pages/OnboardingPage";
import ArchivePage from "../pages/ArchivePage";
import ExperienceUploadPage from "../pages/ExperienceUploadPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/experience-upload" element={<ExperienceUploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
