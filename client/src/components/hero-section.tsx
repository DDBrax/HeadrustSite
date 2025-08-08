import logoPath from "@assets/Logowhitel_1754619951588.png";
import heroBgPath from "@assets/hr-demo-02_1754620512866.png";

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
          src={heroBgPath} 
          alt="Headrust - Fire and castle background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-6 animate-pulse-gold">
          <img 
            src={logoPath} 
            alt="Headrust Logo" 
            className="max-w-lg mx-auto w-full h-auto" 
            style={{
              mixBlendMode: 'multiply',
              filter: 'invert(1) drop-shadow(0 0 20px #ff6600) drop-shadow(0 0 40px #ff3300) drop-shadow(0 0 60px #ff0000)',
              animation: 'fireGlow 3s ease-in-out infinite alternate'
            }}
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
