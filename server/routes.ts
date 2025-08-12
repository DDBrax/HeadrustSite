import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Band Members
  app.get("/api/band-members", async (req, res) => {
    try {
      const members = await storage.getBandMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch band members" });
    }
  });

  app.get("/api/band-members/:id", async (req, res) => {
    try {
      const member = await storage.getBandMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Band member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch band member" });
    }
  });

  // Albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await storage.getAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const album = await storage.getAlbum(req.params.id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album" });
    }
  });

  // Songs
  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get("/api/albums/:albumId/songs", async (req, res) => {
    try {
      const songs = await storage.getSongsByAlbum(req.params.albumId);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch songs for album" });
    }
  });

  app.get("/api/songs/:id", async (req, res) => {
    try {
      const song = await storage.getSong(req.params.id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  // Tour Dates
  app.get("/api/tour-dates", async (req, res) => {
    try {
      const tourDates = await storage.getTourDates();
      res.json(tourDates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour dates" });
    }
  });

  app.get("/api/tour-dates/:id", async (req, res) => {
    try {
      const tourDate = await storage.getTourDate(req.params.id);
      if (!tourDate) {
        return res.status(404).json({ message: "Tour date not found" });
      }
      res.json(tourDate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour date" });
    }
  });

  // News Articles
  app.get("/api/news", async (req, res) => {
    try {
      const articles = await storage.getNewsArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const article = await storage.getNewsArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });

  // Gallery Images
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const image = await storage.getGalleryImage(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery image" });
    }
  });

  // Gallery Videos
  app.get("/api/gallery-videos", async (req, res) => {
    try {
      const videos = await storage.getGalleryVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery videos" });
    }
  });

  app.get("/api/gallery-videos/:id", async (req, res) => {
    try {
      const video = await storage.getGalleryVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Gallery video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery video" });
    }
  });

  // Merchandise
  app.get("/api/merchandise", async (req, res) => {
    try {
      const merchandise = await storage.getMerchandise();
      res.json(merchandise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchandise" });
    }
  });

  app.get("/api/merchandise/:id", async (req, res) => {
    try {
      const item = await storage.getMerchandiseItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Merchandise item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchandise item" });
    }
  });

  // Contact Messages
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
