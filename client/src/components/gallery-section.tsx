import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const { data: galleryImages, isLoading, error } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery']
  });

  if (error) {
    return (
      <section id="gallery" className="section-padding bg-black">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">GALLERY</h2>
          <div className="text-center text-red-500">
            <p>Failed to load gallery images. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">GALLERY</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="group relative overflow-hidden border border-metal-gold/20">
                <Skeleton className="w-full h-64" />
              </div>
            ))
          ) : (
            galleryImages?.map((image) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden border border-metal-gold/20 hover:border-metal-gold transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.imageUrl} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <i className="fas fa-search-plus text-metal-gold text-3xl"></i>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.alt}
              className="w-full h-full object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white hover:text-metal-gold text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
