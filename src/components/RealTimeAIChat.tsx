import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const RealTimeAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'google'>('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const apiKeys = {
    openai: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    anthropic: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    google: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || !selectedProvider || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const apiKey = apiKeys[selectedProvider];
      if (!apiKey) {
        throw new Error(`API key not found for ${selectedProvider}`);
      }

      let response;
      let assistantContent = '';

      if (selectedProvider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              ...messages.filter(msg => msg.role !== 'system').map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: currentMessage.trim() }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        const data = await response.json();
        assistantContent = data.choices[0]?.message?.content || 'No response received';
      } else if (selectedProvider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-2',
            messages: [
              ...messages.filter(msg => msg.role !== 'system').map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: currentMessage.trim() }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        const data = await response.json();
        assistantContent = data.content[0]?.text || 'No response received';
      } else if (selectedProvider === 'google') {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              ...messages.filter(msg => msg.role !== 'system').map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
              })),
              { role: 'user', parts: [{ text: currentMessage.trim() }] }
            ],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7
            }
          })
        });

        const data = await response.json();
        assistantContent = data.candidates[0]?.content?.parts[0]?.text || 'No response received';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Provider and Model Selection */}
      <div className="flex items-center space-x-4 p-4 border-b border-terminal-border/40 bg-terminal-bg/80 backdrop-blur-md">
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-[180px] text-sm">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google</SelectItem>
          </SelectContent>
        </Select>

        {selectedProvider === 'openai' && (
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-hidden relative">
        <ScrollArea ref={chatContainerRef} className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2">
                    <MessageSquare className="w-4 h-4 text-terminal-blue mt-1" />
                  </div>
                )}
                <div className={`rounded-lg p-3 w-fit max-w-[80%] ${msg.role === 'user' ? 'bg-terminal-green/10 text-right' : 'bg-terminal-bg/50'}`}>
                  <p className="text-sm font-mono">{msg.content}</p>
                  <div className="text-xs text-terminal-text/50 mt-1">{msg.timestamp.toLocaleTimeString()}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="ml-2">
                    <MessageSquare className="w-4 h-4 text-terminal-green mt-1" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start">
                <div className="mr-2">
                  <MessageSquare className="w-4 h-4 text-terminal-blue mt-1" />
                </div>
                <div className="rounded-lg p-3 bg-terminal-bg/50">
                  <p className="text-sm font-mono">
                    <Loader2 className="w-4 h-4 inline-block animate-spin mr-1" />
                    Thinking...
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-terminal-border/40 bg-terminal-bg/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-md border-terminal-border/60 font-mono text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Send
              </>
            ) : (
              <>
                Send <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAIChat;
