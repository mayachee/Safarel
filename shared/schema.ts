import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const overview = pgTable("overview", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const values = pgTable("values", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  serviceInterest: text("service_interest").notNull(),
  message: text("message").notNull(),
});

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin authentication table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOverviewSchema = createInsertSchema(overview).omit({ id: true });
export const insertValueSchema = createInsertSchema(values).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({ id: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOverview = z.infer<typeof insertOverviewSchema>;
export type Overview = typeof overview.$inferSelect;

export type InsertValue = z.infer<typeof insertValueSchema>;
export type Value = typeof values.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
