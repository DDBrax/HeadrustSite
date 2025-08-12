import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Album } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MusicSection() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  
  const { data: albums, isLoading, error } = useQuery<Album[]>({
    queryKey: ['/api/albums']
  });

  // Helper function to extract YouTube video ID and playlist ID from URL
  function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  function getYouTubePlaylistId(url: string): string | null {
    const match = url.match(/[&?]list=([^&]*)/);
    return match ? match[1] : null;
  }

  function buildYouTubeEmbedUrl(url: string): string {
    const videoId = getYouTubeVideoId(url);
    const playlistId = getYouTubePlaylistId(url);
    
    if (playlistId && videoId) {
      // If we have both video and playlist, embed the playlist starting with the video
      return `https://www.youtube.com/embed/${videoId}?list=${playlistId}&autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    } else if (playlistId) {
      // If we only have playlist, embed the playlist
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    } else if (videoId) {
      // If we only have video, embed the video
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    }
    return '';
  }

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
  };

  if (error) {
    return (
      <section id="music" className="section-padding bg-black">
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
    <section id="music" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">DISCOGRAPHY</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Albums List - Left Side */}
          <div className="space-y-3 md:space-y-4 order-2 lg:order-1">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-dark-gray border border-metal-gold/20">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              albums?.map((album) => (
                <Card 
                  key={album.id} 
                  className={`bg-dark-gray border transition-all duration-300 cursor-pointer hover:border-metal-gold ${
                    selectedAlbum?.id === album.id ? 'border-metal-gold bg-metal-gold/10' : 'border-metal-gold/20'
                  }`}
                  onClick={() => handleSelectAlbum(album)}
                >
                  <CardContent className="p-3 md:p-4 flex items-center space-x-3 md:space-x-4">
                    <img 
                      src={album.imageUrl} 
                      alt={`${album.title} album cover`} 
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-metal text-metal-gold truncate">{album.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{album.year}</p>
                      {album.youtubeUrl && (
                        <p className="text-xs text-green-400 mt-1">
                          <i className="fas fa-play mr-1"></i>Available
                        </p>
                      )}
                    </div>
                    <div className="text-metal-gold flex-shrink-0">
                      <i className="fas fa-chevron-right text-sm md:text-base"></i>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Player - Right Side */}
          <div className="lg:sticky lg:top-4 h-fit order-1 lg:order-2">
            {selectedAlbum ? (
              <Card className="bg-medium-gray border border-metal-gold/20">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg md:text-xl font-metal text-metal-gold">NOW PLAYING</h3>
                    <button 
                      onClick={() => setSelectedAlbum(null)}
                      className="text-red-600 hover:text-red-400 text-lg p-2"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <img 
                      src={selectedAlbum.imageUrl} 
                      alt={`${selectedAlbum.title} album cover`} 
                      className="w-full h-32 md:h-48 object-cover rounded mb-4"
                    />
                    <h4 className="text-base md:text-lg text-white font-semibold">{selectedAlbum.title}</h4>
                    <p className="text-gray-400 text-sm">{selectedAlbum.year}</p>
                    <p className="text-xs md:text-sm text-gray-300 mt-2 line-clamp-3">{selectedAlbum.description}</p>
                  </div>

                  {selectedAlbum.youtubeUrl && buildYouTubeEmbedUrl(selectedAlbum.youtubeUrl) && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={buildYouTubeEmbedUrl(selectedAlbum.youtubeUrl)}
                        title={`${selectedAlbum.title} - YouTube Player`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="w-full h-full"
                        style={{ pointerEvents: 'auto' }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-medium-gray border border-metal-gold/20">
                <CardContent className="p-6 md:p-8 text-center">
                  <i className="fas fa-music text-3xl md:text-4xl text-metal-gold/50 mb-4"></i>
                  <h3 className="text-base md:text-lg font-metal text-metal-gold mb-2">SELECT AN ALBUM</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    <span className="hidden md:inline">Click on an album from the left to start playing</span>
                    <span className="md:hidden">Select an album below to start playing</span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}