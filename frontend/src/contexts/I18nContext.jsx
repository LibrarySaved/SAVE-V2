import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  fr: {
    // Nav
    "nav.login": "Connexion",
    "nav.start_free": "Commencer gratuitement",

    // Hero
    "hero.badge": "100% Gratuit - Pour toujours",
    "hero.title.line1": "Votre mémoire digitale",
    "hero.title.line2": "personnalisée",
    "hero.subtitle":
      "Sauvegardez, organisez et retrouvez instantanément tout ce que vous aimez sur les réseaux sociaux. L'IA enrichit et catégorise automatiquement vos contenus.",
    "hero.cta": "Commencer maintenant",
    "hero.feat.unlimited": "Saves illimités",
    "hero.feat.ai": "Analyse IA automatique",
    "hero.feat.custom": "Interface personnalisable",
    "hero.compatible": "Compatible avec :",

    // Pitch banner (replaces Netflix-style image)
    "pitch.eyebrow": "Pourquoi saved.",
    "pitch.headline": "Vous êtes fatigué de sauvegarder du contenu et de ne jamais le retrouver ?",
    "pitch.cta": "saved. est fait pour vous.",
    "pitch.create": "Créez votre univers.",
    "pitch.regroup": "Regroupez vos idées et le contenu que vous souhaitez regarder à nouveau.",
    "pitch.share": "Partagez avec vos amis et followers, facilement.",
    "pitch.custom": "Personnalisable à 100% : saved. est le miroir de vos réseaux sociaux préférés.",

    // Features
    "features.eyebrow": "Fonctionnalités",
    "features.title": "Tout ce qu'il faut pour rester organisé",
    "features.subtitle": "Conçu pour les passionnés de contenu qui sauvegardent sur plusieurs plateformes.",
    "features.lib.title": "Bibliothèque unifiée",
    "features.lib.desc": "Tous vos posts, reels, pins et favoris de chaque plateforme réunis en un seul endroit organisé.",
    "features.ai.title": "IA intelligente",
    "features.ai.desc": "L'IA analyse, résume et catégorise automatiquement chaque contenu que vous sauvegardez.",
    "features.search.title": "Recherche sémantique",
    "features.search.desc": "Retrouvez vos contenus en langage naturel : « la recette de pâtes de la semaine dernière ».",
    "features.save.title": "Sauvegarde instantanée",
    "features.save.desc": "Extension navigateur et partage mobile pour sauvegarder en un seul clic.",
    "features.custom.title": "Personnalisation totale",
    "features.custom.desc": "Faites de saved. le reflet de votre personnalité avec des thèmes et couleurs personnalisés.",
    "features.fav.title": "Favoris & Tags IA",
    "features.fav.desc": "Marquez vos contenus préférés et laissez l'IA ajouter des tags intelligents automatiquement.",

    // Business model
    "biz.eyebrow": "Notre modèle",
    "biz.title": "Gratuit pour tout le monde",
    "biz.subtitle": "Comme vos réseaux sociaux préférés, saved. est entièrement gratuit et financé par la publicité.",
    "biz.badge_free": "100% Gratuit",
    "biz.no_limit": "Aucune limite, aucun frais",
    "biz.feat.1": "Saves illimités sur toutes les plateformes",
    "biz.feat.2": "Analyse IA automatique de chaque contenu",
    "biz.feat.3": "Recherche sémantique intelligente",
    "biz.feat.4": "Interface entièrement personnalisable",
    "biz.feat.5": "Extension navigateur & partage mobile",
    "biz.price_label": "pour toujours",
    "biz.cta": "Commencer maintenant",
    "biz.ads_note": "Des publicités non-intrusives nous permettent de garder le service gratuit pour tous.",

    // Footer
    "footer.copyright": "© 2026 saved. Tous droits réservés.",
    "footer.privacy": "Confidentialité",
    "footer.terms": "CGU",
    "footer.contact": "Contact",

    // Footer/lang
    "lang.label": "Langue",
    "lang.fr": "Français",
    "lang.en": "English",
    "lang.coming_soon": "Plus de langues bientôt disponibles (DeepL).",

    // Memories widget
    "memories.title": "Souvenirs",
    "memories.subtitle": "Vos contenus sauvegardés à cette même date",
    "memories.empty.title": "Pas encore de souvenirs",
    "memories.empty.desc": "Revenez dans quelques mois pour redécouvrir vos contenus.",
    "memories.see_all": "Voir tout",
    "memories.items_count": "{count} contenu(s)",
    "memories.bucket.1_month": "Il y a 1 mois",
    "memories.bucket.3_months": "Il y a 3 mois",
    "memories.bucket.6_months": "Il y a 6 mois",
    "memories.bucket.1_year": "Il y a 1 an",
    "memories.bucket.2_years": "Il y a 2 ans",
    "memories.bucket.3_years": "Il y a 3 ans",
    "memories.bucket.5_years": "Il y a 5 ans",
  },
  en: {
    "nav.login": "Sign in",
    "nav.start_free": "Get started — free",

    "hero.badge": "100% Free — Forever",
    "hero.title.line1": "Your personal",
    "hero.title.line2": "digital memory",
    "hero.subtitle":
      "Save, organize and instantly find everything you love on social media. AI automatically enriches and categorizes your content.",
    "hero.cta": "Start now",
    "hero.feat.unlimited": "Unlimited saves",
    "hero.feat.ai": "Automatic AI analysis",
    "hero.feat.custom": "Customizable interface",
    "hero.compatible": "Compatible with:",

    "pitch.eyebrow": "Why saved.",
    "pitch.headline": "Tired of saving content and never finding it again?",
    "pitch.cta": "saved. was built for you.",
    "pitch.create": "Build your own universe.",
    "pitch.regroup": "Gather your ideas and the content you want to watch again.",
    "pitch.share": "Share it with your friends and followers, effortlessly.",
    "pitch.custom": "100% customizable — saved. is the mirror of your favorite social networks.",

    "features.eyebrow": "Features",
    "features.title": "Everything you need to stay organized",
    "features.subtitle": "Built for content lovers who save across multiple platforms.",
    "features.lib.title": "Unified library",
    "features.lib.desc": "All your posts, reels, pins and favorites from every platform — gathered in one organized space.",
    "features.ai.title": "Smart AI",
    "features.ai.desc": "AI automatically analyzes, summarizes and categorizes every piece of content you save.",
    "features.search.title": "Semantic search",
    "features.search.desc": "Find your content in plain language: \"that pasta recipe from last week\".",
    "features.save.title": "Instant saves",
    "features.save.desc": "Browser extension and mobile share so you can save anything in a single click.",
    "features.custom.title": "Total customization",
    "features.custom.desc": "Make saved. yours with personalized themes and color palettes.",
    "features.fav.title": "Favorites & AI tags",
    "features.fav.desc": "Star your top picks and let AI add intelligent tags for you, automatically.",

    // Business model
    "biz.eyebrow": "Our model",
    "biz.title": "Free for everyone",
    "biz.subtitle": "Just like your favorite social networks, saved. is entirely free and ad-supported.",
    "biz.badge_free": "100% Free",
    "biz.no_limit": "No limits, no fees",
    "biz.feat.1": "Unlimited saves across every platform",
    "biz.feat.2": "Automatic AI analysis on every save",
    "biz.feat.3": "Smart semantic search",
    "biz.feat.4": "Fully customizable interface",
    "biz.feat.5": "Browser extension & mobile share",
    "biz.price_label": "forever",
    "biz.cta": "Start now",
    "biz.ads_note": "Non-intrusive ads keep saved. free for everyone.",

    // Footer
    "footer.copyright": "© 2026 saved. All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",

    "lang.label": "Language",
    "lang.fr": "Français",
    "lang.en": "English",
    "lang.coming_soon": "More languages coming soon (powered by DeepL).",

    "memories.title": "Memories",
    "memories.subtitle": "Content you saved on this same date",
    "memories.empty.title": "No memories yet",
    "memories.empty.desc": "Come back in a few months to rediscover your saves.",
    "memories.see_all": "See all",
    "memories.items_count": "{count} item(s)",
    "memories.bucket.1_month": "1 month ago",
    "memories.bucket.3_months": "3 months ago",
    "memories.bucket.6_months": "6 months ago",
    "memories.bucket.1_year": "1 year ago",
    "memories.bucket.2_years": "2 years ago",
    "memories.bucket.3_years": "3 years ago",
    "memories.bucket.5_years": "5 years ago",
  },
};

export const SUPPORTED_LANGS = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export const COMING_SOON_LANGS = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const I18nContext = createContext();

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("saved_lang");
    if (saved && translations[saved]) return saved;
    // Auto-detect browser
    const browser = (navigator.language || "fr").slice(0, 2);
    return translations[browser] ? browser : "fr";
  });

  useEffect(() => {
    localStorage.setItem("saved_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] ?? translations.fr[key] ?? key;
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
    return str;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, supported: SUPPORTED_LANGS, comingSoon: COMING_SOON_LANGS }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
