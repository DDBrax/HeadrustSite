import { Button } from "@/components/ui/button";
import ContactFormModal from "./contact-form-modal";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-8">CONTACT</h2>
        
        <div className="text-center mb-12">
          <ContactFormModal>
            <Button className="bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold text-lg px-8 py-3">
              <i className="fas fa-paper-plane mr-2"></i>
              Contact & Booking Form
            </Button>
          </ContactFormModal>
          <p className="text-gray-400 text-sm mt-3">
            Professional booking inquiries, press requests, and general contact
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-3xl rounded-lg border border-metal-gold/30 bg-dark-gray/70 p-6 md:p-8">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-metal-gold/10">
              <i className="fas fa-file-pdf text-3xl text-metal-gold" aria-hidden="true"></i>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-metal text-metal-gold">PROMOTER PACKET</h3>
              <p className="mt-2 text-gray-300">
                View Headrust's complete 2026 electronic press kit, current lineup, promoter assets,
                booking information, technical rider, stage plot, and input list.
              </p>
              <p className="mt-2 text-sm text-gray-500">9-page PDF • 1.5 MB</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
              <Button asChild className="bg-metal-gold font-bold text-black hover:bg-metal-gold/80">
                <a
                  href="/downloads/Headrust_Complete_Promoter_Pack_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-eye mr-2" aria-hidden="true"></i>
                  View Packet
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-metal-gold text-metal-gold hover:bg-metal-gold/10"
              >
                <a
                  href="/downloads/Headrust_Complete_Promoter_Pack_2026.pdf"
                  download="Headrust_Complete_Promoter_Pack_2026.pdf"
                >
                  <i className="fas fa-download mr-2" aria-hidden="true"></i>
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
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
            <a href="https://open.spotify.com/album/2geFTBd5GLimh2DamUQzoX" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-3xl transition-colors duration-300">
              <i className="fab fa-spotify"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
