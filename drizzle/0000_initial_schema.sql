
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sessions table for Replit Auth
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" VARCHAR PRIMARY KEY,
  "sess" JSONB NOT NULL,
  "expire" TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" VARCHAR UNIQUE,
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "profile_image_url" VARCHAR,
  "role" VARCHAR DEFAULT 'editor',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" VARCHAR UNIQUE NOT NULL,
  "content" TEXT,
  "excerpt" TEXT,
  "featured_image_url" TEXT,
  "author_id" VARCHAR REFERENCES "users"("id"),
  "status" VARCHAR DEFAULT 'draft',
  "published_at" TIMESTAMP,
  "meta_title" TEXT,
  "meta_description" TEXT,
  "meta_keywords" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" VARCHAR NOT NULL,
  "slug" VARCHAR UNIQUE NOT NULL,
  "description" TEXT,
  "parent_id" VARCHAR
);

-- Tags table
CREATE TABLE IF NOT EXISTS "tags" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" VARCHAR NOT NULL,
  "slug" VARCHAR UNIQUE NOT NULL
);

-- Post-Categories junction table
CREATE TABLE IF NOT EXISTS "post_categories" (
  "post_id" VARCHAR REFERENCES "blog_posts"("id") NOT NULL,
  "category_id" VARCHAR REFERENCES "categories"("id") NOT NULL
);

-- Post-Tags junction table
CREATE TABLE IF NOT EXISTS "post_tags" (
  "post_id" VARCHAR REFERENCES "blog_posts"("id") NOT NULL,
  "tag_id" VARCHAR REFERENCES "tags"("id") NOT NULL
);

-- Media library table
CREATE TABLE IF NOT EXISTS "media" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "filename" VARCHAR NOT NULL,
  "original_filename" VARCHAR,
  "file_type" VARCHAR,
  "file_size" INTEGER,
  "url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "alt_text" TEXT,
  "caption" TEXT,
  "uploaded_by" VARCHAR REFERENCES "users"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Site settings table
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "setting_key" VARCHAR UNIQUE NOT NULL,
  "setting_value" TEXT,
  "setting_type" VARCHAR DEFAULT 'text'
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS "contact_inquiries" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company_website" TEXT,
  "job_role" TEXT NOT NULL,
  "company_size" TEXT NOT NULL,
  "project_type" TEXT NOT NULL,
  "budget" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" VARCHAR DEFAULT 'new',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Custom plan inquiries table
CREATE TABLE IF NOT EXISTS "custom_plan_inquiries" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "business_description" TEXT NOT NULL,
  "main_challenge" TEXT NOT NULL,
  "selected_modules" TEXT[],
  "budget_range" TEXT NOT NULL,
  "status" VARCHAR DEFAULT 'new',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);
