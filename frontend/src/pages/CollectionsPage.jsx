import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth, useTheme, API } from "@/App";
import { toast } from "sonner";
import {
  Bookmark, Plus, ArrowLeft, MoreHorizontal, Trash2, Edit,
  Moon, Sun, LogOut, Settings, ChevronDown, FolderOpen, Palette
} from "lucide-react";

const colorOptions = [
  "#E1306C", // Instagram pink
  "#FF0000", // YouTube red
  "#2563EB", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#14B8A6"  // Teal
];

const CollectionCard = ({ collection, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1 p-6"
      data-testid={`collection-card-${collection.collection_id}`}
    >
      {/* Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: collection.color }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${collection.color}20` }}
      >
        <FolderOpen className="w-6 h-6" style={{ color: collection.color }} />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg mb-1 font-['Outfit']">{collection.name}</h3>
      {collection.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>
      )}
      <p className="text-sm text-muted-foreground">
        {collection.content_count} {collection.content_count === 1 ? "item" : "items"}
      </p>

      {/* Actions */}
      {!collection.is_default && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`collection-menu-${collection.collection_id}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(collection)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(collection.collection_id)} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Default Badge */}
      {collection.is_default && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-muted text-xs font-medium">
          Default
        </div>
      )}
    </motion.div>
  );
};

const CollectionModal = ({ open, onClose, collection, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#2563EB"
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || "",
        color: collection.color
      });
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#2563EB"
      });
    }
  }, [collection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (collection) {
        await axios.put(`${API}/collections/${collection.collection_id}`, formData, { withCredentials: true });
        toast.success("Collection updated!");
      } else {
        await axios.post(`${API}/collections`, formData, { withCredentials: true });
        toast.success("Collection created!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Outfit']">
            {collection ? "Edit Collection" : "New Collection"}
          </DialogTitle>
          <DialogDescription>
            Organize your saves into collections
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name *</label>
            <Input
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="My Collection"
              required
              data-testid="collection-name-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Input
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
              data-testid="collection-description-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, color }))}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  data-testid={`color-${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} data-testid="save-collection-btn">
              {loading ? "Saving..." : collection ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/collections`, { withCredentials: true });
      setCollections(res.data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDelete = async (collectionId) => {
    if (!window.confirm("Are you sure you want to delete this collection? Content won't be deleted.")) return;

    try {
      await axios.delete(`${API}/collections/${collectionId}`, { withCredentials: true });
      setCollections(prev => prev.filter(c => c.collection_id !== collectionId));
      toast.success("Collection deleted");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete collection");
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setShowModal(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-accent"
                data-testid="back-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold font-['Outfit']">Collections</h1>
                <p className="text-sm text-muted-foreground">{collections.length} collections</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-accent"
                data-testid="theme-toggle"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Button
                onClick={() => {
                  setEditingCollection(null);
                  setShowModal(true);
                }}
                className="rounded-full gap-2"
                data-testid="new-collection-btn"
              >
                <Plus className="w-4 h-4" />
                New Collection
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" data-testid="user-menu">
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.[0] || "U"}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 font-['Outfit']">No collections yet</h3>
            <p className="text-muted-foreground mb-6">Create collections to organize your saved content</p>
            <Button
              onClick={() => {
                setEditingCollection(null);
                setShowModal(true);
              }}
              className="rounded-full gap-2"
              data-testid="empty-new-collection-btn"
            >
              <Plus className="w-4 h-4" />
              Create Your First Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {collections.map(collection => (
                <CollectionCard
                  key={collection.collection_id}
                  collection={collection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal */}
      <CollectionModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCollection(null);
        }}
        collection={editingCollection}
        onSuccess={fetchCollections}
      />
    </div>
  );
}
