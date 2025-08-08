import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("1:23");
  const [totalTime] = useState("3:42");
  const [progress] = useState(33); // percentage

  const currentTrack = {
    title: "Headrust - Live Session",
    album: "YouTube Music",
    duration: "3:42",
    youtubeUrl: "https://www.youtube.com/watch?v=KgyNf81PnAY&list=RDKgyNf81PnAY&start_radio=1"
  };

  const togglePlay = () => {
    if (!isPlaying) {
      // Open YouTube video in new tab when playing
      window.open(currentTrack.youtubeUrl, '_blank');
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
      </CardContent>
    </Card>
  );
}
