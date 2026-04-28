import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme } from "@/App";
import { Bookmark, Moon, Sun, Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl font-['Outfit']">SaveStack</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-black mb-6 font-['Outfit']">
              Your digital life, beautifully organized
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Join thousands of creators and curators who use SaveStack to keep their saved content organized and accessible.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/30 border-2 border-white/50" />
              ))}
            </div>
            <p className="text-sm text-white/80">
              <span className="font-bold text-white">10,000+</span> happy users
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl font-['Outfit']">SaveStack</span>
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
              <h2 className="text-3xl font-bold mb-3 font-['Outfit']">Welcome back</h2>
              <p className="text-muted-foreground">
                Sign in to access your saved content
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
                Continue with Google
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">or</span>
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
                Email sign in (Coming soon)
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              By continuing, you agree to our{" "}
              <a href="#" className="text-foreground hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
