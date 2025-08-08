import logoPath from "@assets/Logowhitel_1754619951588.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const footerLinks = [
    { href: "home", label: "Home" },
    { href: "band", label: "Band" },
    { href: "music", label: "Music" },
    { href: "tours", label: "Tours" },
    { href: "gallery", label: "Gallery" },
    { href: "contact", label: "Contact" },
  ];

  return (
    <footer className="bg-dark-gray border-t border-metal-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <img 
            src={logoPath} 
            alt="Headrust Logo" 
            className="h-8 w-auto mb-4 md:mb-0" 
          />
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            {footerLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-400 hover:text-metal-gold transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="text-gray-400 text-sm">
            © 2005-2024 Headrust. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
