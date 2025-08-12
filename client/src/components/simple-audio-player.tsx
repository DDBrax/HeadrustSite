import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface SimpleAudioPlayerProps {
  audioSrc: string;
  loopStart?: number;
  loopEnd?: number;
  className?: string;
}

export default function SimpleAudioPlayer({ 
  audioSrc, 
  loopStart = 0, 
  loopEnd = 8, 
  className = "" 
}: SimpleAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.preload = "auto";
    audio.muted = true;
    audio.currentTime = loopStart;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= loopEnd) {
        audio.currentTime = loopStart;
      }
    };

    const handleCanPlayThrough = async () => {
      if (!hasInteracted) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked");
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Global click handler
    const handleFirstClick = async () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (!isPlaying) {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (error) {
            console.log("Play failed:", error);
          }
        }
      }
    };

    document.addEventListener('click', handleFirstClick, { once: true });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      document.removeEventListener('click', handleFirstClick);
    };
  }, [loopStart, loopEnd, hasInteracted, isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);
    
    try {
      if (isPlaying) {
        await audio.pause();
      } else {
        audio.currentTime = loopStart;
        await audio.play();
      }
    } catch (error) {
      console.error("Toggle play error:", error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-metal-gold/90 hover:bg-metal-gold transition-all duration-200 shadow-lg"
        data-testid="button-play-pause"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-black" />
        ) : (
          <Play className="w-6 h-6 text-black ml-0.5" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-metal-gold/30 hover:border-metal-gold transition-all duration-200"
        data-testid="button-mute"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-metal-gold" />
        ) : (
          <Volume2 className="w-5 h-5 text-metal-gold" />
        )}
      </button>

      {/* Audio Status Indicator */}
      {isPlaying && !isMuted && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-6 bg-metal-gold rounded-full animate-pulse"></div>
          <div className="w-1 h-4 bg-metal-gold/80 rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-5 bg-metal-gold/60 rounded-full animate-pulse delay-150"></div>
        </div>
      )}

      {/* Status Text */}
      <div className="text-metal-gold text-sm font-medium">
        {isPlaying && !isMuted ? "DMS Playing" : isPlaying ? "DMS (Muted)" : "DMS Paused"}
      </div>
    </div>
  );
}