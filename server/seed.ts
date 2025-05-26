import { db } from "./db";
import { overview, values, services, teamMembers } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Seed overview
    await db.insert(overview).values({
      title: "Professional Transportation Solutions Across Europe",
      description: "LogiFlow provides comprehensive logistics services with cutting-edge technology, ensuring your cargo reaches its destination safely, quickly, and reliably across European markets."
    }).onConflictDoNothing();

    // Seed values
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

    // Seed services
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

    // Seed team members
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