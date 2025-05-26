import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

const PgSession = connectPg(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "fallback-secret-for-dev",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

export async function setupAuth(app: Express) {
  app.use(getSession());
}

declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminEmail?: string;
  }
}