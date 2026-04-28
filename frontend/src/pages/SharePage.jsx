import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, API } from "@/App";
import { toast } from "sonner";
import { Bookmark, Sparkles, ArrowLeft, Check, Loader2 } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaPinterest, FaLinkedin, FaFacebook } from "react-icons/fa6";

// Detect platform from URL
function detectPlatform(url) {
  if (!url) return "other";
  const urlLower = url.toLowerCase();
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("pinterest.com") || urlLower.includes("pin.it")) return "pinterest";
  if (urlLower.includes("linkedin.com")) return "linkedin";
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) return "facebook";
  return "other";
}

// Detect content type from URL
function detectContentType(url) {
  if (!url) return "post";
  const urlLower = url.toLowerCase();
  if (urlLower.includes("/reel") || urlLower.includes("/shorts")) return "reel";
  if (urlLower.includes("/video") || urlLower.includes("/watch")) return "video";
  if (urlLower.includes("/stories")) return "story";
  if (urlLower.includes("/pin/")) return "pin";
  if (urlLower.includes("/status/")) return "tweet";
  return "post";
}

// Extract URL from shared text (mobile share often includes extra text)
function extractUrl(text) {
  if (!text) return "";
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
  return urlMatch ? urlMatch[1] : text;
}

const platformIcons = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  pinterest: FaPinterest,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
};

export default function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // Get shared data from URL params (Web Share Target API)
  const sharedUrl = extractUrl(searchParams.get("url") || searchParams.get("text") || "");
  const sharedTitle = searchParams.get("title") || "";
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    platform: detectPlatform(sharedUrl),
    content_type: detectContentType(sharedUrl),
    title: sharedTitle || "Contenu partagé",
    description: "",
    url: sharedUrl,
    thumbnail_url: "",
    author_name: "",
    tags: "",
  });

  // Auto-detect platform when URL changes
  useEffect(() => {
    if (sharedUrl) {
      setFormData(prev => ({
        ...prev,
        url: sharedUrl,
        platform: detectPlatform(sharedUrl),
        content_type: detectContentType(sharedUrl),
      }));
    }
  }, [sharedUrl]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Store shared data in sessionStorage for after login
      sessionStorage.setItem("pendingShare", JSON.stringify({
        url: sharedUrl,
        title: sharedTitle,
      }));
      navigate("/login");
    }
  }, [user, authLoading, navigate, sharedUrl, sharedTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        collection_ids: [],
      };

      await axios.post(`${API}/content`, payload, { withCredentials: true });
      setSaved(true);
      toast.success("Contenu sauvegardé ! L'IA l'analyse...");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Échec de la sauvegarde");
      setLoading(false);
    }
  };

  const PlatformIcon = platformIcons[formData.platform];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 font-['Outfit']">Sauvegardé !</h1>
          <p className="text-muted-foreground mb-4">L'IA analyse votre contenu...</p>
          <p className="text-sm text-muted-foreground">Redirection vers le dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg font-['Outfit']">Sauvegarde rapide</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Platform indicator */}
          {formData.url && (
            <div className="mb-6 p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3">
                {PlatformIcon && (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.platform === "instagram" ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" :
                    formData.platform === "youtube" ? "bg-red-600" :
                    formData.platform === "tiktok" ? "bg-black" :
                    formData.platform === "twitter" ? "bg-black" :
                    formData.platform === "pinterest" ? "bg-red-700" :
                    formData.platform === "linkedin" ? "bg-blue-700" :
                    formData.platform === "facebook" ? "bg-blue-600" :
                    "bg-blue-500"
                  }`}>
                    <PlatformIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{formData.platform}</p>
                  <p className="text-xs text-muted-foreground truncate">{formData.url}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">URL *</label>
              <Input
                value={formData.url}
                onChange={e => {
                  const url = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    url,
                    platform: detectPlatform(url),
                    content_type: detectContentType(url),
                  }));
                }}
                placeholder="https://..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Plateforme</label>
                <Select value={formData.platform} onValueChange={v => setFormData(p => ({ ...p, platform: v }))}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">Titre *</label>
              <Input
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Donnez-lui un nom"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optionnel)</label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Pourquoi vous sauvegardez ce contenu..."
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 text-base font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sauvegarder avec l'IA
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              L'IA va automatiquement analyser, résumer et catégoriser ce contenu
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
