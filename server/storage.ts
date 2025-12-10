import { db } from "./db";
import { eq, desc, like, or, asc, and } from "drizzle-orm";
import { 
  users,
  blogPosts,
  categories,
  tags,
  postCategories,
  postTags,
  media,
  siteSettings,
  contactInquiries, 
  customPlanInquiries,
  projects,
  services,
  stats,
  processSteps,
  pageContent,
  testimonials,
  type UpsertUser,
  type User,
  type InsertBlogPost,
  type BlogPost,
  type InsertCategory,
  type Category,
  type InsertTag,
  type Tag,
  type InsertMedia,
  type Media,
  type InsertSiteSetting,
  type SiteSetting,
  type InsertContactInquiry, 
  type ContactInquiry, 
  type InsertCustomPlanInquiry, 
  type CustomPlanInquiry,
  type InsertProject,
  type Project,
  type InsertService,
  type Service,
  type InsertStat,
  type Stat,
  type InsertProcessStep,
  type ProcessStep,
  type InsertPageContent,
  type PageContent,
  type InsertTestimonial,
  type Testimonial
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;

  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: string): Promise<void>;

  setPostCategories(postId: string, categoryIds: string[]): Promise<void>;
  setPostTags(postId: string, tagIds: string[]): Promise<void>;
  getPostCategories(postId: string): Promise<Category[]>;
  getPostTags(postId: string): Promise<Tag[]>;

  getMedia(): Promise<Media[]>;
  createMedia(mediaItem: InsertMedia): Promise<Media>;
  updateMedia(id: string, mediaItem: Partial<InsertMedia>): Promise<Media>;
  deleteMedia(id: string): Promise<void>;

  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  createCustomPlanInquiry(inquiry: InsertCustomPlanInquiry): Promise<CustomPlanInquiry>;

  getProjects(): Promise<Project[]>;
  getVisibleProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  getServices(): Promise<Service[]>;
  getVisibleServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  getStats(): Promise<Stat[]>;
  getVisibleStats(): Promise<Stat[]>;
  createStat(stat: InsertStat): Promise<Stat>;
  updateStat(id: string, stat: Partial<InsertStat>): Promise<Stat>;
  deleteStat(id: string): Promise<void>;

  getProcessSteps(): Promise<ProcessStep[]>;
  getVisibleProcessSteps(): Promise<ProcessStep[]>;
  createProcessStep(step: InsertProcessStep): Promise<ProcessStep>;
  updateProcessStep(id: string, step: Partial<InsertProcessStep>): Promise<ProcessStep>;
  deleteProcessStep(id: string): Promise<void>;

  getPageContent(pageSlug: string): Promise<PageContent[]>;
  getPageContentSection(pageSlug: string, sectionKey: string): Promise<PageContent | undefined>;
  upsertPageContent(content: InsertPageContent): Promise<PageContent>;
  deletePageContent(id: string): Promise<void>;

  getTestimonials(): Promise<Testimonial[]>;
  getVisibleTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  async createUser(data: { id: string; email: string; name: string; role: string }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const result = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values(post).returning();
    return result;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [result] = await db.update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(postCategories).where(eq(postCategories.postId, id));
    await db.delete(postTags).where(eq(postTags.postId, id));
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getCategories(): Promise<Category[]> {
    try {
      const result = await db.select().from(categories);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [result] = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return result;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(postCategories).where(eq(postCategories.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getTags(): Promise<Tag[]> {
    try {
      const result = await db.select().from(tags);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [result] = await db.insert(tags).values(tag).returning();
    return result;
  }

  async deleteTag(id: string): Promise<void> {
    await db.delete(postTags).where(eq(postTags.tagId, id));
    await db.delete(tags).where(eq(tags.id, id));
  }

  async setPostCategories(postId: string, categoryIds: string[]): Promise<void> {
    await db.delete(postCategories).where(eq(postCategories.postId, postId));
    if (categoryIds.length > 0) {
      await db.insert(postCategories).values(
        categoryIds.map(categoryId => ({ postId, categoryId }))
      );
    }
  }

  async setPostTags(postId: string, tagIds: string[]): Promise<void> {
    await db.delete(postTags).where(eq(postTags.postId, postId));
    if (tagIds.length > 0) {
      await db.insert(postTags).values(
        tagIds.map(tagId => ({ postId, tagId }))
      );
    }
  }

  async getPostCategories(postId: string): Promise<Category[]> {
    const result = await db.select({ category: categories })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, postId));
    return result.map(r => r.category);
  }

  async getPostTags(postId: string): Promise<Tag[]> {
    const result = await db.select({ tag: tags })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, postId));
    return result.map(r => r.tag);
  }

  async getMedia(): Promise<Media[]> {
    try {
      const result = await db.select().from(media).orderBy(desc(media.createdAt));
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error fetching media:", error);
      return [];
    }
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const [result] = await db.insert(media).values(mediaItem).returning();
    return result;
  }

  async updateMedia(id: string, mediaItem: Partial<InsertMedia>): Promise<Media> {
    const [result] = await db.update(media)
      .set(mediaItem)
      .where(eq(media.id, id))
      .returning();
    return result;
  }

  async deleteMedia(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key));
    return setting;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [result] = await db.insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.settingKey,
        set: { settingValue: setting.settingValue, settingType: setting.settingType },
      })
      .returning();
    return result;
  }

  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [result] = await db.insert(contactInquiries).values(inquiry).returning();
    return result;
  }

  async createCustomPlanInquiry(inquiry: InsertCustomPlanInquiry): Promise<CustomPlanInquiry> {
    const [result] = await db.insert(customPlanInquiries).values(inquiry).returning();
    return result;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(asc(projects.displayOrder));
  }

  async getVisibleProjects(): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.isVisible, true))
      .orderBy(asc(projects.displayOrder));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [result] = await db.insert(projects).values(project).returning();
    return result;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [result] = await db.update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.displayOrder));
  }

  async getVisibleServices(): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.isVisible, true))
      .orderBy(asc(services.displayOrder));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [result] = await db.insert(services).values(service).returning();
    return result;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [result] = await db.update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return result;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getStats(): Promise<Stat[]> {
    return await db.select().from(stats).orderBy(asc(stats.displayOrder));
  }

  async getVisibleStats(): Promise<Stat[]> {
    return await db.select().from(stats)
      .where(eq(stats.isVisible, true))
      .orderBy(asc(stats.displayOrder));
  }

  async createStat(stat: InsertStat): Promise<Stat> {
    const [result] = await db.insert(stats).values(stat).returning();
    return result;
  }

  async updateStat(id: string, stat: Partial<InsertStat>): Promise<Stat> {
    const [result] = await db.update(stats)
      .set(stat)
      .where(eq(stats.id, id))
      .returning();
    return result;
  }

  async deleteStat(id: string): Promise<void> {
    await db.delete(stats).where(eq(stats.id, id));
  }

  async getProcessSteps(): Promise<ProcessStep[]> {
    return await db.select().from(processSteps).orderBy(asc(processSteps.displayOrder));
  }

  async getVisibleProcessSteps(): Promise<ProcessStep[]> {
    return await db.select().from(processSteps)
      .where(eq(processSteps.isVisible, true))
      .orderBy(asc(processSteps.displayOrder));
  }

  async createProcessStep(step: InsertProcessStep): Promise<ProcessStep> {
    const [result] = await db.insert(processSteps).values(step).returning();
    return result;
  }

  async updateProcessStep(id: string, step: Partial<InsertProcessStep>): Promise<ProcessStep> {
    const [result] = await db.update(processSteps)
      .set(step)
      .where(eq(processSteps.id, id))
      .returning();
    return result;
  }

  async deleteProcessStep(id: string): Promise<void> {
    await db.delete(processSteps).where(eq(processSteps.id, id));
  }

  async getPageContent(pageSlug: string): Promise<PageContent[]> {
    try {
      const result = await db.select().from(pageContent).where(eq(pageContent.pageSlug, pageSlug));
      return result || [];
    } catch (error) {
      console.error("Error in getPageContent:", error);
      return [];
    }
  }

  async getPageContentSection(pageSlug: string, sectionKey: string): Promise<PageContent | undefined> {
    try {
      const result = await db.select().from(pageContent)
        .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.sectionKey, sectionKey)));
      if (!result || result.length === 0) {
        return undefined;
      }
      return result[0];
    } catch (error) {
      console.error("Error in getPageContentSection:", error);
      return undefined;
    }
  }

  async upsertPageContent(content: InsertPageContent): Promise<PageContent> {
    console.log("upsertPageContent called with:", JSON.stringify({ pageSlug: content.pageSlug, sectionKey: content.sectionKey }));
    
    let existing: PageContent | undefined;
    try {
      existing = await this.getPageContentSection(content.pageSlug, content.sectionKey);
      console.log("Existing record:", existing ? "found" : "not found");
    } catch (error) {
      console.error("Error finding existing:", error);
      existing = undefined;
    }
    
    try {
      if (existing) {
        console.log("Updating existing record with id:", existing.id);
        const [result] = await db.update(pageContent)
          .set({ content: content.content, updatedAt: new Date() })
          .where(eq(pageContent.id, existing.id))
          .returning();
        return result;
      } else {
        console.log("Inserting new record for sectionKey:", content.sectionKey);
        const [result] = await db.insert(pageContent).values(content).returning();
        console.log("Insert successful, id:", result.id);
        return result;
      }
    } catch (error) {
      console.error("Error in upsertPageContent save:", error);
      throw error;
    }
  }

  async deletePageContent(id: string): Promise<void> {
    await db.delete(pageContent).where(eq(pageContent.id, id));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
  }

  async getVisibleTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isVisible, true))
      .orderBy(asc(testimonials.displayOrder));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [result] = await db.insert(testimonials).values(testimonial).returning();
    return result;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [result] = await db.update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return result;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }
}

export const storage = new DatabaseStorage();