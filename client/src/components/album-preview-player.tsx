import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AlbumPreviewPlayerProps {
  previewUrl?: string;
  albumTitle: string;
  className?: string;
}

export default function AlbumPreviewPlayer({ previewUrl, albumTitle, className = "" }: AlbumPreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // If no preview URL is available, don't render the component
  if (!previewUrl) {
    return null;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      console.error('Audio src:', audio.src);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [previewUrl, volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        await audio.play();
        // Update current time every 100ms
        intervalRef.current = setInterval(() => {
          setCurrentTime(audio.currentTime);
          // Stop after 30 seconds
          if (audio.currentTime >= 30) {
            audio.pause();
            setIsPlaying(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 100);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / Math.min(duration, 30)) * 100 : 0;

  return (
    <div className={`bg-medium-gray/50 border border-metal-gold/20 rounded-lg p-3 mt-4 ${className}`} data-testid="album-preview-player">
      <audio
        ref={audioRef}
        src={previewUrl}
        preload="metadata"
        crossOrigin="anonymous"
      />
      

      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="p-2 hover:bg-metal-gold/20"
          data-testid="play-pause-button"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-metal-gold" />
          ) : (
            <Play className="h-4 w-4 text-metal-gold" />
          )}
        </Button>

        <div className="flex-1">
          <div className="text-xs text-metal-gold mb-1">Preview: {albumTitle}</div>
          <div className="relative">
            <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-metal-gold transition-all duration-100 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>30s preview</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="p-1 hover:bg-metal-gold/20"
            data-testid="mute-button"
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3 text-gray-400" />
            ) : (
              <Volume2 className="h-3 w-3 text-metal-gold" />
            )}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            data-testid="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}