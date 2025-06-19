
import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('matrix');
  const [isOpen, setIsOpen] = useState(false);

  const themes = {
    matrix: {
      name: 'Matrix Green',
      primary: '#4ec9b0',
      secondary: '#569cd6',
      accent: '#dcdcaa',
      bg: '#1e1e1e',
      border: '#3c3c3c',
      text: '#d4d4d4',
      description: 'Classic hacker aesthetic'
    },
    cyberpunk: {
      name: 'Cyberpunk',
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      bg: '#0a0a0a',
      border: '#ff0080',
      text: '#ffffff',
      description: 'Neon-soaked future'
    },
    ocean: {
      name: 'Deep Ocean',
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#66ffcc',
      bg: '#001122',
      border: '#004466',
      text: '#ccffff',
      description: 'Submarine depths'
    },
    plasma: {
      name: 'Plasma Fire',
      primary: '#ff4444',
      secondary: '#ff8800',
      accent: '#ffaa00',
      bg: '#220000',
      border: '#660000',
      text: '#ffcccc',
      description: 'Molten energy'
    },
    aurora: {
      name: 'Aurora',
      primary: '#44ff88',
      secondary: '#8844ff',
      accent: '#ff8844',
      bg: '#001122',
      border: '#004422',
      text: '#ccffcc',
      description: 'Northern lights'
    }
  };

  const applyTheme = (themeKey: string) => {
    const theme = themes[themeKey as keyof typeof themes];
    if (!theme) return;
    
    const root = document.documentElement;
    
    console.log('Applying theme:', themeKey, theme);
    
    // Update terminal CSS custom properties with proper hex values
    root.style.setProperty('--terminal-green', theme.primary);
    root.style.setProperty('--terminal-blue', theme.secondary);
    root.style.setProperty('--terminal-yellow', theme.accent);
    root.style.setProperty('--terminal-bg', theme.bg);
    root.style.setProperty('--terminal-border', theme.border);
    root.style.setProperty('--terminal-text', theme.text);
    root.style.setProperty('--terminal-red', '#f44747');
    root.style.setProperty('--terminal-purple', '#c586c0');
    root.style.setProperty('--terminal-orange', '#ce9178');
    
    // Convert hex to HSL for Tailwind variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Update Tailwind CSS variables for shadcn components
    root.style.setProperty('--background', hexToHsl(theme.bg));
    root.style.setProperty('--foreground', hexToHsl(theme.text));
    root.style.setProperty('--border', hexToHsl(theme.border));
    root.style.setProperty('--primary', hexToHsl(theme.primary));
    root.style.setProperty('--secondary', hexToHsl(theme.secondary));
    root.style.setProperty('--accent', hexToHsl(theme.accent));
    
    // Update body background to match theme
    document.body.style.background = `linear-gradient(135deg, ${theme.bg} 0%, ${theme.border} 100%)`;
    
    setCurrentTheme(themeKey);
    localStorage.setItem('preferred-theme', themeKey);
    
    console.log('Theme applied successfully:', themeKey);
    
    // Force a re-render by triggering a custom event
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeKey } }));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    console.log('Loading saved theme:', savedTheme);
    
    if (savedTheme && themes[savedTheme as keyof typeof themes]) {
      applyTheme(savedTheme);
    } else {
      applyTheme('matrix'); // Apply default theme
    }
  }, []);

  const handleThemeSelect = (themeKey: string) => {
    console.log('Theme selected:', themeKey);
    applyTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-20 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-lg transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl"
        style={{
          backgroundColor: `${themes[currentTheme as keyof typeof themes].bg}90`,
          borderColor: themes[currentTheme as keyof typeof themes].border,
          color: themes[currentTheme as keyof typeof themes].primary,
          border: `1px solid ${themes[currentTheme as keyof typeof themes].border}`
        }}
        title="Change Theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-72 rounded-lg overflow-hidden animate-fade-in backdrop-blur-md shadow-xl"
          style={{
            backgroundColor: `${themes[currentTheme as keyof typeof themes].bg}95`,
            borderColor: themes[currentTheme as keyof typeof themes].border,
            border: `1px solid ${themes[currentTheme as keyof typeof themes].border}`
          }}
        >
          <div 
            className="px-4 py-3 border-b"
            style={{
              backgroundColor: `${themes[currentTheme as keyof typeof themes].bg}80`,
              borderBottomColor: themes[currentTheme as keyof typeof themes].border
            }}
          >
            <h3 
              className="font-mono font-semibold"
              style={{ color: themes[currentTheme as keyof typeof themes].primary }}
            >
              Choose Theme
            </h3>
          </div>
          
          <div className="p-2 space-y-1">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeSelect(key)}
                className="w-full p-3 rounded-lg transition-colors text-left group hover:bg-opacity-30"
                style={{
                  backgroundColor: currentTheme === key ? `${theme.border}30` : 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.border}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme === key ? `${theme.border}30` : 'transparent';
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30" 
                        style={{ 
                          backgroundColor: theme.primary,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30" 
                        style={{ 
                          backgroundColor: theme.secondary,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30" 
                        style={{ 
                          backgroundColor: theme.accent,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                    </div>
                    <div>
                      <div 
                        className="font-mono text-sm"
                        style={{ color: themes[currentTheme as keyof typeof themes].text }}
                      >
                        {theme.name}
                      </div>
                      <div 
                        className="text-xs opacity-60"
                        style={{ color: themes[currentTheme as keyof typeof themes].text }}
                      >
                        {theme.description}
                      </div>
                    </div>
                  </div>
                  
                  {currentTheme === key && (
                    <Check 
                      className="w-4 h-4" 
                      style={{ color: themes[currentTheme as keyof typeof themes].primary }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
