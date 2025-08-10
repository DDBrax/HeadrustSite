import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Album } from "@shared/schema";

interface MusicPlayerProps {
  currentAlbum?: Album | null;
  onStop?: () => void;
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export default function MusicPlayer({ currentAlbum, onStop }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime] = useState("3:42");
  const [progress] = useState(0); // percentage
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use currentAlbum if provided, otherwise show default
  const currentTrack = currentAlbum ? {
    title: currentAlbum.title,
    album: `${currentAlbum.year}`,
    duration: "3:42",
    youtubeId: currentAlbum.youtubeUrl ? getYouTubeVideoId(currentAlbum.youtubeUrl) : null
  } : {
    title: "Headrust - DMS",
    album: "YouTube Music", 
    duration: "3:42",
    youtubeId: "KgyNf81PnAY"
  };

  const togglePlay = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (!isPlaying) {
        // Send play command to YouTube iframe
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        // Send pause command to YouTube iframe
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
    setIsPlaying(!isPlaying);
  };

  const previousTrack = () => {
    // In a real implementation, this would switch to the previous track
    console.log('Previous track');
  };

  const nextTrack = () => {
    // In a real implementation, this would switch to the next track
    console.log('Next track');
  };

  return (
    <Card className="bg-medium-gray border border-metal-gold/20 rounded-lg max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-xl font-metal text-metal-gold mb-4 text-center">NOW PLAYING</h3>
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={previousTrack}
            className="text-metal-gold hover:text-yellow-400 text-2xl transition-colors"
          >
            <i className="fas fa-step-backward"></i>
          </button>
          <button 
            onClick={togglePlay}
            className="text-metal-gold hover:text-yellow-400 text-3xl transition-colors"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button 
            onClick={nextTrack}
            className="text-metal-gold hover:text-yellow-400 text-2xl transition-colors"
          >
            <i className="fas fa-step-forward"></i>
          </button>
          {currentAlbum && onStop && (
            <button 
              onClick={onStop}
              className="text-red-600 hover:text-red-400 text-2xl transition-colors ml-2"
            >
              <i className="fas fa-stop"></i>
            </button>
          )}
          <div className="flex-1">
            <div className="text-white font-semibold">{currentTrack.title}</div>
            <div className="text-gray-400 text-sm">{currentTrack.album}</div>
          </div>
          <div className="text-gray-400 text-sm">{currentTrack.duration}</div>
        </div>
        <div className="bg-black rounded-full h-2 mb-2">
          <div 
            className="bg-metal-gold h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
        
        {/* Embedded YouTube Player - only show when album is selected */}
        {currentAlbum && currentTrack.youtubeId && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&controls=1&autoplay=1&rel=0`}
              title={`${currentTrack.title} - YouTube Player`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
