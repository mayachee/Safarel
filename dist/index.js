var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  contactSubmissions: () => contactSubmissions,
  insertAdminSchema: () => insertAdminSchema,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertOverviewSchema: () => insertOverviewSchema,
  insertServiceSchema: () => insertServiceSchema,
  insertTeamMemberSchema: () => insertTeamMemberSchema,
  insertValueSchema: () => insertValueSchema,
  loginSchema: () => loginSchema,
  overview: () => overview,
  services: () => services,
  sessions: () => sessions,
  teamMembers: () => teamMembers,
  values: () => values
});
import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var overview = pgTable("overview", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull()
});
var values = pgTable("values", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0)
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0)
});
var teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0)
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  serviceInterest: text("service_interest").notNull(),
  message: text("message").notNull()
});
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertOverviewSchema = createInsertSchema(overview).omit({ id: true });
var insertValueSchema = createInsertSchema(values).omit({ id: true });
var insertServiceSchema = createInsertSchema(services).omit({ id: true });
var insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({ id: true });
var insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true, updatedAt: true });
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
var DatabaseStorage = class {
  async initializeDefaultAdmin() {
    try {
      const existingAdmin = await this.getAdminByEmail("safarelsarl@gmail.com");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Mayache+1234", 10);
        await this.createAdmin({
          email: "safarelsarl@gmail.com",
          passwordHash: hashedPassword
        });
      }
    } catch (error) {
      console.log("Admin initialization will be done after database migration");
    }
  }
  constructor() {
    this.initializeDefaultAdmin();
  }
  // Overview methods
  async getOverview() {
    const [overviewData] = await db.select().from(overview).limit(1);
    return overviewData;
  }
  async updateOverview(overviewData) {
    const existing = await db.select().from(overview).where(eq(overview.id, 1)).limit(1);
    if (existing.length > 0) {
      const [updated] = await db.update(overview).set(overviewData).where(eq(overview.id, 1)).returning();
      return updated;
    } else {
      const [created] = await db.insert(overview).values({ id: 1, ...overviewData }).returning();
      return created;
    }
  }
  // Values methods
  async getValues() {
    return await db.select().from(values).orderBy(values.order);
  }
  async createValue(value) {
    const [created] = await db.insert(values).values(value).returning();
    return created;
  }
  async updateValue(id, value) {
    const [updated] = await db.update(values).set(value).where(eq(values.id, id)).returning();
    return updated;
  }
  async deleteValue(id) {
    const result = await db.delete(values).where(eq(values.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Services methods
  async getServices() {
    return await db.select().from(services).orderBy(services.order);
  }
  async createService(service) {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }
  async updateService(id, service) {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }
  async deleteService(id) {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Team Members methods
  async getTeamMembers() {
    return await db.select().from(teamMembers).orderBy(teamMembers.order);
  }
  async createTeamMember(member) {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }
  async updateTeamMember(id, member) {
    const [updated] = await db.update(teamMembers).set(member).where(eq(teamMembers.id, id)).returning();
    return updated;
  }
  async deleteTeamMember(id) {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Contact Submissions methods
  async createContactSubmission(submission) {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }
  async getContactSubmissions() {
    return await db.select().from(contactSubmissions);
  }
  // Admin Authentication methods
  async getAdminByEmail(email) {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }
  async createAdmin(admin) {
    const [created] = await db.insert(admins).values(admin).returning();
    return created;
  }
  async verifyAdminPassword(email, password) {
    const admin = await this.getAdminByEmail(email);
    if (!admin) return null;
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    return isValid ? admin : null;
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
var PgSession = connectPg(session);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "fallback-secret-for-dev",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      // Set to true in production with HTTPS
      maxAge: sessionTtl
    }
  });
}
var requireAuth = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};
async function setupAuth(app2) {
  app2.use(getSession());
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const admin = await storage.verifyAdminPassword(email, password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
      res.json({ message: "Login successful", admin: { id: admin.id, email: admin.email } });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });
  app2.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/check", (req, res) => {
    if (req.session && req.session.adminId) {
      res.json({
        authenticated: true,
        admin: {
          id: req.session.adminId,
          email: req.session.adminEmail
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });
  app2.get("/api/overview", async (req, res) => {
    try {
      const overview2 = await storage.getOverview();
      res.json(overview2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overview" });
    }
  });
  app2.put("/api/overview", requireAuth, async (req, res) => {
    try {
      const parsed = insertOverviewSchema.parse(req.body);
      const overview2 = await storage.updateOverview(parsed);
      res.json(overview2);
    } catch (error) {
      res.status(400).json({ message: "Invalid overview data" });
    }
  });
  app2.get("/api/values", async (req, res) => {
    try {
      const values2 = await storage.getValues();
      res.json(values2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch values" });
    }
  });
  app2.post("/api/values", requireAuth, async (req, res) => {
    try {
      const parsed = insertValueSchema.parse(req.body);
      const value = await storage.createValue(parsed);
      res.status(201).json(value);
    } catch (error) {
      res.status(400).json({ message: "Invalid value data" });
    }
  });
  app2.put("/api/values/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertValueSchema.partial().parse(req.body);
      const value = await storage.updateValue(id, parsed);
      if (!value) {
        return res.status(404).json({ message: "Value not found" });
      }
      res.json(value);
    } catch (error) {
      res.status(400).json({ message: "Invalid value data" });
    }
  });
  app2.delete("/api/values/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteValue(id);
      if (!deleted) {
        return res.status(404).json({ message: "Value not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete value" });
    }
  });
  app2.get("/api/services", async (req, res) => {
    try {
      const services2 = await storage.getServices();
      res.json(services2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  app2.post("/api/services", requireAuth, async (req, res) => {
    try {
      const parsed = insertServiceSchema.parse(req.body);
      const service = await storage.createService(parsed);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });
  app2.put("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, parsed);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });
  app2.delete("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });
  app2.get("/api/team", async (req, res) => {
    try {
      const teamMembers2 = await storage.getTeamMembers();
      res.json(teamMembers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  app2.post("/api/team", requireAuth, async (req, res) => {
    try {
      const parsed = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(parsed);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid team member data" });
    }
  });
  app2.put("/api/team/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, parsed);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid team member data" });
    }
  });
  app2.delete("/api/team/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTeamMember(id);
      if (!deleted) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(parsed);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });
  app2.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
async function seedDatabase() {
  try {
    await db.insert(overview).values({
      title: "Professional Transportation Solutions Across Europe",
      description: "LogiFlow provides comprehensive logistics services with cutting-edge technology, ensuring your cargo reaches its destination safely, quickly, and reliably across European markets."
    }).onConflictDoNothing();
    await db.insert(values).values([
      {
        title: "Safe",
        description: "Advanced safety protocols and real-time monitoring ensure your cargo is protected throughout the journey.",
        icon: "fas fa-shield-alt",
        order: 1
      },
      {
        title: "Confience",
        description: "Transparent communication and proven track record build lasting trust with our clients.",
        icon: "fas fa-handshake",
        order: 2
      },
      {
        title: "Fast",
        description: "Optimized routes and efficient processes deliver your goods ahead of schedule.",
        icon: "fas fa-bolt",
        order: 3
      },
      {
        title: "Reliability",
        description: "Consistent performance and backup systems ensure your shipments arrive as promised.",
        icon: "fas fa-award",
        order: 4
      }
    ]).onConflictDoNothing();
    await db.insert(services).values([
      {
        title: "Transportation of Trailers to and from Europe",
        description: "Comprehensive trailer transportation services connecting major European cities with optimized routes and professional drivers.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        icon: "fas fa-truck",
        order: 1
      },
      {
        title: "IT Management of Fleets, Drivers, and Routes",
        description: "Advanced fleet management system providing real-time monitoring, route optimization, and driver performance analytics.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        icon: "fas fa-cogs",
        order: 2
      },
      {
        title: "Tracking Services",
        description: "Real-time GPS tracking with detailed reporting, delivery notifications, and complete shipment visibility from pickup to delivery.",
        imageUrl: "https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        icon: "fas fa-map-marker-alt",
        order: 3
      }
    ]).onConflictDoNothing();
    await db.insert(teamMembers).values([
      {
        name: "Michael Rodriguez",
        role: "Co-founder",
        description: "15+ years in European logistics",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        order: 1
      },
      {
        name: "Sarah Thompson",
        role: "Co-founder",
        description: "Operations & Strategy Expert",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332c3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        order: 2
      },
      {
        name: "David Chen",
        role: "CTO",
        description: "Technology & Innovation Lead",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        order: 3
      },
      {
        name: "Elena Vasquez",
        role: "Contable",
        description: "Financial Operations Manager",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        order: 4
      }
    ]).onConflictDoNothing();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await seedDatabase();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
