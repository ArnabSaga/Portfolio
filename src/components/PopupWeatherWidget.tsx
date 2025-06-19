
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snow, MapPin, Thermometer, Droplets, Wind, X } from 'lucide-react';

const PopupWeatherWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState({
    location: 'Loading...',
    temperature: '--',
    condition: 'clear',
    humidity: '--',
    windSpeed: '--',
    description: 'Loading weather data...'
  });

  const weatherIcons = {
    clear: Sun,
    cloudy: Cloud,
    rain: CloudRain,
    snow: Snow
  };

  const WeatherIcon = weatherIcons[weather.condition as keyof typeof weatherIcons] || Sun;

  useEffect(() => {
    // Simulate weather data fetch
    const fetchWeather = () => {
      setTimeout(() => {
        setWeather({
          location: 'San Francisco, CA',
          temperature: '22°C',
          condition: 'cloudy',
          humidity: '65%',
          windSpeed: '12 km/h',
          description: 'Partly cloudy with light winds'
        });
      }, 1000);
    };

    fetchWeather();
  }, []);

  return (
    <>
      {/* Weather Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-gradient-to-r from-terminal-green/20 to-terminal-blue/20 border border-terminal-green/30 rounded-xl backdrop-blur-md hover:scale-110 transition-all duration-300 group"
        title="Check Weather"
      >
        <WeatherIcon className="w-5 h-5 text-terminal-green group-hover:text-terminal-blue transition-colors" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-terminal-green rounded-full animate-pulse" />
      </button>

      {/* Weather Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#1e1e1e]/95 to-[#2d2d30]/95 rounded-2xl border border-terminal-green/30 p-6 mx-4 max-w-md w-full shadow-2xl backdrop-blur-md animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <WeatherIcon className="w-6 h-6 text-terminal-green" />
                <h3 className="text-lg font-mono font-bold text-terminal-green">Weather</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-terminal-border/30 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-terminal-text/60" />
              </button>
            </div>

            {/* Weather Info */}
            <div className="space-y-4">
              {/* Location & Temperature */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-terminal-blue" />
                  <span className="text-terminal-text font-mono text-sm">{weather.location}</span>
                </div>
                <div className="text-4xl font-bold text-terminal-green font-mono mb-2">
                  {weather.temperature}
                </div>
                <p className="text-terminal-text/70 font-mono text-sm">{weather.description}</p>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-terminal-bg/30 rounded-lg p-3 border border-terminal-border/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Droplets className="w-4 h-4 text-terminal-blue" />
                    <span className="text-xs text-terminal-text/60 font-mono">Humidity</span>
                  </div>
                  <div className="text-terminal-green font-mono font-bold">{weather.humidity}</div>
                </div>

                <div className="bg-terminal-bg/30 rounded-lg p-3 border border-terminal-border/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wind className="w-4 h-4 text-terminal-purple" />
                    <span className="text-xs text-terminal-text/60 font-mono">Wind</span>
                  </div>
                  <div className="text-terminal-green font-mono font-bold">{weather.windSpeed}</div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 p-3 bg-gradient-to-r from-terminal-green to-terminal-blue text-white rounded-lg hover:from-terminal-green/90 hover:to-terminal-blue/90 transition-all font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupWeatherWidget;
