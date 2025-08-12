import logoPath from "@assets/Logowhitel_1754619951588.png";
import heroVideoPath from "@assets/HeadrustHero_1754888982667.mp4";
import SimpleAudioPlayer from "./simple-audio-player";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
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

      {/* Audio Player - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <SimpleAudioPlayer 
          audioSrc="/audio/dms-intro.mp3" 
          loopStart={0}
          loopEnd={8}
        />
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
