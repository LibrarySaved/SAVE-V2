import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme, APP_NAME, APP_TAGLINE } from "@/App";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";
import { useI18n } from "@/contexts/I18nContext";
import { Logo, LogoIcon } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  Bookmark, Layers, Search, Sparkles, Zap, Shield, 
  ArrowRight, Check, Moon, Sun, Menu, X, Heart, Gift, Palette,
  Quote, Users, Lightbulb
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaPinterest, FaLinkedin } from "react-icons/fa6";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { colors } = useThemeCustomization();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="small" onClick={() => navigate("/")} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
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
                {t("nav.start_free")}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
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
              {user ? "Dashboard" : t("nav.start_free")}
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
  const { t } = useI18n();

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
            <span className="text-sm font-medium">{t("hero.badge")}</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 font-['Outfit']">
            {t("hero.title.line1")}
            <br />
            <span style={{ color: colors.primary }}>{t("hero.title.line2")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
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
              {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Free Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>{t("hero.feat.unlimited")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>{t("hero.feat.ai")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" style={{ color: colors.primary }} />
              <span>{t("hero.feat.custom")}</span>
            </div>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-sm text-muted-foreground">{t("hero.compatible")}</span>
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

        {/* Pitch Banner — replaces previous full-bleed image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          <div
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16"
            style={{
              background: `linear-gradient(135deg, ${colors.sidebar} 0%, ${colors.primary}20 100%)`,
              border: `1px solid ${colors.primary}30`,
            }}
          >
            {/* Decorative blobs */}
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: colors.primary }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: colors.secondary }}
            />

            <div className="relative">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}40`,
                }}
              >
                <Quote className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: colors.primary }}
                >
                  {t("pitch.eyebrow")}
                </span>
              </div>

              {/* Question + answer */}
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-['Outfit'] mb-4 leading-tight"
                style={{ color: colors.sidebarText }}
              >
                {t("pitch.headline")}
              </h2>
              <p
                className="text-xl sm:text-2xl font-semibold mb-10 font-['Outfit']"
                style={{ color: colors.primary }}
              >
                {t("pitch.cta")}
              </p>

              {/* 3 promises grid */}
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: Lightbulb, text: t("pitch.create") },
                  { icon: Layers, text: t("pitch.regroup") },
                  { icon: Users, text: t("pitch.share") },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: colors.sidebarText, opacity: 0.9 }}
                    >
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Closing tagline */}
              <div
                className="mt-10 pt-6 flex items-center gap-3"
                style={{ borderTop: `1px solid ${colors.primary}30` }}
              >
                <Palette
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: colors.accent }}
                />
                <p
                  className="text-sm sm:text-base italic"
                  style={{ color: colors.sidebarText, opacity: 0.85 }}
                >
                  {t("pitch.custom")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const { colors } = useThemeCustomization();
  const { t } = useI18n();

  const features = [
    { icon: Layers, key: "lib" },
    { icon: Sparkles, key: "ai" },
    { icon: Search, key: "search" },
    { icon: Zap, key: "save" },
    { icon: Palette, key: "custom" },
    { icon: Heart, key: "fav" },
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
            {t("features.eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-['Outfit']">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
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
              <h3 className="text-xl font-bold mb-3 font-['Outfit']">{t(`features.${feature.key}.title`)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(`features.${feature.key}.desc`)}</p>
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
  const { t } = useI18n();

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
            {t("biz.eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-['Outfit']">
            {t("biz.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("biz.subtitle")}
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
                {t("biz.badge_free")}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-['Outfit']">{t("biz.no_limit")}</h3>
              <ul className="space-y-3">
                {["biz.feat.1", "biz.feat.2", "biz.feat.3", "biz.feat.4", "biz.feat.5"].map(key => (
                  <li key={key} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.primary }} />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black font-['Outfit'] mb-2" style={{ color: colors.primary }}>0€</div>
              <p className="text-muted-foreground mb-6">{t("biz.price_label")}</p>
              <Button
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
                data-testid="free-cta-btn"
              >
                {t("biz.cta")}
              </Button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {t("biz.ads_note")}
        </p>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" />
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</a>
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
