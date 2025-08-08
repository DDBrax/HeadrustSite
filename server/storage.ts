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
        name: "DENNIS BRACK",
        role: "VOCALS",
        bio: "The commanding voice of Tucson metal, leading Headrust's thunderous sound since 2005.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      },
      {
        name: "STEVE URQUIDES",
        role: "GUITAR",
        bio: "Delivering crushing riffs and driving the heavy metal energy that defines Headrust.",
        imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      },
      {
        name: "GEORGE SAMANIEGO",
        role: "DRUMS",
        bio: "The thunderous foundation providing relentless rhythm and power to Headrust's sound.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
      }
    ];

    members.forEach(member => {
      this.createBandMember(member);
    });

    // Initialize albums (placeholders - check SoundCloud, Bandcamp, Spotify for actual releases)
    const albumData: InsertAlbum[] = [
      {
        title: "HEADRUST COLLECTION",
        year: 2023,
        description: "Heavy metal and hard rock from Tucson's underground scene",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        title: "EARLY RECORDINGS",
        year: 2010,
        description: "Raw tracks from Headrust's developing sound",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        title: "UNDERGROUND YEARS",
        year: 2007,
        description: "The foundation years of Tucson metal",
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
