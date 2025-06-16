
import React from 'react';

const Services = () => {
  const services = [
    {
      name: 'MERN Stack Development',
      description: 'Full-stack web applications using MongoDB, Express.js, React, and Node.js',
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript'],
      icon: '⚛️',
      color: 'from-terminal-green to-terminal-blue'
    },
    {
      name: 'Three.js Visualization',
      description: '3D web experiences and interactive visualizations for modern applications',
      technologies: ['Three.js', 'WebGL', 'GLSL', 'Blender Integration', 'AR/VR'],
      icon: '🎯',
      color: 'from-terminal-blue to-terminal-purple'
    },
    {
      name: 'Python Development',
      description: 'Backend services, automation scripts, and data processing solutions',
      technologies: ['Django', 'FastAPI', 'Flask', 'Pandas', 'NumPy'],
      icon: '🐍',
      color: 'from-terminal-yellow to-terminal-orange'
    },
    {
      name: 'PHP & WordPress',
      description: 'Dynamic websites, custom themes, and enterprise WordPress solutions',
      technologies: ['PHP', 'WordPress', 'MySQL', 'WooCommerce', 'Custom Plugins'],
      icon: '🌐',
      color: 'from-terminal-purple to-terminal-red'
    },
    {
      name: 'AI Agent Development',
      description: 'Intelligent chatbots, automation agents, and AI-powered applications',
      technologies: ['OpenAI API', 'LangChain', 'Machine Learning', 'NLP', 'TensorFlow'],
      icon: '🤖',
      color: 'from-terminal-green to-terminal-yellow'
    },
    {
      name: 'Data Scraping',
      description: 'Automated data extraction, web scraping, and API integration services',
      technologies: ['Python', 'Scrapy', 'BeautifulSoup', 'Selenium', 'Pandas'],
      icon: '📊',
      color: 'from-terminal-blue to-terminal-green'
    },
    {
      name: 'Lead Generation',
      description: 'Targeted lead generation systems and customer acquisition strategies',
      technologies: ['CRM Integration', 'Email Automation', 'Analytics', 'A/B Testing'],
      icon: '🎯',
      color: 'from-terminal-orange to-terminal-red'
    },
    {
      name: 'Custom Solutions',
      description: 'Tailored software solutions for unique business requirements',
      technologies: ['Microservices', 'API Development', 'Cloud Deployment', 'DevOps'],
      icon: '⚙️',
      color: 'from-terminal-purple to-terminal-blue'
    }
  ];

  const handleGetQuote = () => {
    // Navigate to contact section
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: trigger contact section if using navigation
      const event = new CustomEvent('navigate', { detail: 'contact' });
      window.dispatchEvent(event);
    }
  };

  const handleViewPortfolio = () => {
    // Navigate to portfolio section
    const portfolioSection = document.querySelector('[data-section="portfolio"]');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: trigger portfolio section if using navigation
      const event = new CustomEvent('navigate', { detail: 'portfolio' });
      window.dispatchEvent(event);
    }
  };

  const handleLearnMore = (serviceName: string) => {
    // Navigate to contact section with service context
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Set a timeout to focus on the message field and pre-fill it
      setTimeout(() => {
        const messageField = document.querySelector('textarea[placeholder*="message"]') as HTMLTextAreaElement;
        if (messageField) {
          messageField.focus();
          messageField.value = `I'm interested in learning more about ${serviceName}. Could you please provide more details?`;
        }
      }, 500);
    } else {
      const event = new CustomEvent('navigate', { detail: 'contact' });
      window.dispatchEvent(event);
    }
  };

  return (
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-terminal-green mb-6">
            <span className="syntax-keyword">export</span> <span className="syntax-keyword">const</span>{' '}
            <span className="syntax-function">services</span> = [
          </h2>
          <p className="text-terminal-text/80 text-lg max-w-3xl pl-6">
            <span className="syntax-comment">/*</span><br />
            <span className="syntax-comment"> * Comprehensive technology solutions tailored to your needs.</span><br />
            <span className="syntax-comment"> * From concept to deployment, we deliver excellence.</span><br />
            <span className="syntax-comment"> */</span>
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-6">
          {services.map((service, index) => (
            <div
              key={service.name}
              className="group bg-terminal-bg/50 rounded-lg border border-terminal-border p-6 hover:border-terminal-green transition-all duration-300 hover:shadow-lg hover:shadow-terminal-green/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Service Icon */}
              <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300`}>
                <span className="text-2xl">{service.icon}</span>
              </div>

              {/* Service Name */}
              <h3 className="text-lg font-semibold text-terminal-text mb-3 group-hover:text-terminal-green transition-colors duration-300">
                <span className="syntax-string">"{service.name}"</span>
              </h3>

              {/* Description */}
              <p className="text-terminal-text/70 text-sm mb-4 leading-relaxed">
                <span className="syntax-comment">// {service.description}</span>
              </p>

              {/* Technologies */}
              <div className="space-y-2">
                <p className="text-terminal-yellow text-sm">
                  <span className="syntax-variable">tech</span>: [
                </p>
                <div className="pl-4 space-y-1 max-h-20 overflow-y-auto">
                  {service.technologies.map((tech, techIndex) => (
                    <p key={tech} className="text-terminal-text text-xs">
                      <span className="syntax-string">"{tech}"</span>
                      {techIndex < service.technologies.length - 1 ? ',' : ''}
                    </p>
                  ))}
                </div>
                <p className="text-terminal-yellow text-sm">]</p>
              </div>

              {/* Learn More Button */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => handleLearnMore(service.name)}
                  className="w-full bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green py-2 px-4 rounded text-sm border border-terminal-green/30 hover:border-terminal-green/50 transition-all duration-200 cursor-pointer"
                >
                  <span className="syntax-function">learnMore</span>()
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-terminal-green text-4xl font-bold mt-8">];</p>

        {/* Call to Action */}
        <div className="mt-16 bg-[#1e1e1e] rounded-lg border border-terminal-border p-8 text-center">
          <h3 className="text-2xl font-semibold text-terminal-green mb-4">
            <span className="syntax-keyword">ready</span> <span className="syntax-keyword">to</span>{' '}
            <span className="syntax-function">startProject</span>()?
          </h3>
          <p className="text-terminal-text/80 mb-6 max-w-2xl mx-auto">
            <span className="syntax-comment">
              // Let's discuss your project requirements and create something amazing together
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetQuote}
              className="bg-terminal-green text-terminal-bg px-8 py-3 rounded-lg font-semibold hover:bg-terminal-green/90 transition-all duration-300 hover:shadow-lg hover:shadow-terminal-green/30 cursor-pointer"
            >
              <span className="syntax-function">getQuote</span>()
            </button>
            <button 
              onClick={handleViewPortfolio}
              className="border border-terminal-green text-terminal-green px-8 py-3 rounded-lg font-semibold hover:bg-terminal-green/10 transition-all duration-300 cursor-pointer"
            >
              <span className="syntax-function">viewPortfolio</span>()
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
