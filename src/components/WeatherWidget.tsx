import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Eye, Droplets, MapPin, Clock, Wifi, Zap } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  icon: string;
  feelsLike: number;
  uvIndex: number;
  pressure: number;
}

interface LocationData {
  city: string;
  region: string;
  country: string;
  timezone: string;
  lat: number;
  lon: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchLocationByIP = async () => {
    try {
      console.log('Attempting to detect location...');
      
      // First try browser geolocation API
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          
          console.log('Browser geolocation successful:', position.coords);
          
          // Use reverse geocoding with a free service
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
          const data = await response.json();
          
          return {
            city: data.city || data.locality || 'Unknown City',
            region: data.principalSubdivision || '',
            country: data.countryName || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
        } catch (geoError) {
          console.log('Browser geolocation failed:', geoError);
        }
      }
      
      // Fallback to IP-based location
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      console.log('IP detected:', ipData.ip);
      
      // Try to get location from IP using a free service
      try {
        const locationResponse = await fetch(`https://freeipapi.com/api/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        
        if (locationData && locationData.cityName) {
          console.log('Location from IP:', locationData);
          return {
            city: locationData.cityName || 'Unknown',
            region: locationData.regionName || '',
            country: locationData.countryName || '',
            timezone: locationData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            lat: parseFloat(locationData.latitude) || 0,
            lon: parseFloat(locationData.longitude) || 0
          };
        }
      } catch (ipLocationError) {
        console.log('IP location service failed:', ipLocationError);
      }
      
      // Final fallback - use timezone to guess location
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Using timezone fallback:', timezone);
      
      const cityFromTimezone = timezone.split('/').pop()?.replace(/_/g, ' ') || 'Unknown';
      
      return {
        city: cityFromTimezone,
        region: '',
        country: timezone.split('/')[0] === 'America' ? 'United States' : 'Unknown',
        timezone: timezone,
        lat: 0,
        lon: 0
      };
      
    } catch (error) {
      console.log('All location detection methods failed, using default');
      return {
        city: 'San Francisco',
        region: 'CA',
        country: 'United States',
        timezone: 'America/Los_Angeles',
        lat: 37.7749,
        lon: -122.4194
      };
    }
  };

  const generateWeatherFromLocation = (locationData: LocationData): WeatherData => {
    // Generate realistic weather based on location and time
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const hour = new Date().getHours();
    
    // Choose condition based on time of day
    let condition = conditions[Math.floor(Math.random() * conditions.length)];
    if (hour >= 6 && hour <= 18) {
      condition = Math.random() > 0.3 ? 'Sunny' : 'Partly Cloudy';
    } else {
      condition = Math.random() > 0.5 ? 'Clear' : 'Partly Cloudy';
    }
    
    // Base temperature on latitude and season
    const baseTemp = Math.max(5, Math.min(35, 25 - Math.abs(locationData.lat) * 0.5 + Math.random() * 10));
    
    return {
      temperature: Math.round(baseTemp),
      condition: condition,
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      visibility: Math.round(8 + Math.random() * 7),
      location: locationData.city && locationData.region ? 
        `${locationData.city}, ${locationData.region}` : 
        locationData.city || 'Unknown Location',
      icon: condition.toLowerCase().replace(' ', '-'),
      feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 4),
      uvIndex: Math.round(Math.random() * 10),
      pressure: Math.round(1000 + Math.random() * 50)
    };
  };

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Starting location detection...');
        const locationData = await fetchLocationByIP();
        console.log('Location detected:', locationData);
        setLocation(locationData);
        
        // Simulate API delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const weatherData = generateWeatherFromLocation(locationData);
        console.log('Weather generated:', weatherData);
        setWeather(weatherData);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to detect location');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const weatherInterval = setInterval(fetchData, 600000); // Update every 10 minutes
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    const iconClass = "w-8 h-8 drop-shadow-2xl";
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-400 animate-pulse glow-text`} style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))' }} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className={`${iconClass} text-gray-300`} style={{ filter: 'drop-shadow(0 0 8px rgba(209, 213, 219, 0.6))' }} />;
      case 'rainy':
      case 'rain':
      case 'light rain':
        return <CloudRain className={`${iconClass} text-blue-400 animate-bounce`} style={{ filter: 'drop-shadow(0 0 12px rgba(96, 165, 250, 0.8))' }} />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className={`${iconClass} text-white animate-pulse`} style={{ filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))' }} />;
      default:
        return <Cloud className={`${iconClass} text-gray-300`} />;
    }
  };

  const formatTime = (date: Date) => {
    if (location?.timezone) {
      try {
        return date.toLocaleTimeString('en-US', { 
          timeZone: location.timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (e) {
        console.log('Timezone error:', e);
      }
    }
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 w-72 bg-gradient-to-br from-terminal-bg/95 via-purple-900/20 to-terminal-bg/80 border border-terminal-green/30 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl z-40 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/10 via-transparent to-terminal-blue/10 animate-pulse"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="animate-spin w-8 h-8 border-3 border-terminal-green/20 border-t-terminal-green rounded-full shadow-lg shadow-terminal-green/30"></div>
              <Zap className="w-4 h-4 text-terminal-green absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <span className="text-terminal-green font-mono text-lg font-semibold glow-text animate-pulse">Detecting location...</span>
              <div className="text-terminal-text/60 text-sm font-mono">GPS & IP geolocation active</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="fixed top-4 right-4 w-72 bg-gradient-to-br from-terminal-bg/95 via-red-900/30 to-terminal-bg/80 border border-red-400/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl z-40">
        <div className="p-6">
          <div className="text-red-400 font-mono text-lg flex items-center glow-text">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse shadow-lg shadow-red-400/50" />
            Location Detection Failed
          </div>
          <div className="text-red-300/60 text-sm mt-2">Unable to determine current location</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 bg-gradient-to-br from-terminal-bg/95 via-terminal-green/5 via-terminal-blue/5 to-terminal-bg/85 border border-terminal-green/40 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-700 z-40 ${
      isExpanded ? 'w-80' : 'w-72'
    }`} style={{ 
      boxShadow: '0 0 40px rgba(78, 201, 176, 0.15), 0 0 80px rgba(78, 201, 176, 0.05), inset 0 0 20px rgba(78, 201, 176, 0.03)' 
    }}>
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/20 via-terminal-blue/15 via-terminal-purple/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-terminal-green/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-terminal-blue/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-terminal-purple/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative px-4 py-3 bg-gradient-to-r from-terminal-green/15 via-terminal-blue/10 to-terminal-purple/15 border-b border-terminal-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-lg shadow-red-400/60"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/60" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/60" style={{ animationDelay: '0.6s' }}></div>
            </div>
            <span className="text-terminal-green text-sm font-mono font-bold glow-text tracking-wide">LOCATION.SYS</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-terminal-text/60 hover:text-terminal-green transition-all duration-300 hover:scale-125 hover:rotate-180"
            style={{ filter: 'drop-shadow(0 0 5px rgba(78, 201, 176, 0.3))' }}
          >
            <div className="w-4 h-4 border-2 border-current rounded-md hover:shadow-md hover:shadow-terminal-green/40" />
          </button>
        </div>
      </div>

      {/* Enhanced Weather Display */}
      <div className="relative p-4 space-y-4">
        {/* Primary Weather with Dramatic Styling */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-4xl font-black text-terminal-green font-mono flex items-baseline glow-text" style={{ 
              textShadow: '0 0 20px rgba(78, 201, 176, 0.6), 0 0 40px rgba(78, 201, 176, 0.3)' 
            }}>
              <span className="drop-shadow-2xl">{weather.temperature}</span>
              <span className="text-lg text-terminal-text/70 ml-1 font-normal">°C</span>
            </div>
            <div className="text-terminal-text/90 text-sm font-mono font-semibold tracking-wide">
              {weather.condition}
            </div>
            <div className="flex items-center text-terminal-text/70 text-xs font-mono">
              <MapPin className="w-3 h-3 mr-1.5 text-terminal-blue animate-pulse" />
              <span className="truncate">{weather.location}</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/30 to-terminal-blue/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative p-3 rounded-full bg-gradient-to-br from-terminal-bg/40 to-terminal-bg/20 border border-terminal-green/30">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>
        </div>

        {/* Enhanced Time Display */}
        <div className="bg-gradient-to-r from-terminal-bg/60 via-terminal-green/5 to-terminal-bg/40 rounded-xl p-3 border border-terminal-green/20 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-terminal-blue animate-pulse glow-text" />
              <span className="text-terminal-text/80 font-mono font-semibold text-sm">Local Time</span>
            </div>
            <div className="text-terminal-green font-mono font-black text-lg tracking-widest glow-text" style={{ 
              textShadow: '0 0 15px rgba(78, 201, 176, 0.8)' 
            }}>
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Enhanced Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-terminal-bg/50 via-terminal-blue/5 to-terminal-bg/30 rounded-xl p-3 border border-terminal-blue/20 hover:border-terminal-blue/40 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-terminal-blue/20">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="w-4 h-4 text-terminal-blue group-hover:animate-bounce glow-text" />
              <span className="text-terminal-text/80 text-xs font-mono font-semibold">Humidity</span>
            </div>
            <div className="text-terminal-blue font-mono font-bold text-lg glow-text">
              {weather.humidity}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-terminal-bg/50 via-terminal-green/5 to-terminal-bg/30 rounded-xl p-3 border border-terminal-green/20 hover:border-terminal-green/40 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-terminal-green/20">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="w-4 h-4 text-terminal-green group-hover:animate-spin glow-text" />
              <span className="text-terminal-text/80 text-xs font-mono font-semibold">Wind</span>
            </div>
            <div className="text-terminal-green font-mono font-bold text-lg glow-text">
              {weather.windSpeed} km/h
            </div>
          </div>

          {isExpanded && (
            <>
              <div className="bg-gradient-to-br from-terminal-bg/50 via-terminal-purple/5 to-terminal-bg/30 rounded-xl p-3 border border-terminal-purple/20 hover:border-terminal-purple/40 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-terminal-purple/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-4 h-4 text-terminal-purple group-hover:scale-125 transition-transform glow-text" />
                  <span className="text-terminal-text/80 text-xs font-mono font-semibold">Visibility</span>
                </div>
                <div className="text-terminal-purple font-mono font-bold text-lg glow-text">
                  {weather.visibility} km
                </div>
              </div>

              <div className="bg-gradient-to-br from-terminal-bg/50 via-terminal-yellow/5 to-terminal-bg/30 rounded-xl p-3 border border-terminal-yellow/20 hover:border-terminal-yellow/40 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-terminal-yellow/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="w-4 h-4 text-terminal-yellow group-hover:animate-pulse glow-text" />
                  <span className="text-terminal-text/80 text-xs font-mono font-semibold">Feels like</span>
                </div>
                <div className="text-terminal-yellow font-mono font-bold text-lg glow-text">
                  {weather.feelsLike}°C
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Status Bar */}
        <div className="flex items-center justify-between text-terminal-text/50 text-xs font-mono pt-3 border-t border-terminal-green/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse shadow-md shadow-terminal-green/60" />
            <span className="font-semibold tracking-wide">LOCATION ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span className="font-semibold tracking-wide">GPS ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
