import React, { useState, useRef, useEffect } from 'react';
import { Terminal, User, Code, FolderOpen, Mail } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header = ({ activeSection, setActiveSection }: HeaderProps) => {
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTerminal, setShowTerminal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigation = [
    { id: 'home', label: 'Home', icon: Terminal, command: 'cd ~' },
    { id: 'about', label: 'About', icon: User, command: 'cd about' },
    { id: 'services', label: 'Services', icon: Code, command: 'cd services' },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen, command: 'cd portfolio' },
    { id: 'contact', label: 'Contact', icon: Mail, command: 'cd contact' }
  ];

  const commands = {
    'cd ~': 'home',
    'cd home': 'home',
    'cd about': 'about',
    'cd services': 'services',
    'cd portfolio': 'portfolio',
    'cd contact': 'contact',
    'ls': 'list',
    'pwd': 'path',
    'whoami': 'user',
    'help': 'help',
    'clear': 'clear'
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (commands[trimmedCommand as keyof typeof commands]) {
      const action = commands[trimmedCommand as keyof typeof commands];
      
      switch (action) {
        case 'list':
          return 'Available sections: home about services portfolio contact';
        case 'path':
          return `/nodexstation/${activeSection}`;
        case 'user':
          return 'nodex@station';
        case 'help':
          return 'Available commands: cd [section], ls, pwd, whoami, help, clear';
        case 'clear':
          return 'CLEAR';
        default:
          setActiveSection(action);
          return `Navigated to ${action}`;
      }
    }
    
    return `Command not found: ${command}. Type 'help' for available commands.`;
  };

  const executeCommand = () => {
    if (!commandInput.trim()) return;
    
    const result = handleCommand(commandInput);
    
    if (result === 'CLEAR') {
      setCommandHistory([]);
    } else {
      setCommandHistory(prev => [...prev, `$ ${commandInput}`, result]);
    }
    
    setCommandInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 2 : Math.max(0, historyIndex - 2);
        setHistoryIndex(newIndex);
        if (newIndex >= 0 && commandHistory[newIndex].startsWith('$ ')) {
          setCommandInput(commandHistory[newIndex].substring(2));
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 2;
        if (newIndex < commandHistory.length - 1) {
          setHistoryIndex(newIndex);
          setCommandInput(commandHistory[newIndex].substring(2));
        } else {
          setHistoryIndex(-1);
          setCommandInput('');
        }
      }
    }
  };

  useEffect(() => {
    if (showTerminal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTerminal]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e1e1e] border-b border-terminal-border">
        {/* VS Code Style Header */}
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-terminal-green" />
              <span className="text-terminal-text font-semibold">NodeXstation</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-terminal-border text-terminal-green'
                      : 'text-terminal-text/70 hover:text-terminal-text hover:bg-terminal-border/50'
                  }`}
                  title={item.command}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="flex items-center space-x-2 px-3 py-1 rounded text-sm text-terminal-text/70 hover:text-terminal-text hover:bg-terminal-border/50 transition-colors"
              title="Toggle Terminal"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Terminal</span>
            </button>
            
            <div className="flex items-center space-x-1 text-xs text-terminal-text/60">
              <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-terminal-border">
          <div className="flex overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 text-sm border-r border-terminal-border transition-colors ${
                  activeSection === item.id
                    ? 'bg-terminal-border text-terminal-green'
                    : 'text-terminal-text/70 hover:text-terminal-text hover:bg-terminal-border/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Terminal Overlay */}
      {showTerminal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-[#1e1e1e] border-t border-terminal-border h-64 flex flex-col">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#323233] border-b border-terminal-border">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-terminal-green" />
                <span className="text-terminal-text text-sm">NodeXstation Terminal</span>
              </div>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-terminal-text/60 hover:text-terminal-text text-sm"
              >
                ✕
              </button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              <div className="space-y-1">
                {commandHistory.map((line, index) => (
                  <div key={index} className={line.startsWith('$') ? 'text-terminal-green' : 'text-terminal-text/80'}>
                    {line}
                  </div>
                ))}
              </div>
              
              {/* Input Line */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-terminal-green">nodex@station:~{activeSection !== 'home' ? `/${activeSection}` : ''}$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-terminal-text outline-none"
                  placeholder="Type a command..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
