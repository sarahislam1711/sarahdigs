import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertContactInquirySchema, 
  insertCustomPlanInquirySchema,
  insertBlogPostSchema,
  insertCategorySchema,
  insertTagSchema,
  insertMediaSchema,
  insertSiteSettingSchema,
  insertProjectSchema,
  insertServiceSchema,
  insertStatSchema,
  insertProcessStepSchema,
  insertPageContentSchema,
  insertTestimonialSchema
} from "@shared/schema";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Health check endpoint for Railway
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Return admin user info
      res.json({
        id: 'admin',
        email: 'admin@sarahdigs.com',
        firstName: 'Admin',
        lastName: 'User',
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/admin/posts", isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/admin/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const categories = await storage.getPostCategories(req.params.id);
      const tags = await storage.getPostTags(req.params.id);
      res.json({ ...post, categories, tags });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/admin/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = 'admin'; // Simple auth uses admin user
      const postData = { ...req.body };
      
      // Handle publishedAt - convert empty string to null
      if (postData.publishedAt === "" || postData.publishedAt === undefined) {
        delete postData.publishedAt;
      } else if (postData.publishedAt) {
        postData.publishedAt = new Date(postData.publishedAt);
      }
      
      // Generate slug from title if not provided
      if (!postData.slug && postData.title) {
        postData.slug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 100);
      }
      
      const validatedData = insertBlogPostSchema.parse({
        ...postData,
        authorId: userId,
      });
      const post = await storage.createBlogPost(validatedData);
      if (req.body.categoryIds) {
        await storage.setPostCategories(post.id, req.body.categoryIds);
      }
      if (req.body.tagIds) {
        await storage.setPostTags(post.id, req.body.tagIds);
      }
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Clean up empty string values for timestamp fields
      const timestampFields = ['publishedAt', 'createdAt', 'updatedAt'];
      for (const field of timestampFields) {
        if (updateData[field] === "" || updateData[field] === null) {
          delete updateData[field];
        } else if (updateData[field]) {
          updateData[field] = new Date(updateData[field]);
        }
      }
      
      // Generate slug from title if slug is empty but title exists
      if ((!updateData.slug || updateData.slug === "") && updateData.title) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 100);
      }
      
      // Remove fields that shouldn't be updated directly
      delete updateData.categoryIds;
      delete updateData.tagIds;
      delete updateData.id;
      delete updateData.categories;
      delete updateData.tags;
      
      const post = await storage.updateBlogPost(req.params.id, updateData);
      if (req.body.categoryIds) {
        await storage.setPostCategories(req.params.id, req.body.categoryIds);
      }
      if (req.body.tagIds) {
        await storage.setPostTags(req.params.id, req.body.tagIds);
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  app.get("/api/admin/categories", isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/admin/tags", isAuthenticated, async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.post("/api/admin/tags", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.delete("/api/admin/tags/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTag(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });

  app.get("/api/admin/media", isAuthenticated, async (req, res) => {
    try {
      const mediaItems = await storage.getMedia();
      res.json(mediaItems);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/admin/media", isAuthenticated, async (req: any, res) => {
    try {
      const userId = 'admin'; // Simple auth uses admin user
      const validatedData = insertMediaSchema.parse({
        ...req.body,
        uploadedBy: userId,
      });
      const mediaItem = await storage.createMedia(validatedData);
      res.status(201).json(mediaItem);
    } catch (error) {
      console.error("Error creating media:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/media/:id", isAuthenticated, async (req, res) => {
    try {
      const mediaItem = await storage.updateMedia(req.params.id, req.body);
      res.json(mediaItem);
    } catch (error) {
      console.error("Error updating media:", error);
      res.status(400).json({ error: "Failed to update media" });
    }
  });

  app.delete("/api/admin/media/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteMedia(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    }
  }));

  app.post("/api/admin/upload", isAuthenticated, multerUpload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        url: fileUrl, 
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.get("/api/admin/settings", isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", isAuthenticated, async (req, res) => {
    try {
      const { settings } = req.body;
      const results = [];
      for (const setting of settings) {
        const validatedData = insertSiteSettingSchema.parse(setting);
        const result = await storage.upsertSiteSetting(validatedData);
        results.push(result);
      }
      res.json(results);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ error: "Failed to update settings" });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }
      const categories = await storage.getPostCategories(post.id);
      const tags = await storage.getPostTags(post.id);
      res.json({ ...post, categories, tags });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Public categories endpoint
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/admin/preview/:slug", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const categories = await storage.getPostCategories(post.id);
      const tags = await storage.getPostTags(post.id);
      res.json({ ...post, categories, tags });
    } catch (error) {
      console.error("Error fetching post for preview:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      const settingsMap = settings.reduce((acc, s) => {
        acc[s.settingKey] = s.settingValue;
        return acc;
      }, {} as Record<string, string | null>);
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.post("/api/custom-plan", async (req, res) => {
    try {
      const validatedData = insertCustomPlanInquirySchema.parse(req.body);
      const inquiry = await storage.createCustomPlanInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating custom plan inquiry:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projectsList = await storage.getVisibleProjects();
      res.json(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project || !project.isVisible) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      const projectsList = await storage.getProjects();
      res.json(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const servicesList = await storage.getVisibleServices();
      res.json(servicesList);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      if (!service || !service.isVisible) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.get("/api/admin/services", isAuthenticated, async (req, res) => {
    try {
      const servicesList = await storage.getServices();
      res.json(servicesList);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/admin/services/:id", isAuthenticated, async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/admin/services", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/services/:id", isAuthenticated, async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const statsList = await storage.getVisibleStats();
      res.json(statsList);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const statsList = await storage.getStats();
      res.json(statsList);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertStatSchema.parse(req.body);
      const stat = await storage.createStat(validatedData);
      res.status(201).json(stat);
    } catch (error) {
      console.error("Error creating stat:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/stats/:id", isAuthenticated, async (req, res) => {
    try {
      const stat = await storage.updateStat(req.params.id, req.body);
      res.json(stat);
    } catch (error) {
      console.error("Error updating stat:", error);
      res.status(400).json({ error: "Failed to update stat" });
    }
  });

  app.delete("/api/admin/stats/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteStat(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting stat:", error);
      res.status(500).json({ error: "Failed to delete stat" });
    }
  });

  app.get("/api/process-steps", async (req, res) => {
    try {
      const stepsList = await storage.getVisibleProcessSteps();
      res.json(stepsList);
    } catch (error) {
      console.error("Error fetching process steps:", error);
      res.status(500).json({ error: "Failed to fetch process steps" });
    }
  });

  app.get("/api/admin/process-steps", isAuthenticated, async (req, res) => {
    try {
      const stepsList = await storage.getProcessSteps();
      res.json(stepsList);
    } catch (error) {
      console.error("Error fetching process steps:", error);
      res.status(500).json({ error: "Failed to fetch process steps" });
    }
  });

  app.post("/api/admin/process-steps", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProcessStepSchema.parse(req.body);
      const step = await storage.createProcessStep(validatedData);
      res.status(201).json(step);
    } catch (error) {
      console.error("Error creating process step:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/process-steps/:id", isAuthenticated, async (req, res) => {
    try {
      const step = await storage.updateProcessStep(req.params.id, req.body);
      res.json(step);
    } catch (error) {
      console.error("Error updating process step:", error);
      res.status(400).json({ error: "Failed to update process step" });
    }
  });

  app.delete("/api/admin/process-steps/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProcessStep(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting process step:", error);
      res.status(500).json({ error: "Failed to delete process step" });
    }
  });

  app.get("/api/page-content/:pageSlug", async (req, res) => {
    try {
      const contentList = await storage.getPageContent(req.params.pageSlug);
      const contentMap = contentList.reduce((acc, c) => {
        acc[c.sectionKey] = c.content;
        return acc;
      }, {} as Record<string, unknown>);
      res.json(contentMap);
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  app.get("/api/admin/page-content/:pageSlug", isAuthenticated, async (req, res) => {
    try {
      const contentList = await storage.getPageContent(req.params.pageSlug);
      res.json(contentList);
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  const VALID_ICON_NAMES = ["Sparkles", "Brain", "LineChart", "Mail", "Zap", "BookOpen", "MessageSquare", "FileText"];
  const VALID_COLORS = ["bg-[#1B1B1B]", "bg-[#4D00FF]", "bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10"];

  app.put("/api/admin/page-content", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPageContentSchema.parse(req.body);
      
      if (validatedData.pageSlug === "consultations" && validatedData.sectionKey === "consultations") {
        const consultations = validatedData.content as Array<{ iconName: string; color: string }>;
        if (Array.isArray(consultations)) {
          for (const consultation of consultations) {
            if (consultation.iconName && !VALID_ICON_NAMES.includes(consultation.iconName)) {
              return res.status(400).json({ error: `Invalid icon name: ${consultation.iconName}` });
            }
            if (consultation.color && !VALID_COLORS.includes(consultation.color)) {
              return res.status(400).json({ error: `Invalid color: ${consultation.color}` });
            }
          }
        }
      }
      
      const content = await storage.upsertPageContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating page content:", error);
      res.status(400).json({ error: "Failed to update page content" });
    }
  });

  app.delete("/api/admin/page-content/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deletePageContent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page content:", error);
      res.status(500).json({ error: "Failed to delete page content" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonialsList = await storage.getVisibleTestimonials();
      res.json(testimonialsList);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/admin/testimonials", isAuthenticated, async (req, res) => {
    try {
      const testimonialsList = await storage.getTestimonials();
      res.json(testimonialsList);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  app.post("/api/admin/seed", isAuthenticated, async (req, res) => {
    try {
      const existingStats = await storage.getStats();
      if (existingStats.length === 0) {
        await storage.createStat({ value: "10+", label: "Years Experience", displayOrder: 0, isVisible: true });
        await storage.createStat({ value: "$50M+", label: "Revenue Generated", displayOrder: 1, isVisible: true });
        await storage.createStat({ value: "400%", label: "Avg. Traffic Growth", displayOrder: 2, isVisible: true });
        await storage.createStat({ value: "50+", label: "Happy Clients", displayOrder: 3, isVisible: true });
      }

      const existingSteps = await storage.getProcessSteps();
      if (existingSteps.length === 0) {
        await storage.createProcessStep({ stepNumber: "01", title: "Discovery", description: "We start by unearthing your current data, challenges, and goals.", displayOrder: 0, isVisible: true });
        await storage.createProcessStep({ stepNumber: "02", title: "Strategy", description: "I build a custom roadmap to bridge the gap between where you are and where you want to be.", displayOrder: 1, isVisible: true });
        await storage.createProcessStep({ stepNumber: "03", title: "Execution", description: "We implement the plan with precision, focusing on high-impact actions.", displayOrder: 2, isVisible: true });
        await storage.createProcessStep({ stepNumber: "04", title: "Optimization", description: "Continuous monitoring and refining to ensure sustainable growth.", displayOrder: 3, isVisible: true });
      }

      const existingProjects = await storage.getProjects();
      if (existingProjects.length === 0) {
        await storage.createProject({ name: "TechFlow", slug: "techflow", website: "techflow.io", industry: "B2B SaaS", projectType: "SEO Strategy", focus: "Recovering organic traffic after a failed site migration and scaling lead generation.", results: "+450% Organic Traffic in 12 Months", iconName: "TrendingUp", displayOrder: 0, isVisible: true });
        await storage.createProject({ name: "Lumina", slug: "lumina", website: "lumina-fashion.com", industry: "E-commerce", projectType: "Technical Audit", focus: "Fixing critical crawl budget issues and implementing programmatic SEO for product pages.", results: "$2.4M Additional Revenue Attributed to SEO", iconName: "BarChart3", displayOrder: 1, isVisible: true });
        await storage.createProject({ name: "FinSmart", slug: "finsmart", website: "finsmart.io", industry: "Fintech", projectType: "Content Engine", focus: "Building a content machine to capture high-intent bottom-of-funnel keywords.", results: "150+ Qualified Leads Per Month", iconName: "Users", displayOrder: 2, isVisible: true });
      }

      const existingServices = await storage.getServices();
      if (existingServices.length === 0) {
        await storage.createService({
          title: "SEO & Organic Growth", slug: "seo", shortDescription: "Comprehensive audit of your technical foundation, content gaps, and opportunity landscape.", iconName: "Search",
          heroTitle: "SEO & Organic Growth", heroSubtitle: "Stop renting your audience. Start owning it.", heroDescription: "We build data-backed organic growth engines that compound over time. No hacks, just deep technical foundations and content that converts.",
          ctaBookText: "Book a Free Consultation", ctaServiceText: "Start Digging",
          diagnosticTitle: "Is this for you?", diagnosticItems: ["You have traffic but it doesn't convert", "You've been hit by an algorithm update and can't recover", "You're publishing content but nobody is reading it", "You want to reduce reliance on paid ads", "Technical SEO feels like a black box"],
          promiseText: "We turn search into your most profitable, predictable revenue channel.",
          whatYouGetTitle: "What you'll get", whatYouGetDescription: "A comprehensive excavation of your current organic performance and a roadmap to market dominance.",
          whatYouGetItems: [{ title: "Technical Deep Dive", desc: "Full audit of crawlability, indexability, and site architecture." }, { title: "Keyword Excavation", desc: "Finding high-intent terms your competitors are missing." }, { title: "Content Strategy", desc: "A calendar of content designed to rank and convert." }, { title: "Authority Building", desc: "Ethical link acquisition strategies that actually work." }],
          whatToExpectItems: ["Clear roadmap for 6-12 months", "Fixes for critical technical debt", "Content that drives qualified leads", "Transparent monthly reporting", "Sustainable traffic growth", "Reduced CAC"],
          proofStat: "+450% Traffic", proofText: "See how we helped TechFlow scale their organic traffic from 5k to 50k monthly visitors in just 12 months.", proofProjectLink: "/projects/techflow", proofProjectTitle: "TechFlow SaaS",
          nextSteps: [{ title: "Book a Call", desc: "We discuss your current challenges and goals.", bullets: ["Review current performance metrics", "Discuss immediate growth goals", "Identify technical blockers"] }, { title: "The Audit", desc: "We dig deep into your data to find the opportunities.", bullets: ["Comprehensive technical health check", "Competitor gap analysis", "Keyword opportunity mapping"] }, { title: "The Roadmap", desc: "We present a clear plan of action to hit your targets.", bullets: ["Prioritized action plan", "Resource & timeline estimation", "Projected traffic & revenue impact"] }],
          finalCtaTitle: "Ready to grow organically?", finalCtaSubtitle: "Stop guessing and start growing with data-backed SEO.", finalCtaButtonText: "Book Your Strategy Call", finalCtaMicroProof: "Join 50+ founders scaling with organic search",
          displayOrder: 0, isVisible: true
        });
        await storage.createService({
          title: "Product-Led Marketing", slug: "product", shortDescription: "Data-backed content planning that targets high-intent users, not just traffic.", iconName: "Layout",
          heroTitle: "Product-Led Marketing", heroSubtitle: "Let your product do the talking.", heroDescription: "We build marketing engines that put your product at the center. No gimmicks, just strategic positioning that converts.",
          ctaBookText: "Book a Free Consultation", ctaServiceText: "Start Digging",
          diagnosticTitle: "Is this for you?", diagnosticItems: ["Your product is great but nobody knows about it", "Your marketing feels disconnected from your product", "You struggle to convert free users to paid", "Your competitors are outpacing you in visibility"],
          promiseText: "We make your product the hero of every marketing touchpoint.",
          whatYouGetTitle: "What you'll get", whatYouGetDescription: "A product-led marketing strategy that drives adoption and retention.",
          whatYouGetItems: [{ title: "Product Positioning", desc: "Clear messaging that resonates with your ideal customer." }, { title: "Growth Experiments", desc: "Data-driven tests to find your growth levers." }, { title: "User Journey Mapping", desc: "Understanding every touchpoint from discovery to advocacy." }, { title: "Activation Strategy", desc: "Converting signups into active, paying users." }],
          whatToExpectItems: ["Product-market fit validation", "Clear activation metrics", "Reduced churn rate", "Improved user onboarding", "Sustainable growth loops"],
          proofStat: "3x Activation", proofText: "See how we helped a SaaS startup triple their activation rate in 90 days.", proofProjectLink: "/projects/techflow", proofProjectTitle: "Product Case Study",
          nextSteps: [{ title: "Discovery", desc: "We analyze your product and current marketing efforts.", bullets: ["Product audit", "User feedback analysis", "Competitor positioning review"] }, { title: "Strategy", desc: "We create a tailored product-led marketing plan.", bullets: ["Messaging framework", "Growth experiment roadmap", "KPI definition"] }, { title: "Launch", desc: "We execute and iterate based on data.", bullets: ["A/B testing", "Weekly optimization", "Monthly reporting"] }],
          finalCtaTitle: "Ready to let your product shine?", finalCtaSubtitle: "Build marketing that puts your product first.", finalCtaButtonText: "Book Your Strategy Call", finalCtaMicroProof: "Join founders building product-led growth engines",
          displayOrder: 1, isVisible: true
        });
        await storage.createService({
          title: "Brand & Strategy", slug: "brand", shortDescription: "Turning messy analytics into clear, actionable insights for conversion optimization.", iconName: "BarChart3",
          heroTitle: "Brand & Strategy", heroSubtitle: "Build a brand people remember.", heroDescription: "We create strategic brand foundations that differentiate you in crowded markets.",
          ctaBookText: "Book a Free Consultation", ctaServiceText: "Start Digging",
          diagnosticTitle: "Is this for you?", diagnosticItems: ["Your brand feels unclear or inconsistent", "You struggle to stand out from competitors", "Your messaging doesn't resonate", "You're ready for a strategic refresh"],
          promiseText: "We build brands that connect, convert, and create lasting impressions.",
          whatYouGetTitle: "What you'll get", whatYouGetDescription: "A comprehensive brand strategy that guides all your marketing efforts.",
          whatYouGetItems: [{ title: "Brand Audit", desc: "Understanding where you are and where you need to go." }, { title: "Positioning Strategy", desc: "Finding your unique space in the market." }, { title: "Messaging Framework", desc: "Words that resonate with your audience." }, { title: "Visual Direction", desc: "Guidelines for consistent brand expression." }],
          whatToExpectItems: ["Clear brand positioning", "Consistent messaging", "Stronger market presence", "Improved customer perception", "Actionable brand guidelines"],
          proofStat: "50% Recall", proofText: "See how we helped a startup achieve 50% higher brand recall after repositioning.", proofProjectLink: "/projects/lumina", proofProjectTitle: "Brand Case Study",
          nextSteps: [{ title: "Discovery", desc: "We dive deep into your brand and market.", bullets: ["Stakeholder interviews", "Competitor analysis", "Audience research"] }, { title: "Strategy", desc: "We develop your brand positioning.", bullets: ["Brand architecture", "Value proposition", "Key messages"] }, { title: "Activation", desc: "We bring your brand to life.", bullets: ["Visual guidelines", "Content templates", "Launch plan"] }],
          finalCtaTitle: "Ready to build a memorable brand?", finalCtaSubtitle: "Create a brand that stands the test of time.", finalCtaButtonText: "Book Your Strategy Call", finalCtaMicroProof: "Join brands making lasting impressions",
          displayOrder: 2, isVisible: true
        });
        await storage.createService({
          title: "Founder-led Growth", slug: "founder", shortDescription: "Qualitative digging to understand the 'why' behind the 'what' of user behavior.", iconName: "Users",
          heroTitle: "Founder-led Growth", heroSubtitle: "Your story is your superpower.", heroDescription: "We help founders build personal brands that drive business growth.",
          ctaBookText: "Book a Free Consultation", ctaServiceText: "Start Digging",
          diagnosticTitle: "Is this for you?", diagnosticItems: ["You want to leverage your personal brand", "Your company needs a face and voice", "You struggle with content consistency", "You want to become a thought leader"],
          promiseText: "We turn founders into the most valuable marketing asset.",
          whatYouGetTitle: "What you'll get", whatYouGetDescription: "A founder-led marketing strategy that builds trust and drives growth.",
          whatYouGetItems: [{ title: "Personal Brand Strategy", desc: "Defining your unique founder narrative." }, { title: "Content System", desc: "Sustainable content creation without burnout." }, { title: "Platform Strategy", desc: "Choosing where and how to show up." }, { title: "Thought Leadership", desc: "Positioning you as an industry authority." }],
          whatToExpectItems: ["Clear personal positioning", "Content calendar", "Growing audience", "Inbound opportunities", "Industry recognition"],
          proofStat: "10x Reach", proofText: "See how we helped a founder grow their LinkedIn following from 1k to 10k in 6 months.", proofProjectLink: "/projects/finsmart", proofProjectTitle: "Founder Case Study",
          nextSteps: [{ title: "Discovery", desc: "We uncover your unique story and goals.", bullets: ["Founder interview", "Audience analysis", "Platform audit"] }, { title: "Strategy", desc: "We create your personal brand blueprint.", bullets: ["Narrative development", "Content pillars", "Platform strategy"] }, { title: "Execution", desc: "We help you show up consistently.", bullets: ["Content templates", "Weekly check-ins", "Performance tracking"] }],
          finalCtaTitle: "Ready to become the face of your brand?", finalCtaSubtitle: "Build a personal brand that drives business.", finalCtaButtonText: "Book Your Strategy Call", finalCtaMicroProof: "Join founders building their personal brands",
          displayOrder: 3, isVisible: true
        });
      }

      const existingHomeContent = await storage.getPageContent("home");
      if (existingHomeContent.length === 0) {
        await storage.upsertPageContent({ pageSlug: "home", sectionKey: "hero", content: { rotatingWords: ["goals", "users", "data", "market", "product"], description: "I help brands find the hidden gold in their analytics, content, and user journeys. No fluff, just deep excavation for growth.", ctaText: "Start Digging" } });
        await storage.upsertPageContent({ pageSlug: "home", sectionKey: "problems", content: { title: "Does this sound familiar?", items: ["You're drowning in data but starving for actionable insights.", "Your traffic is growing, but your revenue remains flat.", "You're creating content that no one seems to be finding or reading.", "Technical SEO feels like a black box you can't unlock.", "You're guessing at strategy instead of following a roadmap."] } });
        await storage.upsertPageContent({ pageSlug: "home", sectionKey: "solution", content: { title: "Stop guessing. Start growing.", description: "I turn chaotic data into a clear, actionable growth engine. No fluff, just results-driven strategy that bridges the gap between technical execution and brand storytelling.", benefits: ["Clear, prioritized roadmaps backed by data", "High-intent traffic that actually converts", "Technical foundation built for scale", "Content strategy that drives real revenue"] } });
        await storage.upsertPageContent({ pageSlug: "home", sectionKey: "whyMe", content: { sectionLabel: "WHY SARAHDIGS?", headline: "Most consultants skim the surface. I bring a shovel." } });
      }

      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}