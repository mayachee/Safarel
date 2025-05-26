import { 
  Overview, 
  InsertOverview, 
  Value, 
  InsertValue,
  Service,
  InsertService,
  TeamMember,
  InsertTeamMember,
  ContactSubmission,
  InsertContactSubmission,
  Admin,
  InsertAdmin,
  admins,
  overview,
  values,
  services,
  teamMembers,
  contactSubmissions
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Overview
  getOverview(): Promise<Overview | undefined>;
  updateOverview(overview: InsertOverview): Promise<Overview>;
  
  // Values
  getValues(): Promise<Value[]>;
  createValue(value: InsertValue): Promise<Value>;
  updateValue(id: number, value: Partial<InsertValue>): Promise<Value | undefined>;
  deleteValue(id: number): Promise<boolean>;
  
  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Admin Authentication
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  verifyAdminPassword(email: string, password: string): Promise<Admin | null>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultAdmin() {
    try {
      // Check if admin already exists
      const existingAdmin = await this.getAdminByEmail("safarelsarl@gmail.com");
      if (!existingAdmin) {
        // Create the admin with the specified credentials
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
    // Initialize default admin
    this.initializeDefaultAdmin();
  }

  // Overview methods
  async getOverview(): Promise<Overview | undefined> {
    const [overviewData] = await db.select().from(overview).limit(1);
    return overviewData;
  }

  async updateOverview(overviewData: InsertOverview): Promise<Overview> {
    // Check if overview exists
    const existing = await db.select().from(overview).where(eq(overview.id, 1)).limit(1);
    
    if (existing.length > 0) {
      // Update existing record
      const [updated] = await db
        .update(overview)
        .set(overviewData)
        .where(eq(overview.id, 1))
        .returning();
      return updated;
    } else {
      // Create new record with id 1
      const [created] = await db
        .insert(overview)
        .values({ id: 1, ...overviewData })
        .returning();
      return created;
    }
  }

  // Values methods
  async getValues(): Promise<Value[]> {
    return await db.select().from(values).orderBy(values.order);
  }

  async createValue(value: InsertValue): Promise<Value> {
    const [created] = await db.insert(values).values(value).returning();
    return created;
  }

  async updateValue(id: number, value: Partial<InsertValue>): Promise<Value | undefined> {
    const [updated] = await db
      .update(values)
      .set(value)
      .where(eq(values.id, id))
      .returning();
    return updated;
  }

  async deleteValue(id: number): Promise<boolean> {
    const result = await db.delete(values).where(eq(values.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order);
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Team Members methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(teamMembers.order);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db
      .update(teamMembers)
      .set(member)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Contact Submissions methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  // Admin Authentication methods
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [created] = await db.insert(admins).values(admin).returning();
    return created;
  }

  async verifyAdminPassword(email: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByEmail(email);
    if (!admin) return null;
    
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    return isValid ? admin : null;
  }
}

export const storage = new DatabaseStorage();