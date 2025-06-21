
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

const ThreeJsShowcase = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const colors = ['#4ec9b0', '#569cd6', '#dcdcaa', '#c586c0'];

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      z: Math.random() * 500,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 1
    }));
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    timeRef.current += 0.015;
    
    // Clear with trail effect
    ctx.fillStyle = 'rgba(30, 30, 30, 0.15)';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const particles = particlesRef.current;
    
    // Update and draw particles
    particles.forEach((particle, i) => {
      // Update position with smooth motion
      particle.x += particle.vx + Math.sin(timeRef.current + i * 0.1) * 0.3;
      particle.y += particle.vy + Math.cos(timeRef.current + i * 0.1) * 0.3;
      particle.z += Math.sin(timeRef.current * 0.5) * 1;

      // Wrap edges
      if (particle.x < 0) particle.x = canvas.offsetWidth;
      if (particle.x > canvas.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.offsetHeight;
      if (particle.y > canvas.offsetHeight) particle.y = 0;

      // Calculate depth-based properties
      const depth = Math.max(0.1, 1 - particle.z / 500);
      const size = particle.size * depth;
      
      // Draw particle
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = depth * 0.8;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw selective connections (optimized)
      if (i % 3 === 0) { // Only check every 3rd particle for connections
        particles.slice(i + 1, i + 5).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (80 - distance) / 400;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      }
    });

    if (isPlaying) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * Math.min(devicePixelRatio, 2);
    canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2);
    ctx.scale(canvas.width / canvas.offsetWidth, canvas.height / canvas.offsetHeight);
  }, []);

  useEffect(() => {
    resizeCanvas();
    initParticles();
    
    window.addEventListener('resize', resizeCanvas);
    
    if (isPlaying) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, animate, resizeCanvas, initParticles]);

  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetAnimation = useCallback(() => {
    timeRef.current = 0;
    initParticles();
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isPlaying, initParticles]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-terminal-green mb-4">
            <span className="syntax-keyword">class</span> <span className="syntax-function">ThreeJsDemo</span> {"{"}
          </h2>
          <p className="text-terminal-text/80 mb-6">
            Optimized particle system showcasing smooth 60fps performance
          </p>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg border border-terminal-border overflow-hidden">
          {/* Demo Header */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#323233] border-b border-terminal-border">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-terminal-text text-sm ml-4">particle-system.js</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleAnimation}
                className="p-2 text-terminal-text/60 hover:text-terminal-green transition-colors duration-200"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={resetAnimation}
                className="p-2 text-terminal-text/60 hover:text-terminal-green transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative h-96 bg-[#1e1e1e]">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: 'transparent' }}
            />
            
            {/* Performance Info */}
            <div className="absolute bottom-4 left-4 text-terminal-text/60 text-sm font-mono">
              <div>Particles: {particlesRef.current.length}</div>
              <div>Status: {isPlaying ? 'Running' : 'Paused'}</div>
              <div>Optimized: Canvas 2D</div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="p-6 border-t border-terminal-border">
            <pre className="text-sm text-terminal-text/80 font-mono">
              <code>
                <span className="syntax-comment">// Optimized particle system</span><br />
                <span className="syntax-keyword">const</span> <span className="syntax-variable">particles</span> = <span className="syntax-keyword">new</span> <span className="syntax-function">ParticleSystem</span>({"{"}
                <br />
                <span className="pl-4 syntax-variable">count</span>: <span className="syntax-string">30</span>,
                <br />
                <span className="pl-4 syntax-variable">fps</span>: <span className="syntax-string">60</span>,
                <br />
                <span className="pl-4 syntax-variable">optimized</span>: <span className="syntax-keyword">true</span>
                <br />
                {"}"});
              </code>
            </pre>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-terminal-green text-2xl font-bold">{"}"}</p>
        </div>
      </div>
    </section>
  );
};

export default ThreeJsShowcase;
