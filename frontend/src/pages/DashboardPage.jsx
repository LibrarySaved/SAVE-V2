import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useTheme, API, useNotifications } from "@/App";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";
import { toast } from "sonner";
import { AdBanner, AdNative, AdStickyFooter } from "@/components/AdComponents";
import { Logo } from "@/components/Logo";
import { ColorCustomizer } from "@/components/ColorCustomizer";
import { NotificationsBell } from "@/components/NotificationsBell";
import {
  Bookmark, Search, Plus, Grid3X3, List, Heart, ExternalLink,
  MoreHorizontal, Trash2, Edit, FolderPlus, Moon, Sun, LogOut,
  Settings, ChevronDown, Filter, Link,
  LayoutDashboard, FolderOpen, Sparkles, Brain, RefreshCw, Tag, Palette, Bell
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaPinterest, FaLinkedin, FaFacebook } from "react-icons/fa6";

const platformIcons = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  pinterest: FaPinterest,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  other: Link
};

const platformColors = {
  instagram: "platform-instagram",
  tiktok: "platform-tiktok",
  youtube: "platform-youtube",
  twitter: "platform-twitter",
  pinterest: "platform-pinterest",
  linkedin: "platform-linkedin",
  facebook: "platform-facebook",
  other: "platform-other"
};

// Category colors for visual distinction
const categoryColors = {
  tech: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  fitness: "bg-green-500/10 text-green-600 dark:text-green-400",
  finance: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cooking: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  fashion: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  travel: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  music: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  art: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  news: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  education: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  entertainment: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  lifestyle: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  business: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  health: "bg-red-500/10 text-red-600 dark:text-red-400",
  sports: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
  gaming: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  science: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  default: "bg-gray-500/10 text-gray-600 dark:text-gray-400"
};

const Sidebar = ({ activePage, onNavigate, user, onLogout, collections, categories, onOpenColorCustomizer }) => {
  const { theme, toggleTheme } = useTheme();
  const { colors } = useThemeCustomization();
  const { processingItems } = useNotifications();
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Tous mes saves" },
    { id: "collections", icon: FolderOpen, label: "Collections" },
    { id: "favorites", icon: Heart, label: "Favoris" },
  ];

  return (
    <aside 
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40 custom-sidebar"
      style={{ backgroundColor: colors.sidebar }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Logo size="default" showTagline onClick={() => navigate("/")} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all`}
            style={{
              backgroundColor: activePage === item.id ? colors.primary : 'transparent',
              color: activePage === item.id ? 'white' : colors.sidebarText,
              opacity: activePage === item.id ? 1 : 0.7
            }}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.id === "dashboard" && processingItems.size > 0 && (
              <span className="ml-auto relative">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.accent }}
                />
              </span>
            )}
          </button>
        ))}

        {/* Color Customization Button */}
        <button
          onClick={onOpenColorCustomizer}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-100"
          style={{ color: colors.sidebarText, opacity: 0.7 }}
          data-testid="color-customizer-btn"
        >
          <Palette className="w-5 h-5" />
          Personnaliser
        </button>

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <p 
              className="px-4 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: colors.sidebarText, opacity: 0.5 }}
            >
              <Brain className="w-3 h-3" />
              Catégories IA
            </p>
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat.category}
                onClick={() => onNavigate("category", cat.category)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:opacity-100 transition-all"
                style={{ color: colors.sidebarText, opacity: 0.7 }}
                data-testid={`category-${cat.category}`}
              >
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[cat.category] || categoryColors.default}`}>
                  {cat.category}
                </div>
                <span className="ml-auto text-xs" style={{ opacity: 0.5 }}>{cat.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Ad Banner */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <AdBanner position="sidebar" />
        </div>

        {/* Collections List */}
        {collections.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <p 
              className="px-4 text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: colors.sidebarText, opacity: 0.5 }}
            >
              Collections
            </p>
            {collections.slice(0, 5).map(col => (
              <button
                key={col.collection_id}
                onClick={() => onNavigate("collection", col.collection_id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:opacity-100 transition-all"
                style={{ color: colors.sidebarText, opacity: 0.7 }}
                data-testid={`collection-${col.collection_id}`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="truncate">{col.name}</span>
                <span className="ml-auto text-xs" style={{ opacity: 0.5 }}>{col.content_count}</span>
              </button>
            ))}
            {collections.length > 5 && (
              <button
                onClick={() => navigate("/collections")}
                className="w-full px-4 py-2 text-xs hover:opacity-100"
                style={{ color: colors.sidebarText, opacity: 0.5 }}
              >
                Voir tout ({collections.length})
              </button>
            )}
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors" 
              data-testid="user-menu-trigger"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-9 h-9 rounded-full" />
              ) : (
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate" style={{ color: colors.sidebarText }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: colors.sidebarText, opacity: 0.5 }}>{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4" style={{ color: colors.sidebarText, opacity: 0.5 }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="settings-menu-item">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} data-testid="theme-menu-item">
              {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {theme === "dark" ? "Mode clair" : "Mode sombre"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenColorCustomizer}>
              <Palette className="w-4 h-4 mr-2" />
              Personnaliser
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive" data-testid="logout-menu-item">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

// Enhanced Content Card with AI features
const ContentCard = ({ content, onEdit, onDelete, onToggleFavorite, onReprocess }) => {
  const PlatformIcon = platformIcons[content.platform] || Link;
  const { colors } = useThemeCustomization();
  const isProcessing = content.ai_status === "processing" || content.ai_status === "pending";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
      data-testid={`content-card-${content.content_id}`}
    >
      {/* Thumbnail */}
      {content.thumbnail_url ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <PlatformIcon className="w-12 h-12 text-muted-foreground/50" />
        </div>
      )}

      {/* Platform Badge */}
      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${platformColors[content.platform]}`}>
        <PlatformIcon className="w-3.5 h-3.5" />
        <span className="capitalize">{content.platform}</span>
      </div>

      {/* AI Processing Indicator */}
      {isProcessing && (
        <div 
          className="absolute top-3 right-12 px-2 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1"
          style={{ backgroundColor: colors.primary }}
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>IA</span>
        </div>
      )}

      {/* Category Badge */}
      {content.category && (
        <div className={`absolute top-12 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[content.category] || categoryColors.default}`}>
          {content.category}
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite(content.content_id)}
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
          content.is_favorite
            ? "bg-red-500 text-white"
            : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
        }`}
        data-testid={`favorite-btn-${content.content_id}`}
      >
        <Heart className={`w-4 h-4 ${content.is_favorite ? "fill-current" : ""}`} />
      </button>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-['Outfit']">{content.title}</h3>
        
        {/* AI Summary */}
        {content.summary && (
          <div 
            className="mb-3 p-2 rounded-lg border"
            style={{ 
              backgroundColor: `${colors.primary}08`,
              borderColor: `${colors.primary}20`
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3" style={{ color: colors.primary }} />
              <span className="text-xs font-medium" style={{ color: colors.primary }}>Résumé IA</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3">{content.summary}</p>
          </div>
        )}
        
        {content.author_name && !content.summary && (
          <p className="text-xs text-muted-foreground mb-3">par {content.author_name}</p>
        )}

        {/* AI Tags */}
        {content.ai_tags && content.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.ai_tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs border"
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary,
                  borderColor: `${colors.primary}20`
                }}
              >
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
            {content.ai_tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{content.ai_tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* User Tags (fallback) */}
        {(!content.ai_tags || content.ai_tags.length === 0) && content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{content.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            data-testid={`open-link-${content.content_id}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ouvrir
          </a>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-accent rounded-lg" data-testid={`content-menu-${content.content_id}`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onReprocess(content.content_id)}>
                <Brain className="w-4 h-4 mr-2" />
                Ré-analyser (IA)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(content)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(content.content_id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

const AddContentModal = ({ open, onClose, collections, onSuccess, prefillData }) => {
  const [loading, setLoading] = useState(false);
  const { colors } = useThemeCustomization();
  const [formData, setFormData] = useState({
    platform: "instagram",
    content_type: "post",
    title: "",
    description: "",
    url: "",
    thumbnail_url: "",
    author_name: "",
    tags: "",
    collection_ids: []
  });

  // Update form when prefillData changes
  useEffect(() => {
    if (prefillData && open) {
      setFormData(prev => ({
        ...prev,
        url: prefillData.url || prev.url,
        title: prefillData.title || prev.title,
        platform: prefillData.platform || prev.platform,
        content_type: prefillData.type || prev.content_type,
        thumbnail_url: prefillData.thumbnail || prev.thumbnail_url,
      }));
    }
  }, [prefillData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      };
      
      await axios.post(`${API}/content`, payload, { withCredentials: true });
      toast.success("Contenu sauvegardé ! L'IA analyse en arrière-plan...");
      onSuccess();
      onClose();
      setFormData({
        platform: "instagram",
        content_type: "post",
        title: "",
        description: "",
        url: "",
        thumbnail_url: "",
        author_name: "",
        tags: "",
        collection_ids: []
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Échec de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: colors.primary }} />
            Sauvegarder un contenu
          </DialogTitle>
          <DialogDescription>L'IA analysera automatiquement le contenu pour l'enrichir</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Plateforme</label>
              <Select value={formData.platform} onValueChange={v => setFormData(p => ({ ...p, platform: v }))}>
                <SelectTrigger data-testid="platform-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={formData.content_type} onValueChange={v => setFormData(p => ({ ...p, content_type: v }))}>
                <SelectTrigger data-testid="type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="reel">Reel/Short</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="tweet">Tweet</SelectItem>
                  <SelectItem value="pin">Pin</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL *</label>
            <Input
              value={formData.url}
              onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
              required
              data-testid="content-url-input"
            />
            <p className="text-xs text-muted-foreground mt-1">L'IA extraira automatiquement le contenu de cette URL</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Titre *</label>
            <Input
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Donnez-lui un nom"
              required
              data-testid="content-title-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL miniature</label>
            <Input
              value={formData.thumbnail_url}
              onChange={e => setFormData(p => ({ ...p, thumbnail_url: e.target.value }))}
              placeholder="https://... (optionnel)"
              data-testid="content-thumbnail-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Auteur</label>
            <Input
              value={formData.author_name}
              onChange={e => setFormData(p => ({ ...p, author_name: e.target.value }))}
              placeholder="Nom du créateur (optionnel)"
              data-testid="content-author-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              value={formData.tags}
              onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3 (l'IA ajoutera ses propres tags)"
              data-testid="content-tags-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Notes sur ce contenu..."
              rows={3}
              data-testid="content-description-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              data-testid="save-content-btn"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { colors } = useThemeCustomization();
  const { trackProcessing, completeProcessing } = useNotifications();
  const [activePage, setActivePage] = useState("dashboard");
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [content, setContent] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStickyAd, setShowStickyAd] = useState(true);
  const [showColorCustomizer, setShowColorCustomizer] = useState(false);
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  // Check URL params for quick save
  useEffect(() => {
    const shouldSave = searchParams.get("save");
    const url = searchParams.get("url");
    const title = searchParams.get("title");
    const platform = searchParams.get("platform");
    const type = searchParams.get("type");
    const thumbnail = searchParams.get("thumbnail");

    if (shouldSave === "true" && url) {
      setPrefillData({ url, title, platform, type, thumbnail });
      setShowAddModal(true);
      setSearchParams({});
    }
    
    const filter = searchParams.get("filter");
    if (filter === "favorites") {
      setActivePage("favorites");
    }
  }, [searchParams, setSearchParams]);

  const fetchData = useCallback(async () => {
    try {
      const [contentRes, collectionsRes, statsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/content`, { withCredentials: true }),
        axios.get(`${API}/collections`, { withCredentials: true }),
        axios.get(`${API}/user/stats`, { withCredentials: true }),
        axios.get(`${API}/categories`, { withCredentials: true })
      ]);
      setContent(contentRes.data);
      setCollections(collectionsRes.data);
      setStats(statsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll for AI processing updates
  useEffect(() => {
    const processingContent = content.filter(c => c.ai_status === "processing" || c.ai_status === "pending");

    // Sync processing badge with current items
    processingContent.forEach(item => trackProcessing(item.content_id));

    if (processingContent.length > 0) {
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API}/content`, { withCredentials: true });
          const updatedContent = res.data;
          
          // Check for completed items
          processingContent.forEach(item => {
            const updated = updatedContent.find(c => c.content_id === item.content_id);
            if (updated && updated.ai_status === "completed") {
              completeProcessing(item.content_id, true, updated.title || item.title);
            } else if (updated && updated.ai_status === "failed") {
              completeProcessing(item.content_id, false, updated.title || item.title);
            }
          });
          
          setContent(updatedContent);
        } catch (error) {
          console.error("Failed to poll content:", error);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [content, completeProcessing, trackProcessing]);

  // Semantic search with debounce
  useEffect(() => {
    const performSemanticSearch = async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setIsSemanticSearch(false);
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.post(
          `${API}/search`,
          { query: searchQuery, limit: 20 },
          { withCredentials: true }
        );
        setSearchResults(response.data);
        setIsSemanticSearch(true);
      } catch (error) {
        console.error("Semantic search failed:", error);
        setIsSemanticSearch(false);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSemanticSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleNavigate = (page, id = null) => {
    setActivePage(page);
    setActiveCollectionId(page === "collection" ? id : null);
    setActiveCategory(page === "category" ? id : null);
    setSearchQuery("");
    setIsSemanticSearch(false);
    setSearchResults([]);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleToggleFavorite = async (contentId) => {
    try {
      const res = await axios.post(`${API}/content/${contentId}/favorite`, {}, { withCredentials: true });
      setContent(prev => prev.map(c => 
        c.content_id === contentId ? { ...c, is_favorite: res.data.is_favorite } : c
      ));
      toast.success(res.data.is_favorite ? "Ajouté aux favoris" : "Retiré des favoris");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contenu ?")) return;
    
    try {
      await axios.delete(`${API}/content/${contentId}`, { withCredentials: true });
      setContent(prev => prev.filter(c => c.content_id !== contentId));
      toast.success("Contenu supprimé");
      fetchData();
    } catch (error) {
      toast.error("Échec de la suppression");
    }
  };

  const handleReprocess = async (contentId) => {
    try {
      await axios.post(`${API}/content/${contentId}/reprocess`, {}, { withCredentials: true });
      toast.success("Analyse IA relancée");
      trackProcessing(contentId);
      setContent(prev => prev.map(c => 
        c.content_id === contentId ? { ...c, ai_status: "processing" } : c
      ));
    } catch (error) {
      toast.error("Échec du retraitement");
    }
  };

  // Determine which content to display
  let displayContent = isSemanticSearch ? searchResults.map(r => ({
    ...r,
    content_id: r.content_id,
    tags: r.tags || [],
    ai_tags: r.ai_tags || []
  })) : content;

  // Apply filters
  if (!isSemanticSearch) {
    if (activePage === "favorites") {
      displayContent = content.filter(c => c.is_favorite);
    } else if (activePage === "collection" && activeCollectionId) {
      displayContent = content.filter(c => c.collection_ids?.includes(activeCollectionId));
    } else if (activePage === "category" && activeCategory) {
      displayContent = content.filter(c => c.category === activeCategory);
    }
    
    if (platformFilter !== "all") {
      displayContent = displayContent.filter(c => c.platform === platformFilter);
    }
  }

  // Insert ads
  const contentWithAds = [];
  displayContent.forEach((item, index) => {
    contentWithAds.push({ type: "content", data: item });
    if ((index + 1) % 6 === 0 && index < displayContent.length - 1) {
      contentWithAds.push({ type: "ad", id: `ad-${index}` });
    }
  });

  const pageTitle = isSemanticSearch 
    ? `Résultats pour "${searchQuery}"`
    : activePage === "favorites" 
      ? "Favoris" 
      : activePage === "collection" 
        ? collections.find(c => c.collection_id === activeCollectionId)?.name || "Collection"
        : activePage === "category"
          ? `Catégorie: ${activeCategory}`
          : "Tous mes saves";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        collections={collections}
        categories={categories}
        onOpenColorCustomizer={() => setShowColorCustomizer(true)}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-['Outfit']">{pageTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {isSemanticSearch ? (
                    <span className="flex items-center gap-1">
                      <Brain className="w-3 h-3" style={{ color: colors.primary }} />
                      {displayContent.length} résultats trouvés par l'IA
                    </span>
                  ) : (
                    <>
                      {displayContent.length} éléments
                      {stats && activePage === "dashboard" && (
                        <span> • {stats.total_collections} collections</span>
                      )}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* AI Search */}
                <div className="relative">
                  <Brain 
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4`}
                    style={{ color: searchQuery ? colors.primary : undefined }}
                  />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Recherche intelligente... (ex: recette de pâtes)"
                    className="pl-10 w-80 rounded-full"
                    data-testid="search-input"
                  />
                  {isSearching && (
                    <RefreshCw 
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin"
                      style={{ color: colors.primary }}
                    />
                  )}
                </div>

                {/* Platform Filter */}
                {!isSemanticSearch && (
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="w-40 rounded-full" data-testid="platform-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-full p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-colors`}
                    style={{ 
                      backgroundColor: viewMode === "grid" ? colors.primary : 'transparent',
                      color: viewMode === "grid" ? 'white' : undefined
                    }}
                    data-testid="grid-view-btn"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-colors`}
                    style={{ 
                      backgroundColor: viewMode === "list" ? colors.primary : 'transparent',
                      color: viewMode === "list" ? 'white' : undefined
                    }}
                    data-testid="list-view-btn"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications Bell */}
                <NotificationsBell />

                {/* Add Button */}
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="rounded-full gap-2"
                  style={{ backgroundColor: colors.primary }}
                  data-testid="add-content-btn"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          {/* Banner Ad */}
          <div className="px-8 pb-4">
            <AdBanner position="horizontal" />
          </div>
        </header>

        {/* Content Grid */}
        <div className="p-8">
          {displayContent.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                {isSemanticSearch ? (
                  <Brain className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Bookmark className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 font-['Outfit']">
                {isSemanticSearch ? "Aucun résultat" : "Aucun contenu"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isSemanticSearch 
                  ? "Essayez une autre recherche ou des termes différents"
                  : "Commencez à sauvegarder du contenu de vos plateformes préférées"
                }
              </p>
              {!isSemanticSearch && (
                <Button 
                  onClick={() => setShowAddModal(true)} 
                  className="rounded-full gap-2" 
                  data-testid="empty-add-btn"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter votre premier save
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "masonry-grid" : "space-y-4"}>
              <AnimatePresence mode="popLayout">
                {contentWithAds.map((item, index) => 
                  item.type === "ad" ? (
                    <AdNative key={item.id} />
                  ) : (
                    <ContentCard
                      key={item.data.content_id}
                      content={item.data}
                      onEdit={() => {}}
                      onDelete={handleDelete}
                      onToggleFavorite={handleToggleFavorite}
                      onReprocess={handleReprocess}
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Add Content Modal */}
      <AddContentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setPrefillData(null);
        }}
        collections={collections}
        onSuccess={fetchData}
        prefillData={prefillData}
      />

      {/* Color Customizer Modal */}
      <ColorCustomizer
        open={showColorCustomizer}
        onClose={() => setShowColorCustomizer(false)}
      />

      {/* Sticky Footer Ad */}
      <AnimatePresence>
        {showStickyAd && (
          <AdStickyFooter onClose={() => setShowStickyAd(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
