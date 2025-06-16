import React, { useState, useEffect } from 'react';
import { Code, Database, Brain, Globe } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const textArray = [
    'Welcome to NodeXstation',
    'MERN Stack Developers',
    'Three.js Specialists',
    'AI Agent Builders',
    'Data Scraping Experts'
  ];

  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % textArray.length;
      const fullText = textArray[current];

      setDisplayText(
        isDeleting 
          ? fullText.substring(0, currentIndex - 1)
          : fullText.substring(0, currentIndex + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && currentIndex === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentIndex === 0) {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setCurrentIndex(isDeleting ? currentIndex - 1 : currentIndex + 1);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, loopNum, typingSpeed, textArray]);

  const services = [
    {
      icon: Code,
      name: 'MERN Stack',
      description: 'Full-stack JavaScript development',
      color: 'text-terminal-green'
    },
    {
      icon: Globe,
      name: 'Three.js',
      description: '3D web experiences',
      color: 'text-terminal-blue'
    },
    {
      icon: Brain,
      name: 'AI Agents',
      description: 'Intelligent automation',
      color: 'text-terminal-purple'
    },
    {
      icon: Database,
      name: 'Data Scraping',
      description: 'Automated data extraction',
      color: 'text-terminal-yellow'
    }
  ];

  const handleExploreProjects = () => {
    // Scroll to portfolio section
    const portfolioSection = document.querySelector('[data-section="portfolio"]');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: trigger portfolio section if using navigation
      const event = new CustomEvent('navigate', { detail: 'portfolio' });
      window.dispatchEvent(event);
    }
  };

  const handleContactUs = () => {
    // Scroll to contact section
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: trigger contact section if using navigation
      const event = new CustomEvent('navigate', { detail: 'contact' });
      window.dispatchEvent(event);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-6">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(78, 201, 176, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 201, 176, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-terminal-green rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Terminal Window */}
        <div className="bg-[#1e1e1e] rounded-lg border border-terminal-border overflow-hidden mb-12 hover-glow">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#323233] border-b border-terminal-border">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-terminal-text text-sm ml-4">terminal</span>
            </div>
            <div className="text-terminal-text/60 text-xs">NodeXstation</div>
          </div>

          {/* Terminal Content */}
          <div className="p-8">
            <div className="terminal-line">
              <span className="terminal-prompt">nodex@station:~$</span>
              <span className="text-terminal-text font-mono">echo "</span>
              <span className="text-terminal-green font-mono text-2xl md:text-4xl font-bold">
                {displayText}
                <span className="terminal-cursor"></span>
              </span>
              <span className="text-terminal-text font-mono">"</span>
            </div>
            
            <div className="mt-6 text-left">
              <div className="terminal-line">
                <span className="terminal-prompt">nodex@station:~$</span>
                <span className="text-terminal-text font-mono">cat services.json</span>
              </div>
              <div className="mt-2 pl-6">
                <span className="syntax-comment">// Professional software development company</span><br />
                <span className="syntax-keyword">const</span> <span className="syntax-variable">expertise</span> = [<br />
                <span className="pl-4 syntax-string">"MERN Stack Development"</span>,<br />
                <span className="pl-4 syntax-string">"Three.js 3D Experiences"</span>,<br />
                <span className="pl-4 syntax-string">"AI Agent Development"</span>,<br />
                <span className="pl-4 syntax-string">"Data Scraping & Automation"</span><br />
                ];
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={service.name}
              className="bg-terminal-bg/50 border border-terminal-border rounded-lg p-6 hover:border-terminal-green transition-all duration-300 hover:scale-105 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <service.icon className={`w-8 h-8 ${service.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-terminal-text font-semibold mb-2">{service.name}</h3>
              <p className="text-terminal-text/70 text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="space-y-6">
          <p className="text-terminal-text/80 text-lg max-w-2xl mx-auto">
            <span className="syntax-comment">/*</span><br />
            <span className="syntax-comment"> * Transforming ideas into digital reality</span><br />
            <span className="syntax-comment"> * Building the future, one line of code at a time</span><br />
            <span className="syntax-comment"> */</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleExploreProjects}
              className="bg-terminal-green text-terminal-bg px-8 py-3 rounded-lg font-semibold hover:bg-terminal-green/90 transition-colors hover-scale cursor-pointer"
            >
              <span className="syntax-function">exploreProjects</span>()
            </button>
            <button 
              onClick={handleContactUs}
              className="border border-terminal-green text-terminal-green px-8 py-3 rounded-lg font-semibold hover:bg-terminal-green/10 transition-colors hover-scale cursor-pointer"
            >
              <span className="syntax-function">contactUs</span>()
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
