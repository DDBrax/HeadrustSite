import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { calculateShipping, getShippingCostWithFreeShipping } from "@shared/shipping";
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
      const visibleVideos = videos.filter(video =>
        video.title !== "Headrust Rialto Theater Promo" &&
        !video.videoUrl.includes("VID_20250616_202553")
      );
      res.json(visibleVideos);
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
          subject: validatedData.subject || undefined,
          message: validatedData.message,
          inquiryType: validatedData.inquiryType || undefined,
          phone: validatedData.phone || undefined,
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
      const { 
        name, 
        email, 
        shirtQuantity, 
        shirtSizes, 
        vultureShirtQuantity,
        vultureShirtSizes,
        serpentShirtQuantity,
        serpentShirtSizes,
        hatQuantity,
        hrLogoHatQuantity,
        headrustLogoHatQuantity,
        albumQuantity,
        albumColors,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
      } = req.body;

      const customerResult = z.object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(254),
        shippingAddress: z.string().trim().min(1).max(200),
        shippingCity: z.string().trim().min(1).max(100),
        shippingState: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/),
        shippingZip: z.string().trim().regex(/^\d{5}$/),
      }).safeParse({
        name,
        email,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
      });

      if (!customerResult.success) {
        return res.status(400).json({
          message: "Please provide valid customer and shipping information.",
          errors: customerResult.error.flatten(),
        });
      }

      const normalizeQuantity = (value: unknown) => {
        const quantity = Number(value ?? 0);
        return Number.isInteger(quantity) && quantity >= 0 && quantity <= 20
          ? quantity
          : null;
      };

      const normalizedShirtQuantity = normalizeQuantity(shirtQuantity);
      const normalizedVultureShirtQuantity = normalizeQuantity(vultureShirtQuantity);
      const normalizedSerpentShirtQuantity = normalizeQuantity(serpentShirtQuantity);
      const normalizedHrLogoHatQuantity = normalizeQuantity(hrLogoHatQuantity);
      const normalizedHeadrustLogoHatQuantity = normalizeQuantity(headrustLogoHatQuantity ?? hatQuantity);
      const normalizedAlbumQuantity = normalizeQuantity(albumQuantity);

      if (
        normalizedShirtQuantity === null ||
        normalizedVultureShirtQuantity === null ||
        normalizedSerpentShirtQuantity === null ||
        normalizedHrLogoHatQuantity === null ||
        normalizedHeadrustLogoHatQuantity === null ||
        normalizedAlbumQuantity === null
      ) {
        return res.status(400).json({ message: "Item quantities must be whole numbers from 0 to 20." });
      }

      if (
        normalizedShirtQuantity +
        normalizedVultureShirtQuantity +
        normalizedSerpentShirtQuantity +
        normalizedHrLogoHatQuantity +
        normalizedHeadrustLogoHatQuantity +
        normalizedAlbumQuantity === 0
      ) {
        return res.status(400).json({ message: "Please select at least one merchandise item." });
      }

      const validateSizes = (
        sizes: unknown,
        quantity: number,
        allowedSizes: readonly string[],
        itemName: string,
      ) => {
        const normalizedSizes = Array.isArray(sizes) ? sizes.map(String) : [];
        if (
          normalizedSizes.length !== quantity ||
          normalizedSizes.some((size) => !allowedSizes.includes(size))
        ) {
          throw new Error(`${itemName} requires one valid size for each shirt.`);
        }
        return normalizedSizes;
      };

      let normalizedShirtSizes: string[];
      let normalizedVultureShirtSizes: string[];
      let normalizedSerpentShirtSizes: string[];

      try {
        normalizedShirtSizes = validateSizes(
          shirtSizes,
          normalizedShirtQuantity,
          ["S", "M", "L", "XL", "XXL"],
          "Eyes on Empire T-Shirt",
        );
        normalizedVultureShirtSizes = validateSizes(
          vultureShirtSizes,
          normalizedVultureShirtQuantity,
          ["M", "L", "XL", "XXL"],
          "Vultures' Last Encore T-Shirt",
        );
        normalizedSerpentShirtSizes = validateSizes(
          serpentShirtSizes,
          normalizedSerpentShirtQuantity,
          ["M", "L", "XL", "XXL"],
          "Serpent Double Kick T-Shirt",
        );
      } catch (sizeError) {
        return res.status(400).json({
          message: sizeError instanceof Error ? sizeError.message : "Invalid shirt sizes.",
        });
      }

      const normalizedAlbumColors = Array.isArray(albumColors)
        ? albumColors.map(String)
        : [];
      if (
        normalizedAlbumColors.length !== normalizedAlbumQuantity ||
        normalizedAlbumColors.some((color) => !["black", "clear"].includes(color))
      ) {
        return res.status(400).json({
          message: "Each record requires a valid vinyl color.",
        });
      }
      
      // Calculate the item subtotal from server-owned prices.
      const shirtPrice = 25;
      const vultureShirtPrice = 30;
      const serpentShirtPrice = 30;
      const hrLogoHatPrice = 35;
      const headrustLogoHatPrice = 40;
      const albumPrice = 35;
      const totalHatQuantity = normalizedHrLogoHatQuantity + normalizedHeadrustLogoHatQuantity;
      const totalShirtQuantity =
        normalizedShirtQuantity +
        normalizedVultureShirtQuantity +
        normalizedSerpentShirtQuantity;
      const calculatedSubtotal =
        (normalizedShirtQuantity * shirtPrice) +
        (normalizedVultureShirtQuantity * vultureShirtPrice) +
        (normalizedSerpentShirtQuantity * serpentShirtPrice) +
        (normalizedHrLogoHatQuantity * hrLogoHatPrice) +
        (normalizedHeadrustLogoHatQuantity * headrustLogoHatPrice) +
        (normalizedAlbumQuantity * albumPrice);

      const customer = customerResult.data;
      const shippingCalculation = calculateShipping(
        totalShirtQuantity,
        totalHatQuantity,
        normalizedAlbumQuantity,
        customer.shippingState,
      );
      const finalShipping = getShippingCostWithFreeShipping(
        calculatedSubtotal,
        shippingCalculation,
        customer.shippingCity,
        customer.shippingState,
      );
      const total = calculatedSubtotal + finalShipping.shippingCost;
      
      const orderData = {
        name: customer.name,
        email: customer.email,
        shirtQuantity: normalizedShirtQuantity,
        shirtSizes: normalizedShirtSizes,
        vultureShirtQuantity: normalizedVultureShirtQuantity,
        vultureShirtSizes: normalizedVultureShirtSizes,
        serpentShirtQuantity: normalizedSerpentShirtQuantity,
        serpentShirtSizes: normalizedSerpentShirtSizes,
        hatQuantity: totalHatQuantity,
        albumQuantity: normalizedAlbumQuantity,
        albumColors: normalizedAlbumColors,
        shippingAddress: customer.shippingAddress,
        shippingCity: customer.shippingCity,
        shippingState: customer.shippingState,
        shippingZip: customer.shippingZip,
        shippingCost: finalShipping.formattedCost,
        subtotal: `$${calculatedSubtotal.toFixed(2)}`,
        totalAmount: `$${total.toFixed(2)}`,
        status: "pending"
      };

      const order = await storage.createCustomOrder(orderData);
      let emailSent = false;
      
      // Send email notification
      try {
        console.log(`Processing merchandise order email for: ${orderData.name} (${orderData.email}) - ${orderData.totalAmount}`);
        const { sendMerchandiseOrderEmail } = await import('./email');
        await sendMerchandiseOrderEmail({
          name: orderData.name,
          email: orderData.email,
          shirtQuantity: orderData.shirtQuantity,
          shirtSizes: orderData.shirtSizes,
          vultureShirtQuantity: orderData.vultureShirtQuantity,
          vultureShirtSizes: orderData.vultureShirtSizes,
          serpentShirtQuantity: orderData.serpentShirtQuantity,
          serpentShirtSizes: orderData.serpentShirtSizes,
          hatQuantity: orderData.hatQuantity,
          hrLogoHatQuantity: normalizedHrLogoHatQuantity,
          headrustLogoHatQuantity: normalizedHeadrustLogoHatQuantity,
          albumQuantity: orderData.albumQuantity,
          albumColors: orderData.albumColors,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          shippingState: orderData.shippingState,
          shippingZip: orderData.shippingZip,
          shippingCost: orderData.shippingCost,
          subtotal: orderData.subtotal,
          totalAmount: orderData.totalAmount,
          meta: {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
          }
        });
        
        emailSent = true;
        console.log(`✅ Merchandise order email sent successfully for: ${orderData.name} (${orderData.email}) - ${orderData.totalAmount}`);
      } catch (emailError: any) {
        console.error(`❌ Email notification failed for order ${orderData.name} (${orderData.email}):`, {
          error: emailError?.message,
          stack: emailError?.stack,
          orderTotal: orderData.totalAmount,
          sendGridKey: process.env.SENDGRID_API_KEY ? 'Present' : 'Missing'
        });
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
        message: emailSent
          ? "Order request submitted successfully! We'll contact you soon."
          : "Order request received. Please contact Headrust directly if you do not hear back soon.",
        emailSent,
        data: order 
      });
    } catch (error) {
      console.error("Custom order error:", error);
      res.status(500).json({ message: "Failed to submit order request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
