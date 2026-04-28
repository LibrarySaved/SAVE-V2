import { useEffect, useState, createContext, useContext, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Sparkles, AlertTriangle } from "lucide-react";
import { ThemeCustomizationProvider } from "@/contexts/ThemeCustomizationContext";
import { I18nProvider } from "@/contexts/I18nContext";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CollectionsPage from "@/pages/CollectionsPage";
import SettingsPage from "@/pages/SettingsPage";
import SharePage from "@/pages/SharePage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// App name and branding
export const APP_NAME = "saved.";
export const APP_TAGLINE = "your digital library";

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Notifications Context for AI processing updates
const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used within NotificationsProvider");
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [processingItems, setProcessingItems] = useState(new Set());
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_notifications_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persistHistory = (next) => {
    setHistory(next);
    try {
      localStorage.setItem("saved_notifications_history", JSON.stringify(next.slice(0, 50)));
    } catch {
      // ignore quota errors
    }
  };

  const addNotification = ({ type = "info", title, message, contentId } = {}) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      message,
      contentId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    persistHistory([entry, ...history].slice(0, 50));

    // Show in-app toast via sonner
    const opts = {
      description: message,
      duration: 5000,
      icon: type === "success"
        ? <Sparkles className="w-4 h-4" />
        : type === "error"
          ? <AlertTriangle className="w-4 h-4" />
          : undefined,
    };
    if (type === "success") toast.success(title, opts);
    else if (type === "error") toast.error(title, opts);
    else toast(title, opts);

    return entry.id;
  };

  const markAllRead = () => {
    persistHistory(history.map((n) => ({ ...n, read: true })));
  };

  const clearHistory = () => {
    persistHistory([]);
  };

  const trackProcessing = (contentId) => {
    setProcessingItems((prev) => new Set([...prev, contentId]));
  };

  const completeProcessing = (contentId, success = true, contentTitle = "") => {
    setProcessingItems((prev) => {
      const next = new Set(prev);
      next.delete(contentId);
      return next;
    });

    addNotification({
      type: success ? "success" : "error",
      title: success ? "Analyse IA terminée" : "Échec de l'analyse IA",
      message: success
        ? (contentTitle ? `« ${contentTitle} » a été analysé et enrichi.` : "Votre contenu a été enrichi par l'IA.")
        : "L'analyse IA a échoué. Vous pouvez relancer le traitement.",
      contentId,
    });
  };

  const unreadCount = history.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{
      history,
      unreadCount,
      processingItems,
      addNotification,
      markAllRead,
      clearHistory,
      trackProcessing,
      completeProcessing,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Auth Callback Component
const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      const hash = window.location.hash;
      const sessionIdMatch = hash.match(/session_id=([^&]+)/);
      
      if (!sessionIdMatch) {
        navigate("/login");
        return;
      }

      const sessionId = sessionIdMatch[1];

      try {
        const response = await axios.post(
          `${API}/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );
        
        setUser(response.data.user);
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/dashboard", { replace: true, state: { user: response.data.user } });
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    processAuth();
  }, [navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Connexion en cours...</p>
      </div>
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// App Router
const AppRouter = () => {
  const location = useLocation();
  
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/share" element={<SharePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections"
        element={
          <ProtectedRoute>
            <CollectionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemeCustomizationProvider>
        <I18nProvider>
          <BrowserRouter>
            <AuthProvider>
              <NotificationsProvider>
                <AppRouter />
                <Toaster position="top-right" />
              </NotificationsProvider>
            </AuthProvider>
          </BrowserRouter>
        </I18nProvider>
      </ThemeCustomizationProvider>
    </ThemeProvider>
  );
}

export default App;
