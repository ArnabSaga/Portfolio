
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface APIKey {
  provider: string;
  key: string;
  isValid?: boolean;
}

interface APIKeyManagerProps {
  onKeysUpdate: (keys: { [key: string]: string }) => void;
  initialKeys?: { [key: string]: string };
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onKeysUpdate, initialKeys = {} }) => {
  const [keys, setKeys] = useState<{ [key: string]: string }>(initialKeys);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [validationStatus, setValidationStatus] = useState<{ [key: string]: boolean }>({});

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5-turbo models',
      helpUrl: 'https://platform.openai.com/api-keys',
      pattern: /^sk-[a-zA-Z0-9]{48}$/
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3 models',
      helpUrl: 'https://console.anthropic.com/account/keys',
      pattern: /^sk-ant-[a-zA-Z0-9-_]{95}$/
    },
    {
      id: 'groq',
      name: 'Groq',
      description: 'Fast inference models',
      helpUrl: 'https://console.groq.com/keys',
      pattern: /^gsk_[a-zA-Z0-9]{52}$/
    }
  ];

  useEffect(() => {
    // Load keys from localStorage
    const savedKeys = localStorage.getItem('ai-api-keys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setKeys(parsedKeys);
        onKeysUpdate(parsedKeys);
      } catch (error) {
        console.error('Error loading saved API keys:', error);
      }
    }
  }, [onKeysUpdate]);

  const handleKeyChange = (provider: string, value: string) => {
    const newKeys = { ...keys, [provider]: value };
    setKeys(newKeys);
    
    // Validate key format
    const providerInfo = providers.find(p => p.id === provider);
    if (providerInfo && value) {
      const isValid = providerInfo.pattern.test(value);
      setValidationStatus(prev => ({ ...prev, [provider]: isValid }));
    } else {
      setValidationStatus(prev => ({ ...prev, [provider]: false }));
    }
    
    // Save to localStorage and notify parent
    localStorage.setItem('ai-api-keys', JSON.stringify(newKeys));
    onKeysUpdate(newKeys);
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const clearKey = (provider: string) => {
    const newKeys = { ...keys };
    delete newKeys[provider];
    setKeys(newKeys);
    setValidationStatus(prev => ({ ...prev, [provider]: false }));
    localStorage.setItem('ai-api-keys', JSON.stringify(newKeys));
    onKeysUpdate(newKeys);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-terminal-bg/50 to-terminal-border/30 rounded-lg p-4 border border-terminal-border/50">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-terminal-green" />
          <h3 className="text-lg font-mono text-terminal-text">API Key Management</h3>
        </div>
        <p className="text-terminal-text/60 text-sm font-mono">
          Your API keys are stored locally in your browser and never sent to our servers.
        </p>
      </div>

      <div className="grid gap-6">
        {providers.map(provider => (
          <div key={provider.id} className="bg-terminal-bg/30 rounded-lg p-6 border border-terminal-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-terminal-text font-mono font-semibold">{provider.name}</h4>
                <p className="text-terminal-text/60 text-sm font-mono">{provider.description}</p>
              </div>
              <a
                href={provider.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-green hover:text-terminal-blue transition-colors text-sm font-mono"
              >
                Get API Key →
              </a>
            </div>

            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    value={keys[provider.id] || ''}
                    onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                    placeholder={`Enter your ${provider.name} API key`}
                    className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 pr-20 text-terminal-text font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {keys[provider.id] && (
                      <div className="flex items-center">
                        {validationStatus[provider.id] ? (
                          <CheckCircle className="w-4 h-4 text-terminal-green" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => toggleShowKey(provider.id)}
                      className="p-1 hover:bg-terminal-border/30 rounded transition-colors"
                      title={showKeys[provider.id] ? 'Hide key' : 'Show key'}
                    >
                      {showKeys[provider.id] ? (
                        <EyeOff className="w-4 h-4 text-terminal-text/60" />
                      ) : (
                        <Eye className="w-4 h-4 text-terminal-text/60" />
                      )}
                    </button>
                  </div>
                </div>
                {keys[provider.id] && (
                  <button
                    onClick={() => clearKey(provider.id)}
                    className="px-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {keys[provider.id] && !validationStatus[provider.id] && (
                <p className="text-yellow-500 text-xs mt-1 font-mono">
                  Key format doesn't match expected pattern for {provider.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-terminal-border/20 to-terminal-bg/20 rounded-lg p-4 border border-terminal-border/30">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="w-4 h-4 text-terminal-blue" />
          <span className="text-sm font-mono text-terminal-text">Security Notice</span>
        </div>
        <ul className="text-xs text-terminal-text/60 font-mono space-y-1">
          <li>• API keys are stored locally in your browser's localStorage</li>
          <li>• Keys are transmitted directly to the respective AI providers</li>
          <li>• No keys are sent to or stored on our servers</li>
          <li>• Clear your keys if using a shared computer</li>
        </ul>
      </div>
    </div>
  );
};

export default APIKeyManager;
