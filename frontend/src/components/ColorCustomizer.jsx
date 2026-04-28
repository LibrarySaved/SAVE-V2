import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useThemeCustomization, colorPresets } from "@/contexts/ThemeCustomizationContext";

export const ColorCustomizer = ({ open, onClose }) => {
  const { colors, currentPreset, customColors, setPreset, setCustomColor, resetToPreset } = useThemeCustomization();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-['Outfit']">
            <Palette className="w-5 h-5" style={{ color: colors.primary }} />
            Personnaliser les couleurs
          </DialogTitle>
          <DialogDescription>
            Faites de saved. le reflet de votre personnalité
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Themes */}
          <div>
            <h3 className="text-sm font-medium mb-3">Thèmes prédéfinis</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(colorPresets).map(([key, preset]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreset(key)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    currentPreset === key && !customColors
                      ? "border-white ring-2 ring-offset-2 ring-offset-background"
                      : "border-transparent hover:border-white/30"
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${preset.sidebar} 0%, ${preset.primary} 100%)`,
                    ringColor: preset.primary
                  }}
                  title={preset.name}
                >
                  {currentPreset === key && !customColors && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Couleurs personnalisées</h3>
              {customColors && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToPreset}
                  className="text-xs h-7"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Couleur principale</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setCustomColor('primary', e.target.value)}
                    className="color-picker-input"
                  />
                  <span className="text-sm font-mono">{colors.primary}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Couleur secondaire</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setCustomColor('secondary', e.target.value)}
                    className="color-picker-input"
                  />
                  <span className="text-sm font-mono">{colors.secondary}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Sidebar</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.sidebar}
                    onChange={(e) => setCustomColor('sidebar', e.target.value)}
                    className="color-picker-input"
                  />
                  <span className="text-sm font-mono">{colors.sidebar}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Texte sidebar</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.sidebarText}
                    onChange={(e) => setCustomColor('sidebarText', e.target.value)}
                    className="color-picker-input"
                  />
                  <span className="text-sm font-mono">{colors.sidebarText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium mb-3">Aperçu</h3>
            <div 
              className="rounded-xl overflow-hidden border border-border"
              style={{ backgroundColor: colors.sidebar }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span 
                    className="font-bold logo-text"
                    style={{ color: colors.sidebarText }}
                  >
                    saved.
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div 
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                  >
                    Élément actif
                  </div>
                  <div 
                    className="px-3 py-2 rounded-lg text-sm opacity-60"
                    style={{ color: colors.sidebarText }}
                  >
                    Élément inactif
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} style={{ backgroundColor: colors.primary }}>
            Appliquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorCustomizer;
