# SarahDigs Marketing Consultancy Website

## Overview

SarahDigs is a full-stack marketing consultancy website built with React, Express, and PostgreSQL. The application features a public-facing marketing site showcasing services (SEO, Brand Strategy, Product-Led Marketing, Founder-Led Growth), case studies, and consultation offerings. It includes an authenticated admin area for managing blog content, media, and site settings. The site emphasizes custom-tailored marketing solutions with a modern, high-contrast design aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and dev server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** (React Query) for server state management and data fetching
- **Tailwind CSS v4** with custom design tokens for styling
- **Framer Motion** for animations and transitions
- **shadcn/ui** component library (Radix UI primitives with custom styling)

**Design System:**
- Custom color palette with high-contrast theme (primary: #4D00FF purple, dark: #1B1B1B)
- Typography: Syne (display font) and Inter (body font) from Google Fonts
- Rounded, iOS-inspired UI with 1rem base radius
- Component-driven architecture with reusable UI primitives

**State Management:**
- React Query handles all server state (blog posts, categories, tags, media, user auth)
- Query client configured with aggressive caching (`staleTime: Infinity`)
- Custom query functions with 401 handling for authentication flows

**Routing Structure:**
- Public routes: Home, About, Contact, Projects, Journal, Services pages
- Admin routes: Dashboard, Posts, Categories, Tags, Media, Settings, Content Management
- Dynamic routes for project details, journal categories, service details, and consultation details

### Backend Architecture

**Technology Stack:**
- **Node.js** with **Express.js** for the API server
- **TypeScript** throughout the backend
- **Drizzle ORM** for database operations
- **Neon Serverless** PostgreSQL driver
- **Passport.js** with OpenID Connect strategy for authentication

**Authentication & Sessions:**
- **Replit Auth** integration via OpenID Connect (OIDC)
- Session-based authentication using `express-session`
- PostgreSQL session store (`connect-pg-simple`)
- Protected admin routes using `isAuthenticated` middleware
- User claims stored in session with token refresh capability

**API Design:**
- RESTful endpoints organized by resource type
- Consistent error handling with appropriate HTTP status codes
- Request/response logging middleware for API routes
- JSON request body parsing with raw body capture for webhooks

**Route Organization:**
- `/api/auth/*` - Authentication endpoints (login, logout, user info)
- `/api/admin/*` - Protected admin endpoints for content management
- `/api/public/*` - Public endpoints for blog posts, inquiries
- All routes registered in `server/routes.ts`

### Data Storage

**Database:**
- **PostgreSQL** via Neon serverless
- **Drizzle ORM** for type-safe database operations
- Schema-first approach with TypeScript types generated from Drizzle schema

**Schema Design:**

*Core Content Tables:*
- `blog_posts` - Articles with slug, content, excerpt, SEO metadata, status (draft/published), publication dates
- `categories` - Hierarchical categories with parent_id support
- `tags` - Simple tagging system
- `post_categories`, `post_tags` - Junction tables for many-to-many relationships

*Site Content Tables (CMS-managed):*
- `stats` - Homepage statistics (value, label) like "$5M+ Revenue Generated"
- `process_steps` - Work process steps (stepNumber, title, description)
- `services` - Service offerings (slug, title, shortDescription, iconName, fullDescription)
- `projects` - Portfolio/case study projects (name, slug, website, industry, projectType, focus, results, challenges, solutions, image)

*Media Management:*
- `media` - File storage metadata (filename, URL, file type, alt text, uploader tracking)

*User & Auth:*
- `users` - Admin users with email, profile info, role
- `sessions` - Session storage for Replit Auth (managed by connect-pg-simple)

*Lead Capture:*
- `contact_inquiries` - General contact form submissions
- `custom_plan_inquiries` - Detailed custom plan requests with budget, timeline, goals

*Configuration:*
- `site_settings` - Key-value store for site-wide settings

**Data Validation:**
- Zod schemas generated from Drizzle tables using `drizzle-zod`
- Input validation on both client and server
- Type safety enforced across the stack via shared schema

### External Dependencies

**Cloud Services:**
- **Neon Database** - Serverless PostgreSQL hosting
- **Google Cloud Storage** - Object storage for media files (configured but implementation in progress)
- **Replit** - Platform for auth, deployment, and development environment

**File Upload:**
- **Uppy** file uploader with AWS S3 integration for media library
- Supports dashboard UI with drag-and-drop
- Integration with Google Cloud Storage via compatibility layer

**UI Components:**
- **Radix UI** primitives for accessible, unstyled components
- **Lucide React** for icons
- **Embla Carousel** for image carousels and sliders
- **React Hook Form** with Hookform Resolvers for form management

**Development Tools:**
- **Replit-specific plugins** for Vite (error overlay, dev banner, cartographer)
- **ESBuild** for production server bundling
- **Drizzle Kit** for database migrations
- **TSX** for running TypeScript in development

**Notable Implementation Details:**
- Custom object ACL system partially implemented (`server/objectAcl.ts`) for fine-grained access control on stored objects
- Object storage abstraction layer (`server/objectStorage.ts`) supporting public/private access patterns
- Replit sidecar integration for Google Cloud credentials via external account authentication
- Storage service layer (`server/storage.ts`) providing repository pattern for all database operations