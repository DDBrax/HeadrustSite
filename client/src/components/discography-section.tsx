import { useQuery } from "@tanstack/react-query";
import type { Album } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import AlbumPreviewPlayer from "./album-preview-player";

export default function DiscographySection() {
  const { data: albums, isLoading, error } = useQuery<Album[]>({
    queryKey: ['/api/albums']
  });

  if (error) {
    return (
      <section id="discography" className="section-padding bg-black">
        <div className="container-padding">
          <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">DISCOGRAPHY</h2>
          <div className="text-center text-red-500">
            <p>Failed to load albums. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="discography" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">DISCOGRAPHY</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-dark-gray border border-metal-gold/20">
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-square rounded-t-lg" />
                  <div className="p-4 md:p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : albums && albums.length > 0 ? (
            albums.map((album) => (
              <Card 
                key={album.id} 
                className="bg-dark-gray border border-metal-gold/20 hover:border-metal-gold transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={album.imageUrl} 
                      alt={`${album.title} album cover`}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-metal-gold/90 text-black font-semibold"
                      >
                        {album.year}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-metal text-metal-gold mb-2 group-hover:text-white transition-colors">
                      {album.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {album.description}
                    </p>
                    
                    {album.songs && album.songs.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-metal-gold">Track Listing:</h4>
                        <div className="space-y-1">
                          {album.songs.map((song, index) => (
                            <div key={song.id} className="flex justify-between items-center text-sm text-gray-300">
                              <span className="flex items-center">
                                <span className="text-metal-gold/70 w-6 text-right mr-3">
                                  {index + 1}.
                                </span>
                                <span className="flex-1">{song.title}</span>
                              </span>
                              {song.duration && (
                                <span className="text-gray-400 ml-2">{song.duration}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Album Preview Player */}
                    <AlbumPreviewPlayer 
                      previewUrl={album.previewUrl}
                      albumTitle={album.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-compact-disc text-4xl text-metal-gold/50 mb-4"></i>
              <h3 className="text-xl text-metal-gold mb-2">No albums found</h3>
              <p className="text-gray-400">
                Discography coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}