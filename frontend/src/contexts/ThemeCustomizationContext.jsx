import { createContext, useContext, useState, useEffect } from 'react';

// Preset color themes for personalization
export const colorPresets = {
  midnight: {
    name: "Midnight",
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    accent: "#C4B5FD",
    sidebar: "#18181B",
    sidebarText: "#FAFAFA"
  },
  sunset: {
    name: "Sunset",
    primary: "#F97316",
    secondary: "#FB923C",
    accent: "#FDBA74",
    sidebar: "#1C1917",
    sidebarText: "#FEF3C7"
  },
  ocean: {
    name: "Ocean",
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    accent: "#7DD3FC",
    sidebar: "#0C1929",
    sidebarText: "#E0F2FE"
  },
  forest: {
    name: "Forest",
    primary: "#10B981",
    secondary: "#34D399",
    accent: "#6EE7B7",
    sidebar: "#0D1F17",
    sidebarText: "#D1FAE5"
  },
  rose: {
    name: "Rose",
    primary: "#EC4899",
    secondary: "#F472B6",
    accent: "#F9A8D4",
    sidebar: "#1F0A14",
    sidebarText: "#FCE7F3"
  },
  amber: {
    name: "Amber",
    primary: "#D97706",
    secondary: "#F59E0B",
    accent: "#FCD34D",
    sidebar: "#1C1308",
    sidebarText: "#FEF3C7"
  },
  lavender: {
    name: "Lavender",
    primary: "#A855F7",
    secondary: "#C084FC",
    accent: "#D8B4FE",
    sidebar: "#1A0F24",
    sidebarText: "#F3E8FF"
  },
  coral: {
    name: "Coral",
    primary: "#F43F5E",
    secondary: "#FB7185",
    accent: "#FDA4AF",
    sidebar: "#1F0C10",
    sidebarText: "#FFE4E6"
  },
  mint: {
    name: "Mint",
    primary: "#14B8A6",
    secondary: "#2DD4BF",
    accent: "#5EEAD4",
    sidebar: "#0A1A17",
    sidebarText: "#CCFBF1"
  },
  slate: {
    name: "Slate",
    primary: "#64748B",
    secondary: "#94A3B8",
    accent: "#CBD5E1",
    sidebar: "#0F172A",
    sidebarText: "#F1F5F9"
  }
};

const ThemeCustomizationContext = createContext();

export const useThemeCustomization = () => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within ThemeCustomizationProvider');
  }
  return context;
};

export const ThemeCustomizationProvider = ({ children }) => {
  const [currentPreset, setCurrentPreset] = useState(() => {
    const saved = localStorage.getItem('saved_color_preset');
    return saved || 'midnight';
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('saved_custom_colors');
    return saved ? JSON.parse(saved) : null;
  });

  // Get current colors (custom or preset)
  const colors = customColors || colorPresets[currentPreset] || colorPresets.midnight;

  // Apply colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary color
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-sidebar', colors.sidebar);
    root.style.setProperty('--color-sidebar-text', colors.sidebarText);
    
    // Convert hex to HSL for Tailwind compatibility
    const hexToHsl = (hex) => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
          default: h = 0;
        }
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Set HSL values for Tailwind
    root.style.setProperty('--saved-primary', hexToHsl(colors.primary));
    root.style.setProperty('--saved-secondary', hexToHsl(colors.secondary));
    root.style.setProperty('--saved-accent', hexToHsl(colors.accent));
    
    // Save to localStorage
    localStorage.setItem('saved_color_preset', currentPreset);
    if (customColors) {
      localStorage.setItem('saved_custom_colors', JSON.stringify(customColors));
    }
  }, [colors, currentPreset, customColors]);

  const setPreset = (presetName) => {
    setCurrentPreset(presetName);
    setCustomColors(null);
    localStorage.removeItem('saved_custom_colors');
  };

  const setCustomColor = (colorKey, value) => {
    const newColors = { ...colors, [colorKey]: value };
    setCustomColors(newColors);
  };

  const resetToPreset = () => {
    setCustomColors(null);
    localStorage.removeItem('saved_custom_colors');
  };

  return (
    <ThemeCustomizationContext.Provider value={{
      colors,
      currentPreset,
      customColors,
      setPreset,
      setCustomColor,
      resetToPreset,
      presets: colorPresets
    }}>
      {children}
    </ThemeCustomizationContext.Provider>
  );
};

export default ThemeCustomizationProvider;
