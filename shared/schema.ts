import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bandMembers = pgTable("band_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const albums = pgTable("albums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  youtubeUrl: text("youtube_url"),
  previewUrl: text("preview_url"),
});

export const songs = pgTable("songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  albumId: varchar("album_id").notNull(),
  title: text("title").notNull(),
  duration: text("duration"),
  trackNumber: integer("track_number").notNull(),
  youtubeUrl: text("youtube_url"),
});

export const tourDates = pgTable("tour_dates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  city: text("city").notNull(),
  venue: text("venue").notNull(),
  ticketsAvailable: integer("tickets_available").notNull().default(1),
});

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  alt: text("alt").notNull(),
  category: text("category").notNull(),
});

export const galleryVideos = pgTable("gallery_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").notNull(),
  duration: text("duration"),
});

export const merchandise = pgTable("merchandise", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  inStock: integer("in_stock").notNull().default(1),
  purchaseUrl: text("purchase_url"),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type"), // 'general', 'booking', 'press', 'collaboration'
  status: text("status").default("new"), // 'new', 'read', 'responded', 'closed'
  metadata: text("metadata"), // JSON string for IP, user agent, etc.
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const customOrders = pgTable("custom_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  shirtQuantity: integer("shirt_quantity").default(0),
  shirtSizes: text("shirt_sizes").array(), // Array of sizes for multiple shirts
  hatQuantity: integer("hat_quantity").default(0),
  albumQuantity: integer("album_quantity").default(0),
  shippingCity: text("shipping_city"),
  shippingState: text("shipping_state"),
  shippingZip: text("shipping_zip"),
  shippingCost: text("shipping_cost").notNull().default("$0.00"),
  subtotal: text("subtotal").notNull(),
  totalAmount: text("total_amount").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertBandMemberSchema = createInsertSchema(bandMembers).omit({
  id: true,
});

export const insertAlbumSchema = createInsertSchema(albums).omit({
  id: true,
});

export const insertTourDateSchema = createInsertSchema(tourDates).omit({
  id: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
});

export const insertGalleryVideoSchema = createInsertSchema(galleryVideos).omit({
  id: true,
});

export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
});

export const insertMerchandiseSchema = createInsertSchema(merchandise).omit({
  id: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type Merchandise = typeof merchandise.$inferSelect;
export type InsertMerchandise = z.infer<typeof insertMerchandiseSchema>;

export type BandMember = typeof bandMembers.$inferSelect;
export type InsertBandMember = z.infer<typeof insertBandMemberSchema>;

export type Album = typeof albums.$inferSelect & {
  songs?: Song[];
};
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;

export type TourDate = typeof tourDates.$inferSelect;
export type InsertTourDate = z.infer<typeof insertTourDateSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type GalleryVideo = typeof galleryVideos.$inferSelect;
export type InsertGalleryVideo = z.infer<typeof insertGalleryVideoSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export const insertCustomOrderSchema = createInsertSchema(customOrders).omit({
  id: true,
  createdAt: true,
});

export type CustomOrder = typeof customOrders.$inferSelect;
export type InsertCustomOrder = z.infer<typeof insertCustomOrderSchema>;
