import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "home", label: "HOME" },
    { href: "band", label: "BAND" },
    { href: "music", label: "MUSIC" },
    { href: "tours", label: "TOURS" },
    { href: "gallery", label: "GALLERY" },
    { href: "news", label: "NEWS" },
    { href: "contact", label: "CONTACT" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-metal-gold/20 transition-all duration-300 ${
        isScrolled ? 'bg-black' : 'bg-black/95'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-metal text-metal-gold">HEADRUST</div>
            
            {!isMobile && (
              <div className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-metal-gold transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              className="md:hidden text-white hover:text-metal-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-black border-b border-metal-gold/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left hover:text-metal-gold transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
