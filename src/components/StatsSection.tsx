
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

interface StatData {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const StatsSection = () => {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    success: 0
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  const finalStats = useMemo(() => ({
    projects: 150,
    clients: 80,
    experience: 5,
    success: 98
  }), []);

  const statsData: StatData[] = useMemo(() => [
    {
      icon: TrendingUp,
      label: 'Projects Completed',
      value: stats.projects,
      suffix: '+',
      color: 'text-terminal-green'
    },
    {
      icon: Users,
      label: 'Happy Clients',
      value: stats.clients,
      suffix: '+',
      color: 'text-terminal-blue'
    },
    {
      icon: Clock,
      label: 'Years Experience',
      value: stats.experience,
      suffix: '+',
      color: 'text-terminal-yellow'
    },
    {
      icon: Award,
      label: 'Success Rate',
      value: stats.success,
      suffix: '%',
      color: 'text-terminal-purple'
    }
  ], [stats]);

  const animateCounter = useCallback((key: keyof typeof stats, target: number, delay: number) => {
    const duration = 1500;
    const steps = 45;
    const increment = target / steps;
    let current = 0;
    
    setTimeout(() => {
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, duration / steps);
    }, delay);
  }, []);

  useEffect(() => {
    if (!hasAnimated) {
      // Use Intersection Observer for better performance
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasAnimated(true);
            animateCounter('projects', finalStats.projects, 100);
            animateCounter('clients', finalStats.clients, 200);
            animateCounter('experience', finalStats.experience, 300);
            animateCounter('success', finalStats.success, 400);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      const section = document.querySelector('[data-stats-section]');
      if (section) {
        observer.observe(section);
      }

      return () => observer.disconnect();
    }
  }, [hasAnimated, animateCounter, finalStats]);

  return (
    <section className="py-16 px-6 bg-terminal-bg/30" data-stats-section>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-terminal-green mb-4">
            <span className="syntax-comment">// Our Achievements</span>
          </h2>
          <p className="text-terminal-text/80">
            Delivering excellence through innovation and dedication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-terminal-bg/50 border border-terminal-border rounded-lg p-6 text-center hover:border-terminal-green transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-terminal-green/20"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
                opacity: hasAnimated ? 1 : 0,
                transition: `all 0.6s ease-out ${index * 0.1}s`
              }}
            >
              <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-4 transition-transform duration-300 hover:scale-110`} />
              <div className="text-3xl font-bold text-terminal-text mb-2 font-mono">
                {stat.value}<span className={stat.color}>{stat.suffix}</span>
              </div>
              <p className="text-terminal-text/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
