import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  audioSrc: string;
  className?: string;
}

export default function AudioControl({ audioSrc, className = "" }: AudioControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial properties
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = true; // Start muted to comply with autoplay policies

    // Try to play automatically when component mounts
    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay blocked, waiting for user interaction");
      }
    };

    // Handle audio events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Ensure seamless loop by resetting to start
      audio.currentTime = 0;
      if (isPlaying) {
        audio.play();
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Try autoplay after a short delay
    setTimeout(tryAutoPlay, 100);

    // Global click handler to resume audio if blocked
    const handleFirstInteraction = async () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        try {
          if (!isPlaying) {
            await audio.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.log("Audio play failed:", error);
        }
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasUserInteracted, isPlaying]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasUserInteracted(true);

    try {
      if (isPlaying) {
        pausedTimeRef.current = Date.now();
        await audio.pause();
        setIsPlaying(false);
      } else {
        // If paused for more than 5 seconds, restart from beginning
        const pausedDuration = Date.now() - pausedTimeRef.current;
        if (pausedDuration > 5000) {
          audio.currentTime = 0;
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        loop
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="group relative p-3 rounded-full bg-black/50 backdrop-blur-sm border border-metal-gold/20 hover:border-metal-gold/40 hover:bg-black/70 transition-all duration-300"
        title={isPlaying ? "Pause Audio" : "Play Audio"}
        data-testid="button-audio-toggle"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-metal-gold group-hover:text-white transition-colors" />
        ) : (
          <Play className="w-5 h-5 text-metal-gold group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="group relative p-3 rounded-full bg-black/50 backdrop-blur-sm border border-metal-gold/20 hover:border-metal-gold/40 hover:bg-black/70 transition-all duration-300"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
        data-testid="button-audio-mute"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-metal-gold group-hover:text-white transition-colors" />
        ) : (
          <Volume2 className="w-5 h-5 text-metal-gold group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Audio indicator */}
      {isPlaying && !isMuted && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-metal-gold rounded-full animate-pulse" />
          <div className="w-1 h-3 bg-metal-gold/70 rounded-full animate-pulse delay-75" />
          <div className="w-1 h-2 bg-metal-gold/50 rounded-full animate-pulse delay-150" />
        </div>
      )}
    </div>
  );
}