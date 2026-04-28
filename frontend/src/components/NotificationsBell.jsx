import { useState } from "react";
import { Bell, Sparkles, AlertTriangle, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/App";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";

const formatTime = (iso) => {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export const NotificationsBell = () => {
  const { history, unreadCount, processingItems, markAllRead, clearHistory } = useNotifications();
  const { colors } = useThemeCustomization();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next) => {
    setOpen(next);
    if (next && unreadCount > 0) {
      // mark as read on open
      setTimeout(() => markAllRead(), 800);
    }
  };

  const isProcessing = processingItems.size > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          data-testid="notifications-bell-btn"
          aria-label="Notifications"
        >
          <motion.div
            animate={isProcessing ? { rotate: [0, -12, 12, -8, 8, 0] } : { rotate: 0 }}
            transition={isProcessing ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 }}
          >
            <Bell className="w-5 h-5" />
          </motion.div>
          {(unreadCount > 0 || isProcessing) && (
            <span
              className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: colors.primary }}
              data-testid="notifications-badge"
            >
              {isProcessing && unreadCount === 0 ? "•" : unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] p-0"
        data-testid="notifications-panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h3 className="font-semibold text-sm">Notifications</h3>
            {isProcessing && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.primary }}
                />
                {processingItems.size} analyse{processingItems.size > 1 ? "s" : ""} IA en cours…
              </p>
            )}
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={clearHistory}
              data-testid="notifications-clear-btn"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Effacer
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {history.length === 0 && !isProcessing && (
            <div className="p-8 text-center">
              <div
                className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Bell className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <p className="text-sm text-muted-foreground">Aucune notification</p>
              <p className="text-xs text-muted-foreground mt-1">
                Vous serez notifié quand l'IA termine une analyse.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {history.map((n) => {
              const Icon = n.type === "success" ? Sparkles : n.type === "error" ? AlertTriangle : Bell;
              const iconColor =
                n.type === "success" ? colors.primary :
                n.type === "error" ? "#ef4444" : colors.secondary;

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className={`flex gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-accent/40 transition-colors ${n.read ? "" : "bg-accent/20"}`}
                  data-testid="notification-item"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${iconColor}1a` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{n.title}</p>
                      {!n.read && (
                        <span
                          className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </div>
                    {n.message && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {history.length > 0 && unreadCount > 0 && (
          <div className="px-4 py-2 border-t border-border bg-accent/20">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-8"
              onClick={markAllRead}
              data-testid="notifications-mark-read-btn"
            >
              <Check className="w-3 h-3 mr-1" />
              Tout marquer comme lu
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
