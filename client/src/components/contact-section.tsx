import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-8">CONTACT</h2>
        
        <div className="text-center mb-12">
          <Link href="/contact">
            <Button className="bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold text-lg px-8 py-3">
              <i className="fas fa-paper-plane mr-2"></i>
              Contact & Booking Form
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Professional booking inquiries, press requests, and general contact
          </p>
        </div>
        
        <div className="text-center">
          <h4 className="text-xl font-metal text-metal-gold mb-4">FOLLOW US</h4>
          <div className="flex justify-center space-x-6">
            <a href="https://www.facebook.com/HeadRust/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-3xl transition-colors duration-300">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/headrust_az/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-3xl transition-colors duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@headrusted" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-3xl transition-colors duration-300">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://open.spotify.com/artist/4wPz7884HhUrJtwVCwuAht" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-3xl transition-colors duration-300">
              <i className="fab fa-spotify"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}