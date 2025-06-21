
import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase, FolderOpen, Mail, Bot } from 'lucide-react';

interface FloatingNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activeSection, setActiveSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'portfolio', icon: FolderOpen, label: 'Portfolio' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'ai-assistant', icon: Bot, label: 'AI Assistant' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
      
      // Show navigation when scrolling
      if (scrollTop > 200) {
        setIsVisible(true);
        
        // Clear existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        
        // Set new timeout to hide after scrolling stops
        const newTimeout = setTimeout(() => {
          setIsVisible(false);
        }, 3000); // Hide after 3 seconds of no scrolling
        
        setScrollTimeout(newTimeout);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      {/* Progress Bar - Top of dock */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-terminal-border to-transparent rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-terminal-green via-terminal-blue to-terminal-purple transition-all duration-300 relative"
          style={{ width: `${scrollProgress * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-terminal-green via-terminal-blue to-terminal-purple animate-pulse opacity-50" />
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 blur-sm" />
        </div>
      </div>

      {/* Navigation Dock */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-terminal-bg/95 to-terminal-bg/90 border border-terminal-green/30 rounded-2xl px-4 py-3 backdrop-blur-md shadow-2xl shadow-terminal-green/20">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`group relative w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 backdrop-blur-md overflow-hidden ${
              activeSection === item.id
                ? 'bg-gradient-to-br from-terminal-green/20 to-terminal-blue/20 border-terminal-green shadow-lg shadow-terminal-green/30'
                : 'bg-terminal-bg/20 border-terminal-border/30 hover:border-terminal-green/50 hover:bg-gradient-to-br hover:from-terminal-green/10 hover:to-terminal-blue/10'
            }`}
            style={{ 
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Icon */}
            <item.icon className={`w-5 h-5 mx-auto transition-all duration-300 ${
              activeSection === item.id ? 'text-terminal-green drop-shadow-lg' : 'text-terminal-text/70 group-hover:text-terminal-green'
            }`} />
            
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
              activeSection === item.id 
                ? 'bg-gradient-to-br from-terminal-green/10 to-terminal-blue/10 opacity-100' 
                : 'opacity-0 group-hover:opacity-50'
            }`} />
            
            {/* Enhanced Tooltip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-terminal-bg to-terminal-bg/90 border border-terminal-green/30 rounded-lg px-3 py-2 text-sm font-mono whitespace-nowrap backdrop-blur-md shadow-xl">
                <span className="bg-gradient-to-r from-terminal-green to-terminal-blue bg-clip-text text-transparent font-semibold">
                  {item.label}
                </span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-terminal-green/30"></div>
                
                {/* Tooltip Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/5 to-terminal-blue/5 rounded-lg blur-sm -z-10" />
              </div>
            </div>

            {/* Active Indicator Dot */}
            {activeSection === item.id && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-terminal-green to-terminal-blue rounded-full shadow-lg shadow-terminal-green/50 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Energy Field Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-terminal-green/5 via-transparent to-transparent rounded-full scale-150 animate-pulse" />
      </div>
    </div>
  );
};

export default FloatingNav;
