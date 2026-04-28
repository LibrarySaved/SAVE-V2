import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme, API } from "@/App";
import { toast } from "sonner";
import {
  Bookmark, ArrowLeft, Moon, Sun, LogOut, User,
  Database, FolderOpen, BarChart3, Mail, Calendar
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaPinterest, FaLinkedin } from "react-icons/fa6";

const platformIcons = {
  instagram: { icon: FaInstagram, color: "text-pink-500", bg: "bg-pink-500/10" },
  tiktok: { icon: FaTiktok, color: "text-foreground", bg: "bg-foreground/10" },
  youtube: { icon: FaYoutube, color: "text-red-500", bg: "bg-red-500/10" },
  twitter: { icon: FaXTwitter, color: "text-foreground", bg: "bg-foreground/10" },
  pinterest: { icon: FaPinterest, color: "text-red-600", bg: "bg-red-600/10" },
  linkedin: { icon: FaLinkedin, color: "text-blue-600", bg: "bg-blue-600/10" }
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${API}/user/stats`, { withCredentials: true });
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-accent"
                data-testid="back-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold font-['Outfit']">Paramètres</h1>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 font-['Outfit'] flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil
          </h2>
          
          <div className="flex items-center gap-6">
            {user?.picture ? (
              <img src={user.picture} alt="" className="w-20 h-20 rounded-2xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0] || "U"}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold font-['Outfit']">{user?.name}</h3>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Membre depuis le {new Date(user?.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Usage Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 font-['Outfit'] flex items-center gap-2">
            <Database className="w-5 h-5" />
            Utilisation
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Contenus sauvegardés</span>
              </div>
              <p className="text-3xl font-bold font-['Outfit']">{stats?.total_saves || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Illimité</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-center gap-3 mb-2">
                <FolderOpen className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">Collections</span>
              </div>
              <p className="text-3xl font-bold font-['Outfit']">{stats?.total_collections || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Illimité</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
            <p className="text-sm">
              <span className="font-medium">100% Gratuit</span> - SaveStack est financé par la publicité pour rester accessible à tous.
            </p>
          </div>
        </motion.section>

        {/* Analytics Section */}
        {stats && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold mb-6 font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Statistiques
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl bg-muted p-4">
                <p className="text-2xl font-bold font-['Outfit']">{stats.total_saves}</p>
                <p className="text-sm text-muted-foreground">Total saves</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-2xl font-bold font-['Outfit']">{stats.total_collections}</p>
                <p className="text-sm text-muted-foreground">Collections</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-2xl font-bold font-['Outfit']">{stats.recent_activity}</p>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-2xl font-bold font-['Outfit']">{Object.keys(stats.saves_by_platform).length}</p>
                <p className="text-sm text-muted-foreground">Plateformes</p>
              </div>
            </div>

            {/* Saves by Platform */}
            {Object.keys(stats.saves_by_platform).length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-4">Saves par plateforme</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.saves_by_platform).map(([platform, count]) => {
                    const platformData = platformIcons[platform];
                    const Icon = platformData?.icon || Bookmark;
                    return (
                      <div
                        key={platform}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${platformData?.bg || "bg-muted"}`}
                      >
                        <Icon className={`w-4 h-4 ${platformData?.color || ""}`} />
                        <span className="text-sm font-medium capitalize">{platform}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <h2 className="text-lg font-semibold mb-4 font-['Outfit'] text-destructive flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Actions du compte
          </h2>
          
          <p className="text-sm text-muted-foreground mb-4">
            Déconnectez-vous de votre compte sur cet appareil.
          </p>
          
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="rounded-full"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </motion.section>
      </main>
    </div>
  );
}
