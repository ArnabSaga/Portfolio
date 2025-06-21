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
    if (!theme) {
      console.error('Theme not found:', themeKey);
      return;
    }

    console.log('Applying theme:', themeKey, theme);
    const root = document.documentElement;
    const body = document.body;

    // Update CSS custom properties with more comprehensive coverage
    root.style.setProperty('--terminal-bg', theme.bg);
    root.style.setProperty('--terminal-border', theme.border);
    root.style.setProperty('--terminal-text', theme.text);
    root.style.setProperty('--terminal-green', theme.primary);
    root.style.setProperty('--terminal-blue', theme.secondary);
    root.style.setProperty('--terminal-yellow', theme.accent);
    root.style.setProperty('--terminal-red', '#f44747');
    root.style.setProperty('--terminal-purple', '#c586c0');
    root.style.setProperty('--terminal-orange', '#ce9178');

    // Update Tailwind terminal colors in config
    root.style.setProperty('--tw-terminal-bg', theme.bg);
    root.style.setProperty('--tw-terminal-border', theme.border);
    root.style.setProperty('--tw-terminal-text', theme.text);
    root.style.setProperty('--tw-terminal-green', theme.primary);
    root.style.setProperty('--tw-terminal-blue', theme.secondary);
    root.style.setProperty('--tw-terminal-yellow', theme.accent);

    // Apply background and text colors directly
    body.style.background = `linear-gradient(135deg, ${theme.bg} 0%, ${theme.border} 100%)`;
    body.style.color = theme.text;

    // Update all elements that might use these colors
    const elementsToUpdate = document.querySelectorAll('[class*="terminal-"], [class*="bg-terminal"], [class*="text-terminal"], [class*="border-terminal"]');
    elementsToUpdate.forEach(el => {
      const element = el as HTMLElement;
      element.style.setProperty('--current-bg', theme.bg);
      element.style.setProperty('--current-border', theme.border);
      element.style.setProperty('--current-text', theme.text);
      element.style.setProperty('--current-primary', theme.primary);
    });

    // Force reflow to ensure styles are applied
    body.offsetHeight;
    
    // Update state and storage
    setCurrentTheme(themeKey);
    localStorage.setItem('preferred-theme', themeKey);
    
    console.log('Theme applied successfully:', themeKey);

    // Dispatch custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: themeKey, colors: theme }
    }));

    // Apply theme to dynamic elements with a small delay
    setTimeout(() => {
      const dynamicElements = document.querySelectorAll('.bg-terminal-bg, .text-terminal-text, .border-terminal-border');
      dynamicElements.forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = theme.bg;
        element.style.color = theme.text;
        element.style.borderColor = theme.border;
      });
    }, 100);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    console.log('Loading saved theme:', savedTheme);
    if (savedTheme && themes[savedTheme as keyof typeof themes]) {
      applyTheme(savedTheme);
    } else {
      applyTheme('matrix');
    }

    // Listen for theme change events
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Theme change event received:', event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  const handleThemeSelect = (themeKey: string) => {
    console.log('Theme selected:', themeKey);
    applyTheme(themeKey);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    console.log('Theme dropdown toggled');
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-20 right-6 z-50">
      <button 
        onClick={toggleDropdown}
        title="Change Theme" 
        className="p-3 rounded-lg transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl border my-[50px] hover:scale-105"
        style={{
          backgroundColor: `${themes[currentTheme as keyof typeof themes].bg}90`,
          borderColor: themes[currentTheme as keyof typeof themes].border,
          color: themes[currentTheme as keyof typeof themes].primary
        }}
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-72 rounded-lg overflow-hidden animate-fade-in backdrop-blur-md shadow-xl border"
          style={{
            backgroundColor: `${themes[currentTheme as keyof typeof themes].bg}95`,
            borderColor: themes[currentTheme as keyof typeof themes].border
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
                className="w-full p-3 rounded-lg transition-all duration-200 text-left group hover:scale-102"
                style={{
                  backgroundColor: currentTheme === key ? `${theme.border}40` : 'transparent',
                  border: currentTheme === key ? `1px solid ${theme.primary}40` : '1px solid transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30 shadow-sm"
                        style={{
                          backgroundColor: theme.primary,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30 shadow-sm"
                        style={{
                          backgroundColor: theme.secondary,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-opacity-30 shadow-sm"
                        style={{
                          backgroundColor: theme.accent,
                          borderColor: `${themes[currentTheme as keyof typeof themes].border}30`
                        }}
                      />
                    </div>
                    <div>
                      <div 
                        className="font-mono text-sm font-medium"
                        style={{ color: themes[currentTheme as keyof typeof themes].text }}
                      >
                        {theme.name}
                      </div>
                      <div 
                        className="text-xs opacity-70"
                        style={{ color: themes[currentTheme as keyof typeof themes].text }}
                      >
                        {theme.description}
                      </div>
                    </div>
                  </div>
                  
                  {currentTheme === key && (
                    <Check 
                      className="w-4 h-4 animate-fade-in"
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
