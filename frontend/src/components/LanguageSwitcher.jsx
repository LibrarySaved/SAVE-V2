import { Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/contexts/I18nContext";
import { useThemeCustomization } from "@/contexts/ThemeCustomizationContext";

export const LanguageSwitcher = ({ variant = "ghost", size = "icon", showLabel = false }) => {
  const { lang, setLang, supported, comingSoon, t } = useI18n();
  const { colors } = useThemeCustomization();
  const current = supported.find((l) => l.code === lang) || supported[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={showLabel ? "sm" : size}
          className="rounded-full gap-2"
          data-testid="language-switcher-btn"
          aria-label={t("lang.label")}
        >
          <Globe className="w-4 h-4" />
          {showLabel ? (
            <span className="text-sm font-medium">{current.flag} {current.code.toUpperCase()}</span>
          ) : (
            <span className="text-xs font-bold">{current.code.toUpperCase()}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" data-testid="language-menu">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          {t("lang.label")}
        </DropdownMenuLabel>
        {supported.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className="cursor-pointer"
            data-testid={`lang-option-${l.code}`}
          >
            <span className="mr-2">{l.flag}</span>
            <span className="flex-1">{l.name}</span>
            {lang === l.code && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t("lang.coming_soon")}
        </DropdownMenuLabel>
        {comingSoon.map((l) => (
          <DropdownMenuItem
            key={l.code}
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <span className="mr-2">{l.flag}</span>
            <span className="flex-1">{l.name}</span>
            <span className="text-[10px] text-muted-foreground">soon</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
