import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { accessibilityPrefs } = useAppStore();

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col",
        accessibilityPrefs.highContrast && "high-contrast",
        accessibilityPrefs.largeText && "large-text"
      )}
    >
      <Header />
      <main 
        id="main-content"
        className="flex-1"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}