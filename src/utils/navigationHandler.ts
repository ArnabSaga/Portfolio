
// Navigation utility functions
export const exploreProjects = () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'portfolio' }));
  // Smooth scroll to portfolio section
  setTimeout(() => {
    const portfolioSection = document.querySelector('[data-section="portfolio"]');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

export const contactUs = () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }));
  // Smooth scroll to contact section
  setTimeout(() => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

export const getQuote = () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }));
  // Show success toast
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: {
      title: 'Quote Request',
      description: 'Redirecting to contact form for your custom quote',
      variant: 'default'
    }
  }));
  // Smooth scroll to contact section
  setTimeout(() => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

export const viewPortfolio = () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'portfolio' }));
  // Smooth scroll to portfolio section
  setTimeout(() => {
    const portfolioSection = document.querySelector('[data-section="portfolio"]');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

export const learnMore = () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'about' }));
  // Smooth scroll to about section
  setTimeout(() => {
    const aboutSection = document.querySelector('[data-section="about"]');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

export const viewLiveDemo = (projectUrl: string = 'https://nodexstation-demo.vercel.app') => {
  window.open(projectUrl, '_blank', 'noopener,noreferrer');
  // Show toast notification
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: {
      title: 'Live Demo',
      description: 'Opening project demo in new tab',
      variant: 'default'
    }
  }));
};

export const viewCode = (repoUrl: string = 'https://github.com/usuf93817') => {
  window.open(repoUrl, '_blank', 'noopener,noreferrer');
  // Show toast notification
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: {
      title: 'Source Code',
      description: 'Opening GitHub repository in new tab',
      variant: 'default'
    }
  }));
};

export const getCurrentLocation = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    
    // Show location in toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        title: 'Location Detected',
        description: `Your IP: ${data.ip}`,
        variant: 'default'
      }
    }));
    
    return data.ip;
  } catch (error) {
    console.error('Error getting location:', error);
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        title: 'Location Error',
        description: 'Could not detect your location',
        variant: 'destructive'
      }
    }));
    return null;
  }
};

// Make functions globally available
if (typeof window !== 'undefined') {
  (window as any).exploreProjects = exploreProjects;
  (window as any).contactUs = contactUs;
  (window as any).getQuote = getQuote;
  (window as any).viewPortfolio = viewPortfolio;
  (window as any).learnMore = learnMore;
  (window as any).viewLiveDemo = viewLiveDemo;
  (window as any).viewCode = viewCode;
  (window as any).getCurrentLocation = getCurrentLocation;
}
