import { Bookmark } from "lucide-react";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";
import { APP_NAME, APP_TAGLINE } from "@/App";

// Logo component for "saved."
export const Logo = ({ size = "default", showTagline = false, onClick }) => {
  const { colors } = useThemeCustomization();
  
  const sizes = {
    small: { icon: "w-7 h-7", iconInner: "w-3.5 h-3.5", text: "text-lg" },
    default: { icon: "w-9 h-9", iconInner: "w-4 h-4", text: "text-xl" },
    large: { icon: "w-12 h-12", iconInner: "w-6 h-6", text: "text-3xl" },
    hero: { icon: "w-16 h-16", iconInner: "w-8 h-8", text: "text-5xl" }
  };
  
  const s = sizes[size] || sizes.default;

  return (
    <div 
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div 
        className={`${s.icon} rounded-2xl flex items-center justify-center shadow-lg`}
        style={{ backgroundColor: colors.primary }}
      >
        <Bookmark className={`${s.iconInner} text-white`} />
      </div>
      <div className="flex flex-col">
        <span 
          className={`font-bold ${s.text} tracking-tight logo-text`}
          style={{ color: colors.primary }}
        >
          {APP_NAME}
        </span>
        {showTagline && (
          <span className="text-xs text-muted-foreground tracking-wide">
            {APP_TAGLINE}
          </span>
        )}
      </div>
    </div>
  );
};

// Simple logo icon only
export const LogoIcon = ({ size = 36, className = "" }) => {
  const { colors } = useThemeCustomization();
  
  return (
    <div 
      className={`rounded-2xl flex items-center justify-center shadow-lg ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: colors.primary 
      }}
    >
      <Bookmark 
        className="text-white" 
        style={{ width: size * 0.45, height: size * 0.45 }} 
      />
    </div>
  );
};

export default Logo;
