
import React, { useState, useEffect } from 'react';
import { Github, Facebook, Instagram, Mail } from 'lucide-react';

const SocialSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const socialLinks = [
    {
      id: 'email',
      icon: Mail,
      url: 'mailto:nodexstation@gmail.com',
      label: 'Email',
      color: 'text-terminal-green',
      hoverColor: 'hover:text-terminal-green',
      description: 'Send Email'
    },
    {
      id: 'github',
      icon: Github,
      url: 'https://github.com/nodexStation',
      label: 'GitHub',
      color: 'text-terminal-text',
      hoverColor: 'hover:text-terminal-green',
      description: 'View GitHub'
    },
    {
      id: 'instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/nodex_station/',
      label: 'Instagram',
      color: 'text-terminal-purple',
      hoverColor: 'hover:text-terminal-purple',
      description: 'Follow Instagram'
    },
    {
      id: 'facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/profile.php?id=61576048524952',
      label: 'Facebook',
      color: 'text-terminal-blue',
      hoverColor: 'hover:text-terminal-blue',
      description: 'Like Facebook'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
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
    <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
    }`}>
      {/* Connection Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-6 top-0 w-px h-full bg-gradient-to-b from-transparent via-terminal-green/20 to-transparent" />
      </div>

      {/* Social Media Cards */}
      <div className="space-y-4">
        {socialLinks.map((social, index) => (
          <div
            key={social.id}
            className="group relative"
            style={{
              transform: `perspective(500px) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg)`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Main Card */}
            <a
              href={social.url}
              target={social.id !== 'email' ? '_blank' : undefined}
              rel={social.id !== 'email' ? 'noopener noreferrer' : undefined}
              className={`block w-12 h-12 bg-terminal-bg/20 border border-terminal-border/30 rounded-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-terminal-green/50 group ${social.hoverColor}`}
              data-magnetic
              data-cursor-text={social.description}
            >
              {/* Scan Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-lg" />
              
              {/* Icon */}
              <div className="flex items-center justify-center w-full h-full">
                <social.icon className={`w-5 h-5 ${social.color} group-hover:text-terminal-green transition-all duration-300`} />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-terminal-green/5 to-terminal-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            {/* Extended Info Panel */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-terminal-bg/95 to-terminal-bg/80 border border-terminal-green/30 rounded-md px-3 py-2 backdrop-blur-md shadow-xl min-w-[150px]">
                <div className="flex items-center space-x-2">
                  <social.icon className={`w-4 h-4 ${social.color}`} />
                  <div>
                    <p className="font-mono text-sm font-semibold text-terminal-green">
                      {social.label}
                    </p>
                    <p className="font-mono text-xs text-terminal-text/70">
                      {social.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection Arrow */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-terminal-green/30"></div>
              </div>
            </div>

            {/* Activity Indicator */}
            <div className={`absolute -top-1 -right-1 w-2 h-2 ${social.color} rounded-full opacity-60 animate-pulse`}>
              <div className={`absolute inset-0 ${social.color} rounded-full animate-ping`} />
            </div>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-terminal-bg/20 border border-terminal-border/30 rounded-full px-2 py-1 backdrop-blur-md">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-terminal-green rounded-full animate-pulse" />
            <span className="text-xs font-mono text-terminal-text/60">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSidebar;
