import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Album } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MusicPlayer from "./music-player";

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export default function MusicSection() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Album | null>(null);
  
  const { data: albums, isLoading, error } = useQuery<Album[]>({
    queryKey: ['/api/albums']
  });

  const handlePlayAlbum = (album: Album) => {
    setCurrentlyPlaying(album);
  };

  if (error) {
    return (
      <section id="music" className="section-padding bg-black">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">DISCOGRAPHY</h2>
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
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">DISCOGRAPHY</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="group relative overflow-hidden bg-dark-gray border border-metal-gold/20">
                <Skeleton className="w-full h-64" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            albums?.map((album) => (
              <Card 
                key={album.id} 
                className="group relative overflow-hidden bg-dark-gray border border-metal-gold/20 hover:border-metal-gold transition-all duration-300"
              >
                <img 
                  src={album.imageUrl} 
                  alt={`${album.title} album cover`} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-metal text-metal-gold mb-2">{album.title}</h3>
                  <p className="text-gray-400 mb-2">{album.year}</p>
                  <p className="text-sm text-gray-300 mb-4">{album.description}</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => album.youtubeUrl && handlePlayAlbum(album)}
                      className="w-full bg-metal-gold hover:bg-yellow-400 text-black font-bold py-2 px-4 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      disabled={!album.youtubeUrl}
                    >
                      <i className="fas fa-play mr-2"></i>
                      {album.youtubeUrl ? 'PLAY ALBUM' : 'COMING SOON'}
                    </button>
                    {album.youtubeUrl && (
                      <button 
                        onClick={() => album.youtubeUrl && window.open(album.youtubeUrl, '_blank')}
                        className="w-full bg-transparent border border-metal-gold text-metal-gold hover:bg-metal-gold hover:text-black font-bold py-2 px-4 transition-colors duration-300"
                      >
                        <i className="fab fa-youtube mr-2"></i>
                        OPEN IN YOUTUBE
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Embedded YouTube Player */}
        {currentlyPlaying && currentlyPlaying.youtubeUrl && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-medium-gray border border-metal-gold/20 rounded-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-metal text-metal-gold mb-4 text-center">NOW PLAYING</h3>
                <div className="text-center mb-4">
                  <h4 className="text-lg text-white font-semibold">{currentlyPlaying.title}</h4>
                  <p className="text-gray-400">{currentlyPlaying.year}</p>
                </div>
                <div className="aspect-video">
                  {(() => {
                    const videoId = getYouTubeVideoId(currentlyPlaying.youtubeUrl!);
                    return videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={`${currentlyPlaying.title} - YouTube Player`}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Unable to load video</p>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setCurrentlyPlaying(null)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    <i className="fas fa-stop mr-2"></i>
                    STOP PLAYING
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <MusicPlayer />
      </div>
    </section>
  );
}
