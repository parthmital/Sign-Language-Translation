import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'auto', label: 'Auto', icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme, currentTheme } = useTheme();

  const currentThemeConfig = themes.find(t => t.value === theme) || themes[2];
  const CurrentIcon = currentThemeConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-touch min-w-touch"
          aria-label={`Theme: ${currentThemeConfig.label}. Click to change theme`}
          role="switch"
          aria-checked={theme !== 'auto'}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Theme changed to {currentThemeConfig.label}
        </div>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              className={cn(
                "flex items-center space-x-2 cursor-pointer min-h-touch",
                theme === themeOption.value && "bg-accent text-accent-foreground"
              )}
              onClick={() => setTheme(themeOption.value)}
            >
              <Icon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className="ml-auto text-xs opacity-60">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}