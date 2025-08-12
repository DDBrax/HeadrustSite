import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Album, Song } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Declare global YouTube API types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function MusicSection() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: albums, isLoading, error } = useQuery<Album[]>({
    queryKey: ['/api/albums']
  });

  const { data: songs } = useQuery<Song[]>({
    queryKey: ['/api/albums', selectedAlbum?.id, 'songs'],
    enabled: !!selectedAlbum?.id,
  });

  // Load YouTube iframe API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
      return;
    }

    // Load the API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Helper function to extract YouTube video ID
  function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]*)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  }

  // Initialize YouTube player when API is ready and song is selected
  useEffect(() => {
    if (!apiReady || !window.YT || !window.YT.Player || !playerRef.current) {
      return;
    }

    const playerUrl = getPlayerUrl();
    const videoId = getYouTubeVideoId(playerUrl);
    
    if (!videoId) {
      console.warn('Invalid YouTube URL or video ID:', playerUrl);
      return;
    }

    // Destroy existing player
    if (player) {
      try {
        player.destroy();
      } catch (e) {
        console.warn('Error destroying player:', e);
      }
      setPlayer(null);
    }

    // Reset state
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: 0, // Don't autoplay initially
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            setPlayer(event.target);
            try {
              const volume = event.target.getVolume();
              setVolume([volume || 50]);
            } catch (e) {
              console.warn('Error getting volume:', e);
              setVolume([50]);
            }
          },
          onStateChange: (event: any) => {
            try {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                const duration = event.target.getDuration();
                setDuration(duration || 0);
                
                // Start progress tracking
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                  try {
                    const currentTime = event.target.getCurrentTime();
                    setCurrentTime(currentTime || 0);
                  } catch (e) {
                    console.warn('Error getting current time:', e);
                  }
                }, 1000);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setCurrentTime(0);
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              } else if (event.data === window.YT.PlayerState.UNSTARTED) {
                setIsPlaying(false);
              }
            } catch (e) {
              console.warn('Error handling state change:', e);
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            setIsPlaying(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        },
      });
    } catch (e) {
      console.error('Error creating YouTube player:', e);
    }
  }, [apiReady, selectedSong, selectedAlbum]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedSong(null);
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
  };

  // Control functions
  const togglePlayPause = () => {
    if (!player) {
      console.warn('Player not ready');
      return;
    }
    
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (e) {
      console.error('Error toggling play/pause:', e);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (player) {
      try {
        player.setVolume(newVolume[0]);
      } catch (e) {
        console.warn('Error setting volume:', e);
      }
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (player) {
      try {
        player.seekTo(newTime[0], true);
        setCurrentTime(newTime[0]);
      } catch (e) {
        console.warn('Error seeking:', e);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine which URL to use for the player
  const getPlayerUrl = () => {
    if (selectedSong?.youtubeUrl) {
      return selectedSong.youtubeUrl;
    }
    return selectedAlbum?.youtubeUrl || '';
  };

  if (error || !albums) {
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
                    
                    {/* Song Selection - Simple Buttons */}
                    {songs && songs.length > 0 && (
                      <div className="mt-4">
                        <label className="text-sm text-metal-gold font-medium block mb-2">
                          <i className="fas fa-music mr-2"></i>
                          Select Track:
                        </label>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedSong(null)}
                            className={`w-full text-left p-2 rounded text-sm transition-colors ${
                              !selectedSong 
                                ? 'bg-metal-gold/20 border border-metal-gold text-metal-gold' 
                                : 'bg-dark-gray/50 border border-gray-600 text-gray-300 hover:bg-dark-gray'
                            }`}
                          >
                            <i className="fas fa-list mr-2"></i>
                            Play Full Album
                          </button>
                          
                          {songs.map((song) => (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song)}
                              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                                selectedSong?.id === song.id 
                                  ? 'bg-metal-gold/20 border border-metal-gold text-metal-gold' 
                                  : 'bg-dark-gray/50 border border-gray-600 text-gray-300 hover:bg-dark-gray'
                              }`}
                            >
                              <span className="flex justify-between items-center">
                                <span>{song.trackNumber}. {song.title}</span>
                                {song.duration && (
                                  <span className="text-xs text-gray-400">{song.duration}</span>
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        {selectedSong && (
                          <div className="mt-2 p-2 bg-metal-gold/10 rounded border border-metal-gold/30">
                            <p className="text-xs text-metal-gold">
                              <i className="fas fa-play mr-1"></i>
                              Now Playing: {selectedSong.title}
                              {selectedSong.duration && ` (${selectedSong.duration})`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hidden YouTube Player */}
                  <div ref={playerRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px' }}></div>
                  
                  {/* Player Status */}
                  {!getPlayerUrl() && (
                    <div className="bg-dark-gray rounded-lg border border-red-500/20 p-4 text-center">
                      <i className="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
                      <p className="text-red-400 text-sm">
                        No audio available for this {selectedSong ? 'track' : 'album'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Audio files will be available soon
                      </p>
                    </div>
                  )}

                  {/* API Loading Status */}
                  {getPlayerUrl() && !apiReady && (
                    <div className="bg-dark-gray rounded-lg border border-metal-gold/20 p-4 text-center">
                      <i className="fas fa-spinner fa-spin text-metal-gold text-2xl mb-2"></i>
                      <p className="text-metal-gold text-sm">Loading audio player...</p>
                    </div>
                  )}

                  {/* Custom Music Player */}
                  {getPlayerUrl() && apiReady && (
                    <div className="bg-dark-gray rounded-lg border border-metal-gold/20 p-4">
                      {/* Now Playing Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-16 h-16 bg-metal-gold/20 rounded-lg flex items-center justify-center">
                          <i className="fas fa-music text-metal-gold text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold truncate">
                            {selectedSong ? selectedSong.title : selectedAlbum?.title}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {selectedSong ? `Track ${selectedSong.trackNumber}` : 'Full Album'}
                            {selectedSong?.duration && ` • ${selectedSong.duration}`}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <Slider
                          value={[currentTime]}
                          max={duration}
                          step={1}
                          onValueChange={handleSeek}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Player Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={togglePlayPause}
                            size="lg"
                            className="bg-metal-gold hover:bg-metal-gold/80 text-black rounded-full w-12 h-12 p-0"
                          >
                            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
                          </Button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center space-x-2 w-32">
                          <i className="fas fa-volume-down text-gray-400 text-sm"></i>
                          <Slider
                            value={volume}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="flex-1"
                          />
                          <i className="fas fa-volume-up text-gray-400 text-sm"></i>
                        </div>
                      </div>
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