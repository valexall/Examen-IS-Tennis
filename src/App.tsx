import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider, useAuth } from "./components/AuthContext";

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  if (isAuthenticated && currentUser) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {currentView === "login" ? (
        <LoginPage onSwitchToRegister={() => setCurrentView("register")} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setCurrentView("login")} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
