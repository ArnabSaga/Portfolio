
export const navigationHandler = {
  // Home page functions
  exploreProjects: () => {
    const event = new CustomEvent('navigate', { detail: 'portfolio' });
    window.dispatchEvent(event);
    
    // Smooth scroll to portfolio section
    setTimeout(() => {
      const portfolioSection = document.querySelector('[data-section="portfolio"]');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },

  contactUs: () => {
    const event = new CustomEvent('navigate', { detail: 'contact' });
    window.dispatchEvent(event);
    
    // Smooth scroll to contact section
    setTimeout(() => {
      const contactSection = document.querySelector('[data-section="contact"]');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },

  // Services page functions
  getQuote: () => {
    const event = new CustomEvent('navigate', { detail: 'contact' });
    window.dispatchEvent(event);
    
    // Focus on contact form
    setTimeout(() => {
      const contactForm = document.querySelector('form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        const firstInput = contactForm.querySelector('input') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 500);
  },

  viewPortfolio: () => {
    const event = new CustomEvent('navigate', { detail: 'portfolio' });
    window.dispatchEvent(event);
    
    setTimeout(() => {
      const portfolioSection = document.querySelector('[data-section="portfolio"]');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },

  // Portfolio page functions
  viewLiveDemo: (projectUrl?: string) => {
    if (projectUrl) {
      window.open(projectUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default demo URLs for different projects
      const demoUrls = [
        'https://github.com/usuf93817',
        'https://codepen.io',
        'https://codesandbox.io'
      ];
      const randomUrl = demoUrls[Math.floor(Math.random() * demoUrls.length)];
      window.open(randomUrl, '_blank', 'noopener,noreferrer');
    }
  },

  viewCode: (codeUrl?: string) => {
    if (codeUrl) {
      window.open(codeUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default to GitHub profile
      window.open('https://github.com/usuf93817', '_blank', 'noopener,noreferrer');
    }
  },

  // Services page learn more function
  learnMore: (serviceName: string) => {
    // Create a toast notification
    if (window.dispatchEvent) {
      const toastEvent = new CustomEvent('show-toast', {
        detail: {
          title: `${serviceName} Service`,
          description: `Learn more about our ${serviceName.toLowerCase()} services. Contact us for detailed information and pricing.`,
          variant: 'default'
        }
      });
      window.dispatchEvent(toastEvent);
    }

    // Navigate to contact page after showing toast
    setTimeout(() => {
      navigationHandler.contactUs();
    }, 1500);
  },

  // Current location function
  getCurrentLocation: async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Try to get location name from coordinates
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const locationData = await response.json();
              const locationString = `${locationData.city || locationData.locality || 'Unknown City'}, ${locationData.countryName || 'Unknown Country'}`;
              
              // Show location in a toast
              const toastEvent = new CustomEvent('show-toast', {
                detail: {
                  title: 'Current Location',
                  description: `📍 ${locationString}\nLat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                  variant: 'default'
                }
              });
              window.dispatchEvent(toastEvent);
              
              return locationString;
            } catch (error) {
              // Show coordinates only if reverse geocoding fails
              const locationString = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
              const toastEvent = new CustomEvent('show-toast', {
                detail: {
                  title: 'Current Location',
                  description: `📍 ${locationString}`,
                  variant: 'default'
                }
              });
              window.dispatchEvent(toastEvent);
              
              return locationString;
            }
          },
          (error) => {
            let errorMessage = 'Unable to get location';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timeout';
                break;
            }
            
            const toastEvent = new CustomEvent('show-toast', {
              detail: {
                title: 'Location Error',
                description: errorMessage,
                variant: 'destructive'
              }
            });
            window.dispatchEvent(toastEvent);
          }
        );
      } else {
        const toastEvent = new CustomEvent('show-toast', {
          detail: {
            title: 'Location Not Supported',
            description: 'Geolocation is not supported by this browser',
            variant: 'destructive'
          }
        });
        window.dispatchEvent(toastEvent);
      }
    } catch (error) {
      console.error('Location error:', error);
      const toastEvent = new CustomEvent('show-toast', {
        detail: {
          title: 'Location Error',
          description: 'Failed to get current location',
          variant: 'destructive'
        }
      });
      window.dispatchEvent(toastEvent);
    }
  }
};

// Make functions globally available
if (typeof window !== 'undefined') {
  (window as any).exploreProjects = navigationHandler.exploreProjects;
  (window as any).contactUs = navigationHandler.contactUs;
  (window as any).getQuote = navigationHandler.getQuote;
  (window as any).viewPortfolio = navigationHandler.viewPortfolio;
  (window as any).viewLiveDemo = navigationHandler.viewLiveDemo;
  (window as any).viewCode = navigationHandler.viewCode;
  (window as any).learnMore = navigationHandler.learnMore;
  (window as any).getCurrentLocation = navigationHandler.getCurrentLocation;
}
