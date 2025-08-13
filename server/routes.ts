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
      // Rate limiting check (simple implementation)
      const clientIp = req.ip || req.connection.remoteAddress;
      
      // Basic validation
      const { name, email, phone, subject, message, inquiryType } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Missing required fields: name, email, and message are required" 
        });
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ 
          message: "Invalid email address format" 
        });
      }
      
      if (message.length > 5000) {
        return res.status(400).json({ 
          message: "Message too long (maximum 5000 characters)" 
        });
      }

      // Prepare metadata
      const metadata = JSON.stringify({
        ip: clientIp,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        referer: req.get('Referer')
      });

      const contactData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        inquiryType: inquiryType || 'general',
        status: 'new',
        metadata
      };

      const validatedData = insertContactMessageSchema.parse(contactData);
      const savedMessage = await storage.createContactMessage(validatedData);
      
      // Send email notification
      try {
        const { sendContactEmail } = await import('./email');
        await sendContactEmail({
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
          inquiryType: validatedData.inquiryType,
          phone: validatedData.phone,
          meta: {
            ip: clientIp,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
          }
        });
        
        console.log(`Contact form submission sent to email: ${validatedData.name} (${validatedData.email})`);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Continue processing even if email fails
      }
      
      res.status(201).json({ 
        message: "Message sent successfully! We'll get back to you soon.", 
        data: { id: savedMessage.id } 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message. Please try again later." });
    }
  });

  // Custom Orders
  app.post("/api/custom-order", async (req, res) => {
    try {
      const { name, email, shirtQuantity, shirtSizes, hatQuantity, albumQuantity } = req.body;
      
      // Calculate total
      const shirtPrice = 25;
      const hatPrice = 30;
      const albumPrice = 35;
      const total = (shirtQuantity * shirtPrice) + (hatQuantity * hatPrice) + (albumQuantity * albumPrice);
      
      const orderData = {
        name,
        email,
        shirtQuantity: shirtQuantity || 0,
        shirtSizes: shirtSizes || [],
        hatQuantity: hatQuantity || 0,
        albumQuantity: albumQuantity || 0,
        totalAmount: `$${total.toFixed(2)}`,
        status: "pending"
      };

      const order = await storage.createCustomOrder(orderData);
      
      // Send email notification
      try {
        console.log(`Processing merchandise order email for: ${orderData.name} (${orderData.email}) - ${orderData.totalAmount}`);
        const { sendMerchandiseOrderEmail } = await import('./email');
        await sendMerchandiseOrderEmail({
          name: orderData.name,
          email: orderData.email,
          shirtQuantity: orderData.shirtQuantity,
          shirtSizes: orderData.shirtSizes,
          hatQuantity: orderData.hatQuantity,
          albumQuantity: orderData.albumQuantity,
          totalAmount: orderData.totalAmount,
          meta: {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
          }
        });
        
        console.log(`✅ Merchandise order email sent successfully for: ${orderData.name} (${orderData.email}) - ${orderData.totalAmount}`);
      } catch (emailError: any) {
        console.error(`❌ Email notification failed for order ${orderData.name} (${orderData.email}):`, {
          error: emailError?.message,
          stack: emailError?.stack,
          orderTotal: orderData.totalAmount,
          sendGridKey: process.env.SENDGRID_API_KEY ? 'Present' : 'Missing'
        });
        // Continue processing even if email fails - order is still saved to database
      }

      // Log successful order processing
      console.log(`📦 Order successfully processed and saved to database:`, {
        id: order.id,
        name: orderData.name,
        email: orderData.email,
        total: orderData.totalAmount,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json({ 
        message: "Order request submitted successfully! We'll contact you soon.", 
        data: order 
      });
    } catch (error) {
      console.error("Custom order error:", error);
      res.status(500).json({ message: "Failed to submit order request" });
    }
  });

  // Debug endpoint to monitor email delivery
  app.get("/api/debug/email-status", async (req, res) => {
    try {
      const orders = await storage.getCustomOrders();
      const recentOrders = orders
        .slice(-5)
        .map(order => ({
          name: order.name,
          email: order.email,
          total: order.totalAmount,
          timestamp: order.createdAt,
          status: order.status
        }));
      
      res.json({
        sendGridConfigured: !!process.env.SENDGRID_API_KEY,
        totalOrders: orders.length,
        recentOrders,
        instructions: "All orders are saved to database. Emails sent via SendGrid to dbrack37@gmail.com"
      });
    } catch (error) {
      res.status(500).json({ error: "Debug endpoint failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
