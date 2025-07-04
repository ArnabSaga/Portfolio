
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import StatsSection from '../components/StatsSection';
import ThreeJsShowcase from '../components/ThreeJsShowcase';
import TechStack from '../components/TechStack';
import FloatingNav from '../components/FloatingNav';
import MagneticCursor from '../components/MagneticCursor';
import LoadingScreen from '../components/LoadingScreen';
import ParticleBackground from '../components/ParticleBackground';
import ScrollReveal from '../components/ScrollReveal';
import LiveCodeEditor from '../components/LiveCodeEditor';
import InteractiveTerminal from '../components/InteractiveTerminal';
import ReactiveParticles from '../components/ReactiveParticles';
import ProjectCarousel from '../components/ProjectCarousel';
import RealTimeContactForm from '../components/RealTimeContactForm';
import SkillQuiz from '../components/SkillQuiz';
import GitHubStats from '../components/GitHubStats';
import GameSection from '../components/GameSection';
import SocialSidebar from '../components/SocialSidebar';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Import navigation handler
    import('../utils/navigationHandler');

    // Smooth scrolling and ensure page starts at top
    const style = document.createElement('style');
    style.textContent = `
      html { scroll-behavior: smooth; }
      body { cursor: none; }
    `;
    document.head.appendChild(style);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Listen for custom navigation events
    const handleNavigation = (event: any) => {
      if (event.detail) {
        setActiveSection(event.detail);
      }
    };

    // Listen for toast events
    const handleToast = (event: any) => {
      if (event.detail) {
        toast({
          title: event.detail.title,
          description: event.detail.description,
          variant: event.detail.variant || 'default'
        });
      }
    };

    window.addEventListener('navigate', handleNavigation);
    window.addEventListener('show-toast', handleToast);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('navigate', handleNavigation);
      window.removeEventListener('show-toast', handleToast);
    };
  }, [toast]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <ScrollReveal direction="up">
              <Hero />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={200}>
              <StatsSection />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={400}>
              <ThreeJsShowcase />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <ReactiveParticles />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={800}>
              <LiveCodeEditor />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1000}>
              <InteractiveTerminal />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={1200}>
              <GameSection />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={1400}>
              <SkillQuiz />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1600}>
              <GitHubStats />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={1800}>
              <TechStack />
            </ScrollReveal>
          </>
        );
      case 'about':
        return (
          <div data-section="about">
            <ScrollReveal direction="up">
              <About />
            </ScrollReveal>
          </div>
        );
      case 'services':
        return (
          <div data-section="services">
            <ScrollReveal direction="up">
              <Services />
            </ScrollReveal>
          </div>
        );
      case 'portfolio':
        return (
          <div data-section="portfolio">
            <ScrollReveal direction="up">
              <Portfolio />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <ProjectCarousel />
            </ScrollReveal>
          </div>
        );
      case 'contact':
        return (
          <div data-section="contact">
            <ScrollReveal direction="up">
              <Contact />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <RealTimeContactForm />
            </ScrollReveal>
          </div>
        );
      default:
        return (
          <>
            <ScrollReveal direction="up">
              <Hero />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={200}>
              <StatsSection />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={400}>
              <ThreeJsShowcase />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <ReactiveParticles />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={800}>
              <LiveCodeEditor />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1000}>
              <InteractiveTerminal />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={1200}>
              <SkillQuiz />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={1400}>
              <GitHubStats />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1600}>
              <TechStack />
            </ScrollReveal>
          </>
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`min-h-screen bg-terminal-bg text-terminal-text transition-opacity duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Advanced Features */}
      <MagneticCursor />
      <ParticleBackground />
      <FloatingNav activeSection={activeSection} setActiveSection={setActiveSection} />
      <SocialSidebar />
      
      {/* Main Header */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative pt-0">
        {renderSection()}
        
        {/* Enhanced Background Patterns */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terminal-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terminal-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-terminal-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Enhanced Code Rain Effect */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute text-terminal-green text-xs font-mono animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                {['{...}', 'console.log()', 'async/await', 'useState()', 'useEffect()'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="bg-[#1e1e1e] border-t border-terminal-border py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/5 via-terminal-blue/5 to-terminal-purple/5"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <p className="text-terminal-text/60 font-mono">
              <span className="syntax-comment">/*</span><br />
              <span className="syntax-comment"> * © 2024 NodeXstation. Built with ❤️ and React.</span><br />
              <span className="syntax-comment"> * Transforming ideas into digital reality.</span><br />
              <span className="syntax-comment"> */</span>
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a
                href="mailto:nodexstation@gmail.com"
                className="text-terminal-text/60 hover:text-terminal-green transition-colors font-mono text-sm hover:scale-110 transform duration-200"
                data-magnetic
                data-cursor-text="Send Email"
              >
                <span className="syntax-variable">email</span>
              </a>
              <a
                href="https://github.com/usuf93817"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-text/60 hover:text-terminal-green transition-colors font-mono text-sm hover:scale-110 transform duration-200"
                data-magnetic
                data-cursor-text="View GitHub"
              >
                <span className="syntax-variable">github</span>
              </a>
              <a
                href="https://www.instagram.com/nodex_station/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-text/60 hover:text-terminal-green transition-colors font-mono text-sm hover:scale-110 transform duration-200"
                data-magnetic
                data-cursor-text="Follow Instagram"
              >
                <span className="syntax-variable">instagram</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
};

export default Index;
