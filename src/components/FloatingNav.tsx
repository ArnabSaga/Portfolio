
import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase, FolderOpen, Mail, Bot } from 'lucide-react';

interface FloatingNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activeSection, setActiveSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      setIsVisible(scrollTop > 200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
    }`}>
      {/* Holographic Progress Bar */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-terminal-border to-transparent rounded-full overflow-hidden">
        <div 
          className="w-full bg-gradient-to-b from-terminal-green via-terminal-blue to-terminal-purple transition-all duration-300 relative"
          style={{ height: `${scrollProgress * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-terminal-green via-terminal-blue to-terminal-purple animate-pulse opacity-50" />
          <div className="absolute top-0 left-0 w-full h-2 bg-white/50 blur-sm" />
        </div>
      </div>

      {/* Floating Particles Around Nav */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-terminal-green rounded-full opacity-60"
            style={{
              left: `${20 + Math.sin(Date.now() * 0.001 + i) * 10}px`,
              top: `${i * 60 + Math.cos(Date.now() * 0.001 + i) * 5}px`,
              animation: `particleFloat 3s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Items */}
      <div className="ml-6 space-y-4">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`group relative w-14 h-14 rounded-xl border-2 transition-all duration-300 hover:scale-110 backdrop-blur-md overflow-hidden ${
              activeSection === item.id
                ? 'bg-gradient-to-br from-terminal-green/20 to-terminal-blue/20 border-terminal-green shadow-lg shadow-terminal-green/30'
                : 'bg-terminal-bg/10 border-terminal-border/30 hover:border-terminal-green/50 hover:bg-gradient-to-br hover:from-terminal-green/5 hover:to-terminal-blue/5'
            }`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg)`
            }}
          >
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Icon */}
            <item.icon className={`w-6 h-6 mx-auto transition-all duration-300 ${
              activeSection === item.id ? 'text-terminal-green drop-shadow-lg' : 'text-terminal-text/70 group-hover:text-terminal-green'
            }`} />
            
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
              activeSection === item.id 
                ? 'bg-gradient-to-br from-terminal-green/10 to-terminal-blue/10 opacity-100' 
                : 'opacity-0 group-hover:opacity-50'
            }`} />
            
            {/* Enhanced Tooltip */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-terminal-bg to-terminal-bg/90 border border-terminal-green/30 rounded-lg px-4 py-2 text-sm font-mono whitespace-nowrap backdrop-blur-md shadow-xl">
                <span className="bg-gradient-to-r from-terminal-green to-terminal-blue bg-clip-text text-transparent font-semibold">
                  {item.label}
                </span>
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-terminal-green/30"></div>
                
                {/* Tooltip Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/5 to-terminal-blue/5 rounded-lg blur-sm -z-10" />
              </div>
            </div>

            {/* Active Indicator */}
            {activeSection === item.id && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-terminal-green to-terminal-blue rounded-full shadow-lg shadow-terminal-green/50 animate-pulse" />
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
