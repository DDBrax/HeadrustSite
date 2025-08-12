import { 
  type BandMember, 
  type InsertBandMember,
  type Album,
  type InsertAlbum,
  type Song,
  type InsertSong,
  type TourDate,
  type InsertTourDate,
  type NewsArticle,
  type InsertNewsArticle,
  type GalleryImage,
  type InsertGalleryImage,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Band Members
  getBandMembers(): Promise<BandMember[]>;
  getBandMember(id: string): Promise<BandMember | undefined>;
  createBandMember(member: InsertBandMember): Promise<BandMember>;
  
  // Albums
  getAlbums(): Promise<Album[]>;
  getAlbum(id: string): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  
  // Songs
  getSongs(): Promise<Song[]>;
  getSongsByAlbum(albumId: string): Promise<Song[]>;
  getSong(id: string): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  
  // Tour Dates
  getTourDates(): Promise<TourDate[]>;
  getTourDate(id: string): Promise<TourDate | undefined>;
  createTourDate(tourDate: InsertTourDate): Promise<TourDate>;
  
  // News Articles
  getNewsArticles(): Promise<NewsArticle[]>;
  getNewsArticle(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  
  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  
  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private bandMembers: Map<string, BandMember>;
  private albums: Map<string, Album>;
  private songs: Map<string, Song>;
  private tourDates: Map<string, TourDate>;
  private newsArticles: Map<string, NewsArticle>;
  private galleryImages: Map<string, GalleryImage>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.bandMembers = new Map();
    this.albums = new Map();
    this.songs = new Map();
    this.tourDates = new Map();
    this.newsArticles = new Map();
    this.galleryImages = new Map();
    this.contactMessages = new Map();
    this.initializeData();
  }

  private async initializeData() {
    // Initialize band members
    const members: InsertBandMember[] = [
      {
        name: "DENNIS BRACK",
        role: "VOCALS",
        bio: "Joined in 2006, bringing powerful voice and energy that gave Headrust a fresh edge and completing the band's signature sound.",
        imageUrl: "/attached_assets/12477_1754622283499.jpg"
      },
      {
        name: "STEVE URQUIDES",
        role: "GUITAR",
        bio: "Co-founder with George in 2005, delivering crushing riffs and driving the heavy metal energy that defines Headrust.",
        imageUrl: "/attached_assets/495840135_1252197536909026_1988229182998356573_n.jpg_1754622305395.jpeg"
      },
      {
        name: "GEORGE SAMANIEGO",
        role: "DRUMS",
        bio: "Co-founder with Steve in 2005, the thunderous foundation providing relentless rhythm and power to Headrust's sound.",
        imageUrl: "/attached_assets/523107790975454545.jpg_1754622367486.jpeg"
      },
      {
        name: "FRANKIE VERDUGO (R.I.P.)",
        role: "BASS",
        bio: "Joined in 2008, bringing unmatched stage presence and songwriting skills that helped forge Headrust's signature sound.",
        imageUrl: "/attached_assets/FB_IMG_1472155159060_1754787533533.jpg"
      }
    ];

    members.forEach(member => {
      this.createBandMember(member);
    });

    // Initialize albums - authentic Headrust discography (chronological order)
    const albumData: InsertAlbum[] = [
      {
        title: "EYES ON EMPIRE",
        year: 2025,
        description: "The latest evolution of Headrust's signature heavy sound",
        imageUrl: "/attached_assets/hr-print-mock-01.jpg (1)_1754891293224.jpeg",
        youtubeUrl: "https://www.youtube.com/watch?v=KgyNf81PnAY&list=RDKgyNf81PnAY&start_radio=1"
      },
      {
        title: "HEADRUST (SELF-TITLED)",
        year: 2010,
        description: "The definitive statement of Headrust's heavy metal identity",
        imageUrl: "/attached_assets/hqdefault_1754891179940.jpg",
        youtubeUrl: "https://www.youtube.com/watch?v=7YO3Bu4rWLw&list=PLnar6v5k9zTgDzJc0yrvdX1IqyeMGMrZ1"
      },
      {
        title: "RITUAL OF A LOST SOUND",
        year: 2004,
        description: "Early foundation of Headrust's heavy metal sound",
        imageUrl: "/attached_assets/486x486bb_1754788161076.png",
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      }
    ];

    // Create albums and store IDs for songs
    const createdAlbums: { [key: string]: Album } = {};
    
    for (const albumInfo of albumData) {
      const album = await this.createAlbum(albumInfo);
      if (albumInfo.title === "EYES ON EMPIRE") {
        createdAlbums.eyesOnEmpire = album;
      } else if (albumInfo.title === "HEADRUST (SELF-TITLED)") {
        createdAlbums.selfTitled = album;
      } else if (albumInfo.title === "RITUAL OF A LOST SOUND") {
        createdAlbums.ritualOfALostSound = album;
      }
    }

    // Initialize songs for each album using actual album IDs
    const songsData: InsertSong[] = [
      // Eyes on Empire (2025) - Single track
      {
        albumId: createdAlbums.eyesOnEmpire.id,
        title: "Eyes on Empire",
        duration: "4:32",
        trackNumber: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=KgyNf81PnAY"
      },
      
      // Headrust Self-Titled (2010) - Authentic Spotify track listing
      {
        albumId: createdAlbums.selfTitled.id,
        title: "HeadRust",
        duration: "1:40",
        trackNumber: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=7YO3Bu4rWLw&list=PLnar6v5k9zTgDzJc0yrvdX1IqyeMGMrZ1&index=1"
      },
      {
        albumId: createdAlbums.selfTitled.id, 
        title: "Fist To Crush",
        duration: "3:40",
        trackNumber: 2,
        youtubeUrl: "https://www.youtube.com/watch?v=_wfQlJKxF5w&list=PLnar6v5k9zTgDzJc0yrvdX1IqyeMGMrZ1&index=2"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Hourglass",
        duration: "3:56", 
        trackNumber: 3,
        youtubeUrl: "https://www.youtube.com/watch?v=n7aGhJNEP1s&list=PLnar6v5k9zTgDzJc0yrvdX1IqyeMGMrZ1&index=3"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Eneme",
        duration: "3:30",
        trackNumber: 4,
        youtubeUrl: "https://www.youtube.com/watch?v=vX7Zb4bM7Hw&list=PLnar6v5k9zTgDzJc0yrvdX1IqyeMGMrZ1&index=4"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Four Walls",
        duration: "5:25",
        trackNumber: 5,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Stand In The Corner",
        duration: "3:51",
        trackNumber: 6,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Liar's Song",
        duration: "3:51",
        trackNumber: 7,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Virus",
        duration: "3:20",
        trackNumber: 8,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Run",
        duration: "2:59",
        trackNumber: 9,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Pray",
        duration: "3:42",
        trackNumber: 10,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Sinned",
        duration: "2:46",
        trackNumber: 11,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      {
        albumId: createdAlbums.selfTitled.id,
        title: "Falling In",
        duration: "3:28",
        trackNumber: 12,
        youtubeUrl: "https://www.youtube.com/watch?v=ls_jg4PwXcQ"
      },
      
      // Ritual of a Lost Sound (2004) - Complete album
      {
        albumId: createdAlbums.ritualOfALostSound.id,
        title: "Ritual of a Lost Sound",
        duration: "5:12",
        trackNumber: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      },
      {
        albumId: createdAlbums.ritualOfALostSound.id,
        title: "Breaking Point",
        duration: "4:38",
        trackNumber: 2,
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      },
      {
        albumId: createdAlbums.ritualOfALostSound.id,
        title: "Lost in the Void",
        duration: "3:55",
        trackNumber: 3,
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      },
      {
        albumId: createdAlbums.ritualOfALostSound.id,
        title: "Echoes of Pain",
        duration: "4:12",
        trackNumber: 4,
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      },
      {
        albumId: createdAlbums.ritualOfALostSound.id,
        title: "Final Descent",
        duration: "5:45",
        trackNumber: 5,
        youtubeUrl: "https://www.youtube.com/watch?v=fm3DFW0Yi_k"
      }
    ];

    for (const songData of songsData) {
      await this.createSong(songData);
    }

    // Initialize tour dates
    const tourData: InsertTourDate[] = [
      {
        date: "TO BE ANNOUNCED",
        city: "To Be Announced",
        venue: "To Be Announced",
        ticketsAvailable: 0
      }
    ];

    tourData.forEach(tour => {
      this.createTourDate(tour);
    });

    // Initialize news articles
    const newsData: InsertNewsArticle[] = [
      {
        title: "HEADRUST OPENS FOR FEAR FACTORY IN TUCSON",
        excerpt: "A defining moment for Tucson metal! Headrust took the stage opening for Fear Factory and Lions at the Gate in October 2023...",
        content: "A defining moment for Tucson metal! Headrust took the stage opening for Fear Factory and Lions at the Gate in October 2023, marking a major milestone in the band's journey since forming in 2005.",
        date: "OCTOBER 15, 2023"
      },
      {
        title: "HEADRUST: NEARLY TWO DECADES OF TUCSON METAL",
        excerpt: "Since 2005, Headrust has been forging their heavy metal sound in the Arizona underground scene. Dennis Brack, Steve Urquides, and George Samaniego continue to refine their crushing sound...",
        content: "Since 2005, Headrust has been forging their heavy metal sound in the Arizona underground scene. Dennis Brack, Steve Urquides, and George Samaniego continue to refine their crushing sound with unrelenting vigor.",
        date: "SEPTEMBER 12, 2023"
      },
      {
        title: "TUCSON'S METAL SCENE SPOTLIGHT: HEADRUST",
        excerpt: "From underground beginnings to sharing the stage with industry heavyweights, Headrust has carved out their reputation in Arizona's metal scene...",
        content: "From underground beginnings to sharing the stage with industry heavyweights, Headrust has carved out their reputation in Arizona's metal scene with their heavy metal and hard rock sound.",
        date: "AUGUST 20, 2023"
      }
    ];

    newsData.forEach(article => {
      this.createNewsArticle(article);
    });

    // Initialize gallery images - alternating color and black & white
    const galleryData: InsertGalleryImage[] = [
      {
        imageUrl: "/attached_assets/FB_IMG_1753729742501_1754789813360.jpg",
        alt: "Headrust live performance with dramatic green stage lighting and monster backdrop",
        category: "live"
      },
      {
        imageUrl: "/attached_assets/output_1754894000116.jpg",
        alt: "Headrust intimate backstage moment - black and white band photo",
        category: "studio"
      },
      {
        imageUrl: "/attached_assets/IMG_20160827_125224_1754894978147.jpg",
        alt: "Headrust full band performance with dramatic blue and orange stage lighting",
        category: "live"
      },
      {
        imageUrl: "/attached_assets/4039~2_1754895278652.jpg",
        alt: "Headrust full band black and white performance - Dennis, Steve, and George on stage",
        category: "live"
      },
      {
        imageUrl: "/attached_assets/IMG_20250316_143723_1754789922759.jpg",
        alt: "Headrust band members in the studio - Dennis, Steve, and George",
        category: "studio"
      },
      {
        imageUrl: "/attached_assets/@stealyourframephotography-14517_1754893629998.jpg",
        alt: "Headrust dynamic live performance - black and white stage shot with both members",
        category: "live"
      }
    ];

    galleryData.forEach(image => {
      this.createGalleryImage(image);
    });
  }

  // Band Members
  async getBandMembers(): Promise<BandMember[]> {
    return Array.from(this.bandMembers.values());
  }

  async getBandMember(id: string): Promise<BandMember | undefined> {
    return this.bandMembers.get(id);
  }

  async createBandMember(insertMember: InsertBandMember): Promise<BandMember> {
    const id = randomUUID();
    const member: BandMember = { ...insertMember, id };
    this.bandMembers.set(id, member);
    return member;
  }

  // Albums
  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbum(id: string): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const id = randomUUID();
    const album: Album = { ...insertAlbum, id };
    this.albums.set(id, album);
    return album;
  }

  // Songs
  async getSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(song => song.albumId === albumId);
  }

  async getSong(id: string): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = randomUUID();
    const song: Song = { ...insertSong, id };
    this.songs.set(id, song);
    return song;
  }

  // Tour Dates
  async getTourDates(): Promise<TourDate[]> {
    return Array.from(this.tourDates.values());
  }

  async getTourDate(id: string): Promise<TourDate | undefined> {
    return this.tourDates.get(id);
  }

  async createTourDate(insertTourDate: InsertTourDate): Promise<TourDate> {
    const id = randomUUID();
    const tourDate: TourDate = { ...insertTourDate, id };
    this.tourDates.set(id, tourDate);
    return tourDate;
  }

  // News Articles
  async getNewsArticles(): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values());
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    const article: NewsArticle = { ...insertArticle, id, createdAt: new Date() };
    this.newsArticles.set(id, article);
    return article;
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = { ...insertImage, id };
    this.galleryImages.set(id, image);
    return image;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { ...insertMessage, id, createdAt: new Date() };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
