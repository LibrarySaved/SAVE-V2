import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme, APP_NAME, APP_TAGLINE } from "@/App";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";
import { Logo, LogoIcon } from "@/components/Logo";
import { 
  Bookmark, Layers, Search, Sparkles, Zap, Shield, 
  ArrowRight, Check, Moon, Sun, Menu, X, Heart, Gift, Palette
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaPinterest, FaLinkedin } from "react-icons/fa6";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { colors } = useThemeCustomization();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="small" onClick={() => navigate("/")} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="rounded-full px-6"
                style={{ backgroundColor: colors.primary }}
                data-testid="go-to-dashboard-btn"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="rounded-full px-6"
                style={{ backgroundColor: colors.primary }}
                data-testid="get-started-btn"
              >
                Commencer gratuitement
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button 
              onClick={() => { navigate(user ? "/dashboard" : "/login"); setMobileMenuOpen(false); }} 
              className="w-full rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              {user ? "Dashboard" : "Commencer gratuitement"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors } = useThemeCustomization();

  const platforms = [
    { icon: FaInstagram, color: "text-pink-500", name: "Instagram" },
    { icon: FaTiktok, color: "text-foreground", name: "TikTok" },
    { icon: FaYoutube, color: "text-red-500", name: "YouTube" },
    { icon: FaXTwitter, color: "text-foreground", name: "X" },
    { icon: FaPinterest, color: "text-red-600", name: "Pinterest" },
    { icon: FaLinkedin, color: "text-blue-600", name: "LinkedIn" },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Glow Effects */}
      <div 
        className="absolute -z-10 blur-3xl opacity-30 top-20 -left-40"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          width: '600px',
          height: '600px',
          borderRadius: '50%'
        }}
      />
      <div 
        className="absolute -z-10 blur-3xl opacity-20 bottom-20 -right-40"
        style={{ 
          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
          width: '600px',
          height: '600px',
          borderRadius: '50%'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Logo size="hero" showTagline />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{ 
              backgroundColor: `${colors.primary}10`,
              borderColor: `${colors.primary}30`
            }}
          >
            <Gift className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-medium">100% Gratuit - Pour toujours</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 font-['Outfit']">
            Votre mémoire digitale
            <br />
            <span style={{ color: colors.primary }}>personnalisée</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Sauvegardez, organisez et retrouvez instantanément tout ce que vous aimez sur les réseaux sociaux. 
            L'IA enrichit et catégorise automatiquement vos contenus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ backgroundColor: colors.primary }}
              data-testid="hero-cta-btn"
            >
              Commencer maintenant <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Free Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>Saves illimités</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>Analyse IA automatique</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>Interface personnalisable</span>
            </div>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Compatible avec :</span>
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image/Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1920"
              alt="saved. Dashboard Preview"
              className="w-full h-auto opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const { colors } = useThemeCustomization();

  const features = [
    {
      icon: Layers,
      title: "Bibliothèque unifiée",
      description: "Tous vos posts, reels, pins et favoris de chaque plateforme réunis en un seul endroit organisé."
    },
    {
      icon: Sparkles,
      title: "IA intelligente",
      description: "L'IA analyse, résume et catégorise automatiquement chaque contenu que vous sauvegardez."
    },
    {
      icon: Search,
      title: "Recherche sémantique",
      description: "Retrouvez vos contenus en langage naturel : 'la recette de pâtes de la semaine dernière'."
    },
    {
      icon: Zap,
      title: "Sauvegarde instantanée",
      description: "Extension navigateur et partage mobile pour sauvegarder en un seul clic."
    },
    {
      icon: Palette,
      title: "Personnalisation totale",
      description: "Faites de saved. le reflet de votre personnalité avec des thèmes et couleurs personnalisés."
    },
    {
      icon: Heart,
      title: "Favoris & Tags IA",
      description: "Marquez vos contenus préférés et laissez l'IA ajouter des tags intelligents automatiquement."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span 
            className="text-sm font-bold uppercase tracking-widest mb-4 block"
            style={{ color: colors.primary }}
          >
            Fonctionnalités
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-['Outfit']">
            Tout ce qu'il faut pour rester organisé
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conçu pour les passionnés de contenu qui sauvegardent sur plusieurs plateformes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: colors.primary }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-['Outfit']">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BusinessModelSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors } = useThemeCustomization();

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span 
            className="text-sm font-bold uppercase tracking-widest mb-4 block"
            style={{ color: colors.primary }}
          >
            Notre modèle
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-['Outfit']">
            Gratuit pour tout le monde
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comme vos réseaux sociaux préférés, saved. est entièrement gratuit et financé par la publicité.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border p-8 md:p-12"
          style={{ 
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                <Gift className="w-4 h-4" />
                100% Gratuit
              </div>
              <h3 className="text-2xl font-bold mb-4 font-['Outfit']">Aucune limite, aucun frais</h3>
              <ul className="space-y-3">
                {[
                  "Saves illimités sur toutes les plateformes",
                  "Analyse IA automatique de chaque contenu",
                  "Recherche sémantique intelligente",
                  "Interface entièrement personnalisable",
                  "Extension navigateur & partage mobile"
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.primary }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black font-['Outfit'] mb-2" style={{ color: colors.primary }}>0€</div>
              <p className="text-muted-foreground mb-6">pour toujours</p>
              <Button
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
                data-testid="free-cta-btn"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Des publicités non-intrusives nous permettent de garder le service gratuit pour tous.
        </p>
      </div>
    </section>
  );
};

const Footer = () => {
  const { colors } = useThemeCustomization();

  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" />
          <p className="text-sm text-muted-foreground">
            © 2026 saved. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">CGU</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BusinessModelSection />
      <Footer />
    </div>
  );
}
