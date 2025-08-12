import logoPath from "@assets/Logowhitel_1754619951588.png";
import heroVideoPath from "@assets/HeadrustHero_1754888982667.mp4";
import backgroundMusicPath from "@assets/Determined Murder Suicide_1754622979673.wav";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set volume to a reasonable level
      audio.volume = 0.3;
      
      // Try to play audio when component mounts
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay blocked, user will need to click to play
          console.log("Autoplay blocked, user interaction required");
        }
      };
      playAudio();
    }

    // Handle page visibility changes (tab switching, closing)
    const handleVisibilityChange = () => {
      if (audio) {
        if (document.hidden) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle page unload
    const handleBeforeUnload = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Audio */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={backgroundMusicPath} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Video background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full"
          style={{
            objectFit: 'contain',
            objectPosition: 'center center',
            filter: 'brightness(0.8)'
          }}
        >
          <source src={heroVideoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      {/* Music Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button 
          onClick={togglePlayPause}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-metal-gold hover:text-yellow-400 p-3 rounded-full border border-metal-gold/30 hover:border-metal-gold transition-all"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
        </button>
        <button 
          onClick={toggleMute}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-metal-gold hover:text-yellow-400 p-3 rounded-full border border-metal-gold/30 hover:border-metal-gold transition-all"
          title={isMuted ? "Unmute Music" : "Mute Music"}
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-lg`}></i>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => scrollToSection('band')}
          className="text-metal-gold hover:text-yellow-400 transition-colors"
        >
          <i className="fas fa-chevron-down text-2xl"></i>
        </button>
      </div>
    </section>
  );
}
