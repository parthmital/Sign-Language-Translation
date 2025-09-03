import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Settings, BookOpen, Info, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAppStore } from '@/store/useAppStore';
import { AVAILABLE_LANGUAGES } from '@/services/mockServices';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { languagePrefs, updateLanguagePrefs, accessibilityPrefs } = useAppStore();
  
  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === languagePrefs.primaryLanguage) || AVAILABLE_LANGUAGES[0];
  
  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        accessibilityPrefs.highContrast && "high-contrast"
      )}
      role="banner"
    >
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary-hover transition-colors"
            aria-label="Multilingual Sign Language Translator - Home"
          >
            <GraduationCap className="h-6 w-6" aria-label="Academic research" />
            <span className="hidden sm:inline">Multilingual Sign Language Translator</span>
            <span className="sm:hidden">SL Translator</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-touch min-w-touch",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Controls and Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="min-h-touch min-w-touch"
                aria-label={`Current language: ${currentLanguage.name}. Click to change language`}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-medium">
              {AVAILABLE_LANGUAGES.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  className={cn(
                    "flex items-center space-x-2 cursor-pointer min-h-touch",
                    languagePrefs.primaryLanguage === language.code && "bg-accent"
                  )}
                  onClick={() => updateLanguagePrefs({ primaryLanguage: language.code })}
                >
                  <span className="text-lg" role="img" aria-label={`${language.name} flag`}>
                    {language.flag}
                  </span>
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="min-h-touch min-w-touch"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden border-t bg-background animate-fade-in-up"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors min-h-touch",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}