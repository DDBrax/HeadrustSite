import logoPath from "@assets/Logowhitel_1754619951588.png";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Concert stage lighting background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Concert stage with dramatic lighting" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-6 animate-pulse-gold">
          <img 
            src={logoPath} 
            alt="Headrust Logo" 
            className="max-w-lg mx-auto w-full h-auto filter brightness-0 invert" 
          />
        </div>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Forged in darkness, tempered by thunder. Experience the raw power of modern metal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('music')}
            className="btn-primary"
          >
            <i className="fas fa-play mr-2"></i>LISTEN NOW
          </button>
          <button 
            onClick={() => scrollToSection('tours')}
            className="btn-secondary"
          >
            <i className="fas fa-ticket-alt mr-2"></i>GET TICKETS
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
