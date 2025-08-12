import { useQuery } from "@tanstack/react-query";
import type { GalleryImage, GalleryVideo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  
  const { data: galleryImages, isLoading: imagesLoading, error: imagesError } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery']
  });

  const { data: galleryVideos, isLoading: videosLoading, error: videosError } = useQuery<GalleryVideo[]>({
    queryKey: ['/api/gallery-videos']
  });

  if (imagesError && videosError) {
    return (
      <section id="gallery" className="section-padding bg-black">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">GALLERY</h2>
          <div className="text-center text-red-500">
            <p>Failed to load gallery content. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">GALLERY</h2>
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-gray-900 border-metal-gold/20">
            <TabsTrigger value="photos" className="data-[state=active]:bg-metal-gold data-[state=active]:text-black">PHOTOS</TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-metal-gold data-[state=active]:text-black">VIDEOS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagesLoading ? (
                // Loading skeleton for photos
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
          </TabsContent>
          
          <TabsContent value="videos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videosLoading ? (
                // Loading skeleton for videos
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="group relative overflow-hidden border border-metal-gold/20">
                    <Skeleton className="w-full h-64" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                galleryVideos?.map((video) => (
                  <div 
                    key={video.id} 
                    className="group relative overflow-hidden border border-metal-gold/20 hover:border-metal-gold transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <i className="fas fa-play-circle text-metal-gold text-5xl"></i>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-900">
                      <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
                      <p className="text-gray-300 text-sm">{video.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
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

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            {selectedVideo.videoUrl.startsWith('http') ? (
              // External video - open in new tab
              <div className="bg-gray-900 p-8 rounded-lg text-center" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-white text-2xl font-bold mb-4">{selectedVideo.title}</h3>
                <p className="text-gray-300 mb-6">{selectedVideo.description}</p>
                <a 
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-metal-gold text-black px-6 py-3 rounded font-bold hover:bg-yellow-400 transition-colors"
                >
                  Watch on Facebook
                </a>
              </div>
            ) : (
              // Local video file
              <video 
                src={selectedVideo.videoUrl} 
                controls
                autoPlay
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              >
                Your browser does not support the video tag.
              </video>
            )}
            <button 
              className="absolute top-4 right-4 text-white hover:text-metal-gold text-2xl"
              onClick={() => setSelectedVideo(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
