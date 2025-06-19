
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Eye, Droplets, MapPin, Clock, Wifi, Zap, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const PopupWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const fetchLocationByIP = async () => {
    try {
      console.log('Attempting to detect location...');
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          
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
      
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      try {
        const locationResponse = await fetch(`https://freeipapi.com/api/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        
        if (locationData && locationData.cityName) {
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
      
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const hour = new Date().getHours();
    
    let condition = conditions[Math.floor(Math.random() * conditions.length)];
    if (hour >= 6 && hour <= 18) {
      condition = Math.random() > 0.3 ? 'Sunny' : 'Partly Cloudy';
    } else {
      condition = Math.random() > 0.5 ? 'Clear' : 'Partly Cloudy';
    }
    
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
        const locationData = await fetchLocationByIP();
        setLocation(locationData);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const weatherData = generateWeatherFromLocation(locationData);
        setWeather(weatherData);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to detect location');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const weatherInterval = setInterval(fetchData, 600000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    const iconClass = "w-5 h-5";
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-400`} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className={`${iconClass} text-gray-300`} />;
      case 'rainy':
      case 'rain':
      case 'light rain':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className={`${iconClass} text-white`} />;
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
          minute: '2-digit'
        });
      } catch (e) {
        console.log('Timezone error:', e);
      }
    }
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-terminal-bg/90 border border-terminal-green/30 rounded-lg p-3 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-terminal-green/20 border-t-terminal-green rounded-full"></div>
            <span className="text-terminal-green font-mono text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-terminal-bg/90 border border-red-400/50 rounded-lg p-3 backdrop-blur-md">
          <span className="text-red-400 font-mono text-sm">Location Failed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="bg-terminal-bg/90 border border-terminal-green/30 rounded-lg p-3 backdrop-blur-md hover:border-terminal-green/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weather.condition)}
              <span className="text-terminal-green font-mono font-bold">{weather.temperature}°</span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-terminal-bg/95 border-terminal-green/30" align="end">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-terminal-green font-mono">
                  {weather.temperature}°C
                </div>
                <div className="text-terminal-text/90 text-sm font-mono">
                  {weather.condition}
                </div>
                <div className="flex items-center text-terminal-text/70 text-xs font-mono">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{weather.location}</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-terminal-bg/40 border border-terminal-green/20">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>

            <div className="bg-terminal-bg/60 rounded-lg p-3 border border-terminal-green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-terminal-blue" />
                  <span className="text-terminal-text/80 font-mono text-sm">Local Time</span>
                </div>
                <div className="text-terminal-green font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-terminal-bg/50 rounded-lg p-3 border border-terminal-blue/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Droplets className="w-3 h-3 text-terminal-blue" />
                  <span className="text-terminal-text/80 text-xs font-mono">Humidity</span>
                </div>
                <div className="text-terminal-blue font-mono font-bold">
                  {weather.humidity}%
                </div>
              </div>

              <div className="bg-terminal-bg/50 rounded-lg p-3 border border-terminal-green/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="w-3 h-3 text-terminal-green" />
                  <span className="text-terminal-text/80 text-xs font-mono">Wind</span>
                </div>
                <div className="text-terminal-green font-mono font-bold">
                  {weather.windSpeed} km/h
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopupWeatherWidget;
