# Overview

This is a full-stack web application for "Headrust," a metal band's official website. Built with React frontend and Express.js backend, the application showcases band information, discography, tour dates, news, gallery images, and provides a contact form for fan interaction. The site features a dark, metal-themed design with gold accents and smooth scrolling navigation between sections.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)
- Successfully integrated authentic Spotify track data for all albums
- Self-titled album now features complete 12-track listing with correct song names and durations
- Ritual of a Lost Sound album expanded to full 5-track listing
- All track information verified against official Spotify releases for data authenticity

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming (dark theme with gold accents)
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod schema validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Structured tables for band members, albums, tour dates, news articles, gallery images, and contact messages
- **Development Storage**: In-memory storage implementation for development/testing

## API Design
- **Architecture**: RESTful API with Express.js routes
- **Endpoints**: CRUD operations for band data (members, albums, tours, news, gallery, contact)
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware

## Development Workflow
- **Hot Reload**: Vite development server with HMR for frontend
- **TypeScript**: Strict type checking across frontend, backend, and shared schemas
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Code Quality**: PostCSS with Autoprefixer for CSS processing

## UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Dark Theme**: Metal band aesthetic with black background and gold accents
- **Smooth Navigation**: Scroll-to-section navigation with fixed header
- **Loading States**: Skeleton loaders for improved perceived performance
- **Toast Notifications**: User feedback for form submissions and errors

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Drizzle Kit**: Database schema management and migration tools

## UI Framework
- **Shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for UI elements

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for Node.js

## Data Fetching & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation library

## Styling & Assets
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library for metal-themed icons
- **Unsplash**: Stock photography for hero images and placeholders

## Routing & Navigation
- **Wouter**: Lightweight React router
- **Smooth scrolling**: Native browser APIs for section navigation