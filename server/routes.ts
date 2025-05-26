import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { 
  insertOverviewSchema,
  insertValueSchema,
  insertServiceSchema,
  insertTeamMemberSchema,
  insertContactSubmissionSchema,
  loginSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Authentication routes
  app.post("/api/login", async (req, res) => {
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

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
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

  // Overview routes (public)
  app.get("/api/overview", async (req, res) => {
    try {
      const overview = await storage.getOverview();
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overview" });
    }
  });

  app.put("/api/overview", requireAuth, async (req, res) => {
    try {
      const parsed = insertOverviewSchema.parse(req.body);
      const overview = await storage.updateOverview(parsed);
      res.json(overview);
    } catch (error) {
      res.status(400).json({ message: "Invalid overview data" });
    }
  });

  // Values routes (public read, protected write)
  app.get("/api/values", async (req, res) => {
    try {
      const values = await storage.getValues();
      res.json(values);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch values" });
    }
  });

  app.post("/api/values", requireAuth, async (req, res) => {
    try {
      const parsed = insertValueSchema.parse(req.body);
      const value = await storage.createValue(parsed);
      res.status(201).json(value);
    } catch (error) {
      res.status(400).json({ message: "Invalid value data" });
    }
  });

  app.put("/api/values/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/values/:id", requireAuth, async (req, res) => {
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

  // Services routes (public read, protected write)
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAuth, async (req, res) => {
    try {
      const parsed = insertServiceSchema.parse(req.body);
      const service = await storage.createService(parsed);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.put("/api/services/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/services/:id", requireAuth, async (req, res) => {
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

  // Team Members routes (public read, protected write)
  app.get("/api/team", async (req, res) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/team", requireAuth, async (req, res) => {
    try {
      const parsed = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(parsed);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  app.put("/api/team/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/team/:id", requireAuth, async (req, res) => {
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

  // Contact submissions route (public create, protected read)
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(parsed);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  app.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
