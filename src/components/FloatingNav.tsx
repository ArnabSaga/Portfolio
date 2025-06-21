import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, User, Briefcase, FolderOpen, Mail, Bot } from 'lucide-react';

interface FloatingNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activeSection, setActiveSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = useMemo(() => [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'portfolio', icon: FolderOpen, label: 'Portfolio' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'ai-assistant', icon: Bot, label: 'AI Assistant' }
  ], []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
    
    setScrollProgress(progress);
    
    // Show when scrolling starts (after 50px)
    if (scrollTop > 50) {
      setIsVisible(true);
      setIsScrolling(true);
    } else {
      setIsVisible(false);
      setIsScrolling(false);
    }
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let rafId: number;
    
    const throttledHandleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        handleScroll();
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Hide quickly when scrolling stops (500ms delay)
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
          // Keep visible if user is not at top
          if (window.scrollY <= 50) {
            setIsVisible(false);
          }
        }, 500);
      });
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(scrollTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);

  const handleNavClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, [setActiveSection]);

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
    }`}>
      {/* Progress Bar */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-terminal-border/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-terminal-green via-terminal-blue to-terminal-purple transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Navigation Dock */}
      <div className="flex items-center space-x-1 bg-terminal-bg/95 border border-terminal-green/20 rounded-2xl px-3 py-2 backdrop-blur-md shadow-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`group relative w-10 h-10 rounded-xl border transition-all duration-200 ease-out hover:scale-110 ${
              activeSection === item.id
                ? 'bg-terminal-green/20 border-terminal-green text-terminal-green'
                : 'bg-terminal-bg/50 border-terminal-border/20 text-terminal-text/70 hover:border-terminal-green/40 hover:text-terminal-green hover:bg-terminal-green/10'
            }`}
          >
            <item.icon className="w-4 h-4 mx-auto" />
            
            {/* Tooltip */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-terminal-bg/95 border border-terminal-green/30 rounded-lg px-2 py-1 text-xs font-mono whitespace-nowrap backdrop-blur-md">
                <span className="text-terminal-green">{item.label}</span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-terminal-green/30"></div>
              </div>
            </div>

            {/* Active Indicator */}
            {activeSection === item.id && (
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-terminal-green rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingNav;
