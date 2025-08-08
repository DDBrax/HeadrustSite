import { 
  type BandMember, 
  type InsertBandMember,
  type Album,
  type InsertAlbum,
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
  private tourDates: Map<string, TourDate>;
  private newsArticles: Map<string, NewsArticle>;
  private galleryImages: Map<string, GalleryImage>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.bandMembers = new Map();
    this.albums = new Map();
    this.tourDates = new Map();
    this.newsArticles = new Map();
    this.galleryImages = new Map();
    this.contactMessages = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize band members
    const members: InsertBandMember[] = [
      {
        name: "VIKTOR STEEL",
        role: "LEAD VOCALS",
        bio: "The thunderous voice that commands the storm.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      },
      {
        name: "REX IRON",
        role: "LEAD GUITAR",
        bio: "Shredding riffs that pierce through souls.",
        imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      },
      {
        name: "MARCUS THUNDER",
        role: "BASS GUITAR",
        bio: "The foundation that shakes the earth.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      },
      {
        name: "DAEMON FURY",
        role: "DRUMS",
        bio: "The relentless heartbeat of chaos.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      }
    ];

    members.forEach(member => {
      this.createBandMember(member);
    });

    // Initialize albums
    const albumData: InsertAlbum[] = [
      {
        title: "IRON THRONE",
        year: 2023,
        description: "Our latest masterpiece of modern metal",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        title: "SHADOWS FALL",
        year: 2021,
        description: "Dark melodies meet crushing riffs",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        title: "BORN TO RUST",
        year: 2019,
        description: "The debut that started it all",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      }
    ];

    albumData.forEach(album => {
      this.createAlbum(album);
    });

    // Initialize tour dates
    const tourData: InsertTourDate[] = [
      {
        date: "DEC 15, 2023",
        city: "New York, NY",
        venue: "Madison Square Garden",
        ticketsAvailable: 1
      },
      {
        date: "DEC 18, 2023",
        city: "Los Angeles, CA",
        venue: "The Hollywood Bowl",
        ticketsAvailable: 1
      },
      {
        date: "DEC 22, 2023",
        city: "Chicago, IL",
        venue: "United Center",
        ticketsAvailable: 1
      },
      {
        date: "JAN 05, 2024",
        city: "London, UK",
        venue: "Wembley Stadium",
        ticketsAvailable: 1
      }
    ];

    tourData.forEach(tour => {
      this.createTourDate(tour);
    });

    // Initialize news articles
    const newsData: InsertNewsArticle[] = [
      {
        title: 'NEW ALBUM "IRON THRONE" HITS #1 ON CHARTS',
        excerpt: "Our latest masterpiece has claimed the top spot on metal charts worldwide. Thank you to all our fans for the incredible support...",
        content: "Our latest masterpiece has claimed the top spot on metal charts worldwide. Thank you to all our fans for the incredible support that made this possible.",
        date: "DECEMBER 1, 2023"
      },
      {
        title: "WORLD TOUR 2024 ANNOUNCED",
        excerpt: "Get ready for the most epic metal tour of 2024! We're bringing the thunder to 50+ cities across the globe. Tickets on sale now...",
        content: "Get ready for the most epic metal tour of 2024! We're bringing the thunder to 50+ cities across the globe. Tickets on sale now.",
        date: "NOVEMBER 28, 2023"
      },
      {
        title: "BEHIND THE SCENES: STUDIO SESSIONS",
        excerpt: "Take a look inside our recording process for 'Iron Throne.' Exclusive photos and stories from the studio where magic happens...",
        content: "Take a look inside our recording process for 'Iron Throne.' Exclusive photos and stories from the studio where magic happens.",
        date: "NOVEMBER 20, 2023"
      }
    ];

    newsData.forEach(article => {
      this.createNewsArticle(article);
    });

    // Initialize gallery images
    const galleryData: InsertGalleryImage[] = [
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Metal band performing on stage",
        category: "live"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Concert stage with dramatic lighting effects",
        category: "stage"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Metal band performing with enthusiastic crowd",
        category: "live"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Band members backstage portrait",
        category: "backstage"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Live concert with stage pyrotechnics",
        category: "live"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        alt: "Metal band in recording studio session",
        category: "studio"
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
