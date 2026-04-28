import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme, APP_NAME, APP_TAGLINE } from "@/App";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";
import { Logo } from "@/components/Logo";
import { Moon, Sun, Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { colors } = useThemeCustomization();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative"
        style={{ backgroundColor: colors.sidebar }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-between p-12" style={{ color: colors.sidebarText }}>
          <Logo size="large" showTagline onClick={() => navigate("/")} />

          <div className="max-w-md">
            <h1 className="text-4xl font-black mb-6 font-['Outfit']">
              Votre bibliothèque digitale personnelle
            </h1>
            <p className="text-lg opacity-80 leading-relaxed">
              Rejoignez des milliers d'utilisateurs qui utilisent saved. pour organiser leurs contenus favoris et les retrouver instantanément grâce à l'IA.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full border-2"
                  style={{ 
                    backgroundColor: `${colors.primary}${30 + i * 15}`,
                    borderColor: colors.sidebar
                  }}
                />
              ))}
            </div>
            <p className="text-sm opacity-80">
              <span className="font-bold" style={{ color: colors.sidebarText }}>10,000+</span> utilisateurs actifs
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Logo size="small" onClick={() => navigate("/")} />
          </div>
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              data-testid="login-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 font-['Outfit']">Bienvenue</h2>
              <p className="text-muted-foreground">
                Connectez-vous pour accéder à votre bibliothèque
              </p>
            </div>

            <div className="space-y-4">
              {/* Google Sign In */}
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                size="lg"
                className="w-full rounded-xl py-6 text-base font-medium hover:bg-accent transition-all"
                data-testid="google-signin-btn"
              >
                <FaGoogle className="w-5 h-5 mr-3" />
                Continuer avec Google
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Email - Coming Soon */}
              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-xl py-6 text-base font-medium opacity-60 cursor-not-allowed"
                disabled
                data-testid="email-signin-btn"
              >
                <Mail className="w-5 h-5 mr-3" />
                Email (bientôt disponible)
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              En continuant, vous acceptez nos{" "}
              <a href="#" className="text-foreground hover:underline">Conditions d'utilisation</a>
              {" "}et notre{" "}
              <a href="#" className="text-foreground hover:underline">Politique de confidentialité</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
