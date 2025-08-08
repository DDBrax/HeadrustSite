import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BandSection from "@/components/band-section";
import MusicSection from "@/components/music-section";
import ToursSection from "@/components/tours-section";
import GallerySection from "@/components/gallery-section";
import NewsSection from "@/components/news-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <BandSection />
      <MusicSection />
      <ToursSection />
      <GallerySection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
