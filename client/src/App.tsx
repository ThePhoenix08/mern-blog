import { Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./components/feature/authentication/ForgotPasswordPage";
import LoginPage from "./components/feature/authentication/LoginPage";
import SignUpPage from "./components/feature/authentication/SignUpPage";
import EditBlogPage from "./components/feature/blog/EditBlogPage";
import ReadBlogPage from "./components/feature/blog/ReadBlogPage";
import LandingPage from "./components/feature/core/LandingPage";
import ViewBlogsPage from "./components/feature/listBlogs/ViewBlogsPage";
import MessagesPage from "./components/feature/profile/MessagesPage";
import ProfilePage from "./components/feature/profile/ProfilePage";
import SettingsPage from "./components/feature/profile/SettingsPage";
import SubscribtionsPage from "./components/feature/profile/SubscribtionsPage";
import DashboardPage from "./components/feature/analytics/DashboardPage";
import NotFoundPage from "./components/feature/authentication/NotFoundPage";
import AppWrapper from "./components/feature/core/AppWrapper";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUpAxiosInterceptor } from "./api/axiosInstance";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    setUpAxiosInterceptor(navigate);
  }, [navigate]);

  return (
    <div className="app font-['Inter']">
      <Routes>
        <Route path="/" element={<LandingPage />} index />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/app" element={<AppWrapper />}>
          <Route path="profile/:userName" element={<ProfilePage />} />
          <Route path="profile/settings" element={<SettingsPage />} />
          <Route path="profile/subscribtions" element={<SubscribtionsPage />} />
          <Route path="profile/messages" element={<MessagesPage />} />

          <Route path="blog/:id/edit" element={<EditBlogPage />} />
          <Route path="blog/:id/read" element={<ReadBlogPage />} />

          <Route path="blogs/:filter" element={<ViewBlogsPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "toast-container",
          duration: 5000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            borderRadius: "var(--radius)",
            padding: "1rem",
            fontSize: "1rem",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </div>
  );
}

export default App;
