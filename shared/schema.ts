import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("editor"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  featuredImageUrl: text("featured_image_url"),
  isFeatured: boolean("is_featured").default(false),
  authorId: varchar("author_id").references(() => users.id),
  status: varchar("status").default("draft"),
  publishedAt: timestamp("published_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  parentId: varchar("parent_id"),
  // These columns exist in the production DB — kept in sync to prevent
  // drizzle-kit push from dropping them.
  iconName: varchar("icon_name"),
  bgColor: varchar("bg_color"),
  textColor: varchar("text_color"),
  displayOrder: integer("display_order").default(0),
});

// Tags table
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
});

// Post-Categories junction table
export const postCategories = pgTable("post_categories", {
  postId: varchar("post_id").references(() => blogPosts.id).notNull(),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
});

// Post-Tags junction table
export const postTags = pgTable("post_tags", {
  postId: varchar("post_id").references(() => blogPosts.id).notNull(),
  tagId: varchar("tag_id").references(() => tags.id).notNull(),
});

// Media library table
export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: varchar("filename").notNull(),
  originalFilename: varchar("original_filename"),
  fileType: varchar("file_type"),
  fileSize: integer("file_size"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  altText: text("alt_text"),
  caption: text("caption"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site settings table
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").unique().notNull(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type").default("text"),
});

// Contact inquiries (existing)
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  companyWebsite: text("company_website"),
  jobRole: text("job_role").notNull(),
  companySize: text("company_size").notNull(),
  projectType: text("project_type").notNull(),
  budget: text("budget").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Custom plan inquiries (existing)
  export const customPlanInquiries = pgTable("custom_plan_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  businessDescription: text("business_description").notNull(),
  mainChallenge: text("main_challenge").notNull(),
  selectedModules: text("selected_modules").array(),
  budgetRange: text("budget_range").notNull(),
  status: varchar("status").default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email subscribers / lead-magnet captures ("steal my brain" gated content,
// newsletter). Email is unique so re-submitting updates rather than duplicates.
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  // where they signed up: "consultations", "home", "journal", etc.
  source: varchar("source"),
  // what they wanted to unlock: "article", "sample-plan", "newsletter", etc.
  assetRequested: varchar("asset_requested"),
  status: varchar("status").default("new"),
  // ── nurture sequence tracking ──
  // which sequence email they've received (0 = none, 1 = welcome, 2..4 = nurture).
  sequenceStep: integer("sequence_step").default(0).notNull(),
  // when the last sequence email went out (drives the day-based cadence).
  lastEmailedAt: timestamp("last_emailed_at"),
  // set when they unsubscribe — stops all further sends.
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table for portfolio (auction-catalog style)
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  website: varchar("website"),
  industry: varchar("industry"),
  projectType: varchar("project_type"),
  focus: text("focus"),
  results: text("results"),
  iconName: varchar("icon_name"),
  imageUrl: text("image_url"),
  logoUrl: text("logo_url"),
  displayOrder: integer("display_order").default(0),
  isVisible: boolean("is_visible").default(true),

  // Case-study fields (v1 — minimal, aligned across editor/db/public page)
  year: integer("year"),                          // e.g. 2025
  serviceTags: text("service_tags").array(),       // catchy per-project service labels
  problem: text("problem"),                        // the one-liner / what they came with
  approach: text("approach"),                      // (legacy narrative — kept, optional)
  metricValue: varchar("metric_value"),            // headline metric for index card, e.g. "+312%"
  metricLabel: varchar("metric_label"),            // e.g. "organic traffic"
  status: varchar("status").default("live"),       // "live" | "coming_soon"

  // Standalone case-study (rich, visual)
  role: varchar("role"),                           // meta: e.g. "design & build"
  timeline: varchar("timeline"),                   // meta: e.g. "6 weeks"
  metaStatus: varchar("meta_status"),              // meta pill: free text, e.g. "live", "in progress", "concept"
  processSteps: jsonb("process_steps"),            // [{title, description}]
  beforeStates: text("before_states").array(),     // short "before" phrases
  afterStates: text("after_states").array(),       // short "after" phrases
  metrics: jsonb("metrics"),                        // [{value, label}] multiple results
  gallery: jsonb("gallery"),                        // [{imageUrl, caption}] carousel slides
  problemStory: text("problem_story"),              // long-form "the problem" narrative on the case study

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  shortDescription: text("short_description"),
  iconName: varchar("icon_name"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroDescription: text("hero_description"),
  ctaBookText: varchar("cta_book_text"),
  ctaServiceText: varchar("cta_service_text"),
  diagnosticTitle: text("diagnostic_title"),
  diagnosticItems: text("diagnostic_items").array(),
  promiseText: text("promise_text"),
  whatYouGetTitle: text("what_you_get_title"),
  whatYouGetDescription: text("what_you_get_description"),
  whatYouGetItems: jsonb("what_you_get_items"),
  whatToExpectItems: text("what_to_expect_items").array(),
  proofStat: varchar("proof_stat"),
  proofText: text("proof_text"),
  proofProjectLink: varchar("proof_project_link"),
  proofProjectTitle: varchar("proof_project_title"),
  whatYouGetImages: jsonb("what_you_get_images"),
  proofBeforeImage: text("proof_before_image"),
  proofAfterImage: text("proof_after_image"),
  nextSteps: jsonb("next_steps"),
  finalCtaTitle: text("final_cta_title"),
  finalCtaSubtitle: text("final_cta_subtitle"),
  finalCtaButtonText: varchar("final_cta_button_text"),
  finalCtaMicroProof: text("final_cta_micro_proof"),
  // Exists in production DB — kept in sync to prevent drizzle-kit push from dropping it.
  heroBackgroundImage: text("hero_background_image"),
  displayOrder: integer("display_order").default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stats/metrics table for proof section
export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  value: varchar("value").notNull(),
  label: varchar("label").notNull(),
  displayOrder: integer("display_order").default(0),
  isVisible: boolean("is_visible").default(true),
});

// Process steps table
export const processSteps = pgTable("process_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stepNumber: varchar("step_number").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isVisible: boolean("is_visible").default(true),
});

// Page content blocks for flexible content
export const pageContent = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageSlug: varchar("page_slug").notNull(),
  sectionKey: varchar("section_key").notNull(),
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: varchar("client_name").notNull(),
  clientRole: varchar("client_role"),
  clientCompany: varchar("client_company"),
  clientImageUrl: text("client_image_url"),
  quote: text("quote").notNull(),
  displayOrder: integer("display_order").default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertCustomPlanInquirySchema = createInsertSchema(customPlanInquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers, {
  email: (schema) => schema.email("please enter a valid email"),
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStatSchema = createInsertSchema(stats).omit({
  id: true,
});

export const insertProcessStepSchema = createInsertSchema(processSteps).omit({
  id: true,
});

export const insertPageContentSchema = createInsertSchema(pageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertCustomPlanInquiry = z.infer<typeof insertCustomPlanInquirySchema>;
export type CustomPlanInquiry = typeof customPlanInquiries.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertStat = z.infer<typeof insertStatSchema>;
export type Stat = typeof stats.$inferSelect;

export type InsertProcessStep = z.infer<typeof insertProcessStepSchema>;
export type ProcessStep = typeof processSteps.$inferSelect;

export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContent.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;