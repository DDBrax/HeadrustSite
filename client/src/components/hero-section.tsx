import logoPath from "@assets/Logowhitel_1754619951588.png";
import heroVideoPath from "@assets/HeadrustHero_1754888982667.mp4";

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
      
      <div className="relative z-10 text-center px-4">
        <p className="text-sm md:text-xl lg:text-2xl text-gray-300 mb-4 md:mb-8 max-w-2xl mx-auto leading-relaxed">
          Formed in 2005 by lifelong friends, forging heavy rhythms and raw emotion. From underground to opening for Fear Factory.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('music')}
            className="bg-metal-gold text-black font-bold py-2 px-4 md:py-3 md:px-6 rounded text-sm md:text-base hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-play mr-1 md:mr-2"></i>LISTEN NOW
          </button>
          <button 
            onClick={() => scrollToSection('tours')}
            className="bg-transparent border-2 border-metal-gold text-metal-gold font-bold py-2 px-4 md:py-3 md:px-6 rounded text-sm md:text-base hover:bg-metal-gold hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-ticket-alt mr-1 md:mr-2"></i>GET TICKETS
          </button>
        </div>
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
