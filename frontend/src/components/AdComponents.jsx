import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Composant de bannière publicitaire
export const AdBanner = ({ position = "horizontal", className = "" }) => {
  // Simulation de différentes publicités
  const ads = [
    {
      id: 1,
      title: "Créez des vidéos virales",
      description: "Outils de montage pro pour créateurs",
      sponsor: "VideoMaster Pro",
      image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=400&q=80",
      link: "#",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Boostez votre audience",
      description: "Analytics et insights pour réseaux sociaux",
      sponsor: "SocialBoost",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
      link: "#",
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      title: "Templates premium",
      description: "Des milliers de templates pour vos posts",
      sponsor: "DesignHub",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=400&q=80",
      link: "#",
      color: "from-orange-500 to-red-500"
    }
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  if (position === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border border-border bg-card ${className}`}
        data-testid="ad-sidebar"
      >
        <div className="relative">
          <img
            src={randomAd.image}
            alt=""
            className="w-full h-32 object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${randomAd.color} opacity-60`} />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white">
            Sponsorisé
          </span>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-sm mb-1 font-['Outfit']">{randomAd.title}</h4>
          <p className="text-xs text-muted-foreground mb-3">{randomAd.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{randomAd.sponsor}</span>
            <a
              href={randomAd.link}
              className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
            >
              En savoir plus <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Bannière horizontale
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl overflow-hidden border border-border bg-card ${className}`}
      data-testid="ad-banner"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex-shrink-0">
          <img
            src={randomAd.image}
            alt=""
            className="w-20 h-20 rounded-xl object-cover"
          />
          <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground">
            Ad
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-0.5 font-['Outfit']">{randomAd.title}</h4>
          <p className="text-xs text-muted-foreground mb-2 truncate">{randomAd.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{randomAd.sponsor}</span>
            <a
              href={randomAd.link}
              className={`text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${randomAd.color} text-white hover:opacity-90 transition-opacity`}
            >
              Découvrir
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Publicité native dans le feed (entre les contenus)
export const AdNative = ({ className = "" }) => {
  const nativeAds = [
    {
      platform: "instagram",
      author: "CreatorTools",
      title: "Automatisez vos publications Instagram",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      platform: "youtube",
      author: "TubeGrowth",
      title: "Gagnez 10K abonnés en 30 jours",
      thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      platform: "tiktok",
      author: "TrendMaster",
      title: "Trouvez les tendances avant tout le monde",
      thumbnail: "https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=400&q=80",
      link: "#"
    }
  ];

  const randomAd = nativeAds[Math.floor(Math.random() * nativeAds.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all ${className}`}
      data-testid="ad-native"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={randomAd.thumbnail}
          alt={randomAd.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500 text-white">
          Sponsorisé
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-['Outfit']">{randomAd.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">par {randomAd.author}</p>
        <a
          href={randomAd.link}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          En savoir plus <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

// Bannière sticky en bas de page
export const AdStickyFooter = ({ onClose }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-64 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-border"
      data-testid="ad-sticky-footer"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
            Publicité
          </span>
          <p className="text-sm">
            <span className="font-medium">Découvrez ContentPro</span>
            <span className="text-muted-foreground"> - La suite complète pour créateurs de contenu</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Essayer gratuit
          </a>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Fermer
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default { AdBanner, AdNative, AdStickyFooter };
