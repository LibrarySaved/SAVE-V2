import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API } from "@/App";
import { useI18n } from "@/contexts/I18nContext";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";

/**
 * "On This Day" memories widget — Google Photos style.
 * Fetches /api/content/memories/on-this-day and shows a compact carousel.
 */
export const OnThisDayWidget = () => {
  const { t, lang } = useI18n();
  const { colors } = useThemeCustomization();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    // Auto-dismiss for the day
    const today = new Date().toISOString().slice(0, 10);
    return localStorage.getItem("saved_memories_dismissed") === today;
  });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/content/memories/on-this-day`, {
          withCredentials: true,
        });
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setData({ buckets: [], total_memories: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed || loading) return null;
  if (!data || data.buckets.length === 0) return null;

  const bucket = data.buckets[activeIdx];
  const items = bucket?.items || [];

  const handleDismiss = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem("saved_memories_dismissed", today);
    setDismissed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden mb-8"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}08 50%, ${colors.accent}10 100%)`,
        border: `1px solid ${colors.primary}30`,
      }}
      data-testid="on-this-day-widget"
    >
      {/* Glow accent */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg font-['Outfit'] flex items-center gap-2">
                {t("memories.title")}
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold"
                  style={{
                    borderColor: `${colors.primary}50`,
                    color: colors.primary,
                  }}
                >
                  {data.total_memories}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("memories.subtitle")}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="rounded-full h-7 w-7 -mt-1 -mr-1"
            aria-label="Dismiss"
            data-testid="memories-dismiss-btn"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Bucket selector tabs */}
        {data.buckets.length > 1 && (
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
            {data.buckets.map((b, i) => (
              <button
                key={b.key}
                onClick={() => setActiveIdx(i)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: i === activeIdx ? colors.primary : "transparent",
                  color: i === activeIdx ? "white" : undefined,
                  border: i === activeIdx ? "none" : `1px solid ${colors.primary}40`,
                }}
                data-testid={`memories-bucket-${b.key}`}
              >
                {t(`memories.bucket.${b.key}`)} · {b.count}
              </button>
            ))}
          </div>
        )}

        {/* Items carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bucket?.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {items.slice(0, 4).map((item) => (
              <a
                key={item.content_id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-square bg-card border border-border hover:border-foreground/20 transition-all hover:scale-[1.02]"
                data-testid={`memory-item-${item.content_id}`}
              >
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)`,
                    }}
                  >
                    <Calendar className="w-8 h-8 text-white/70" />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                    {item.title || "Untitled"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                      {item.platform}
                    </span>
                  </div>
                </div>
                <ExternalLink className="absolute top-2 right-2 w-3.5 h-3.5 text-white/0 group-hover:text-white/90 transition-opacity" />
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

        {items.length > 4 && (
          <div className="flex justify-end mt-3">
            <span className="text-xs text-muted-foreground">
              +{items.length - 4} {lang === "fr" ? "autres" : "more"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OnThisDayWidget;
