import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import ws from "ws";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;

export const db = databaseUrl
  ? drizzle({
      connection: databaseUrl,
      schema,
      ws,
    })
  : null;

export async function initializeDatabase(): Promise<boolean> {
  if (!db) {
    return false;
  }

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS custom_orders (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      shirt_quantity integer DEFAULT 0,
      shirt_sizes text[],
      vulture_shirt_quantity integer DEFAULT 0,
      vulture_shirt_sizes text[],
      serpent_shirt_quantity integer DEFAULT 0,
      serpent_shirt_sizes text[],
      hat_quantity integer DEFAULT 0,
      album_quantity integer DEFAULT 0,
      album_colors text[],
      shipping_address text,
      shipping_city text,
      shipping_state text,
      shipping_zip text,
      shipping_cost text NOT NULL DEFAULT '$0.00',
      subtotal text NOT NULL,
      total_amount text NOT NULL,
      status text DEFAULT 'pending',
      created_at timestamp DEFAULT now()
    )
  `);

  await db.execute(sql`
    ALTER TABLE custom_orders
      ADD COLUMN IF NOT EXISTS vulture_shirt_quantity integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS vulture_shirt_sizes text[],
      ADD COLUMN IF NOT EXISTS serpent_shirt_quantity integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS serpent_shirt_sizes text[]
  `);

  return true;
}
