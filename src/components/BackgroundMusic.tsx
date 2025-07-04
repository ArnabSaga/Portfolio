
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Free ambient music URL (you can replace with your preferred track)
  const musicUrl = "https://www.soundjay.com/misc/sounds-1/beep-28.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Auto-play with user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isPlaying && audioRef.current) {
        togglePlay();
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.log('Audio error:', e)}
      >
        <source src={musicUrl} type="audio/mpeg" />
        {/* Fallback to a simple ambient tone */}
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweFDiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmweETiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFA==" type="audio/wav" />
      </audio>

      {/* Music Control Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-terminal-bg/90 backdrop-blur-sm border border-terminal-border rounded-lg p-4 flex items-center space-x-3 shadow-2xl">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-terminal-green/20 border border-terminal-green/50 flex items-center justify-center hover:bg-terminal-green/30 transition-colors"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-terminal-green" />
            ) : (
              <Play className="w-4 h-4 text-terminal-green ml-0.5" />
            )}
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-terminal-bg/50 border border-terminal-border flex items-center justify-center hover:bg-terminal-green/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-terminal-text/60" />
            ) : (
              <Volume2 className="w-4 h-4 text-terminal-text/60" />
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-terminal-border rounded-lg appearance-none cursor-pointer slider"
              aria-label="Volume control"
            />
          </div>

          {/* Music Label */}
          <div className="text-xs text-terminal-text/60 font-mono">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-terminal-green animate-pulse' : 'bg-terminal-text/30'}`}></div>
              <span>ambient</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #4ec9b0;
          cursor: pointer;
          border: 2px solid #1e1e1e;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #4ec9b0;
          cursor: pointer;
          border: 2px solid #1e1e1e;
        }
      `}</style>
    </>
  );
};

export default BackgroundMusic;
