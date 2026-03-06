import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import HealthProfile from "./pages/HealthProfile";
import FoodResult from "./pages/FoodResult";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Health Profile (Protected) */}
        <Route
          path="/health-profile"
          element={
            <ProtectedRoute>
              <HealthProfile />
            </ProtectedRoute>
          }
        />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* History Page (Protected) */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Result Page (Protected) */}
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <FoodResult />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
