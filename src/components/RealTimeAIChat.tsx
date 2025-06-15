
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Zap, Brain, Sparkles, Copy, Trash2, RefreshCw, Cpu } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
}

interface AIProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  models: string[];
  endpoint: string;
  requiresKey: boolean;
}

const RealTimeAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({});
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const providers: AIProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: <Zap className="w-4 h-4" />,
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      endpoint: 'https://api.openai.com/v1/chat/completions',
      requiresKey: true
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: <Brain className="w-4 h-4" />,
      models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      endpoint: 'https://api.anthropic.com/v1/messages',
      requiresKey: true
    },
    {
      id: 'groq',
      name: 'Groq',
      icon: <Cpu className="w-4 h-4" />,
      models: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      requiresKey: true
    }
  ];

  const currentProvider = providers.find(p => p.id === selectedProvider);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const callOpenAI = async (messages: Message[]) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const callAnthropic = async (messages: Message[]) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKeys.anthropic,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  };

  const callGroq = async (messages: Message[]) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.groq}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const callAI = async (messages: Message[]): Promise<string> => {
    switch (selectedProvider) {
      case 'openai':
        return await callOpenAI(messages);
      case 'anthropic':
        return await callAnthropic(messages);
      case 'groq':
        return await callGroq(messages);
      default:
        throw new Error('Provider not supported');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!apiKeys[selectedProvider]) {
      alert(`Please enter your ${currentProvider?.name} API key in settings first.`);
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      model: selectedModel
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callAI(updatedMessages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        model: selectedModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`,
        role: 'assistant',
        timestamp: new Date(),
        model: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-[#1e1e1e]/95 to-[#2d2d30]/95 rounded-2xl border border-terminal-border overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#323233] to-[#404041] border-b border-terminal-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {currentProvider?.icon}
              <span className="text-terminal-text font-mono text-sm">{currentProvider?.name}</span>
              <span className="text-terminal-text/60 text-xs">({selectedModel})</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-terminal-border/30 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-terminal-text/60" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-terminal-border/30 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-terminal-text/60" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
              <span className="text-terminal-green text-xs font-mono">LIVE AI</span>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-6 bg-terminal-bg/30 border-b border-terminal-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-terminal-text mb-2">AI Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                    const provider = providers.find(p => p.id === e.target.value);
                    if (provider) setSelectedModel(provider.models[0]);
                  }}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 text-terminal-text font-mono"
                >
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-terminal-text mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 text-terminal-text font-mono"
                >
                  {currentProvider?.models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-mono text-terminal-text mb-2">
                  {currentProvider?.name} API Key
                </label>
                <input
                  type="password"
                  value={apiKeys[selectedProvider] || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }))}
                  placeholder={`Enter your ${currentProvider?.name} API key`}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 text-terminal-text font-mono"
                />
                <p className="text-xs text-terminal-text/60 mt-1 font-mono">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-terminal-green mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-mono text-terminal-text mb-2">Real-Time AI Assistant</h3>
              <p className="text-terminal-text/60 font-mono text-sm">
                Start a conversation with {currentProvider?.name}. Configure your API key in settings above.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] group relative ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-terminal-green to-terminal-blue text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-gradient-to-r from-terminal-bg/80 to-terminal-border/50 text-terminal-text rounded-r-2xl rounded-tl-2xl border border-terminal-border/50'
                } p-4 shadow-lg`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-terminal-green" />
                    <span className="text-xs text-terminal-green font-mono">{currentProvider?.name}</span>
                    <span className="text-xs text-terminal-text/40 font-mono">({message.model})</span>
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/20">
                  <span className="text-xs opacity-60 font-mono">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-current/10 rounded"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-terminal-bg/80 to-terminal-border/50 rounded-r-2xl rounded-tl-2xl p-4 border border-terminal-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-terminal-green animate-pulse" />
                  <span className="text-xs text-terminal-green font-mono">Thinking...</span>
                </div>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-terminal-green rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-terminal-border p-6 bg-gradient-to-r from-[#323233]/50 to-[#404041]/50">
          <div className="flex items-end space-x-3">
            <div className="flex-1 flex items-end bg-terminal-bg/70 border border-terminal-border rounded-xl focus-within:border-terminal-green transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message the AI assistant..."
                className="flex-1 bg-transparent px-4 py-3 text-terminal-text placeholder-terminal-text/50 outline-none font-mono resize-none min-h-[40px] max-h-[120px]"
                disabled={isLoading}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !apiKeys[selectedProvider]}
                className="m-2 p-2 bg-gradient-to-r from-terminal-green to-terminal-blue text-white rounded-lg hover:from-terminal-green/90 hover:to-terminal-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-terminal-text/40 text-xs mt-2 font-mono text-center">
            Real-time AI conversation • Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAIChat;
