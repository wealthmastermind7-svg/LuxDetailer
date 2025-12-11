import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertBookingSchema, insertVehicleSchema, insertServiceSchema, insertUserSchema } from "@shared/schema";
import { authMiddleware, requireAuth, requireAdmin, rateLimiter, hashPassword, verifyPassword, createSession, deleteSession } from "./auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(rateLimiter);
  app.use(authMiddleware());

  // =====================
  // AUTH ENDPOINTS (Public)
  // =====================
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid registration data", details: parsed.error.errors });
      }

      const existing = await storage.getUserByUsername(parsed.data.username);
      if (existing) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const hashedPassword = hashPassword(parsed.data.password);
      const user = await storage.createUser({
        username: parsed.data.username,
        password: hashedPassword,
        email: parsed.data.email,
        phone: parsed.data.phone,
      });

      const token = await createSession(user.id);

      res.status(201).json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid login data" });
      }

      const user = await storage.getUserByUsername(parsed.data.username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!verifyPassword(parsed.data.password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = await createSession(user.id);

      res.json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req: Request, res: Response) => {
    try {
      if (req.sessionToken) {
        await deleteSession(req.sessionToken);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  // =====================
  // SERVICES (Public read, Admin write)
  // =====================
  
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const services = await storage.getServicesByCategory(req.params.category);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertServiceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid service data", details: parsed.error });
      }
      const service = await storage.createService(parsed.data);
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // =====================
  // VEHICLES (Authenticated, owner only)
  // =====================
  
  app.get("/api/vehicles", requireAuth, async (req: Request, res: Response) => {
    try {
      const vehicles = await storage.getVehicles(req.user!.id);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      if (vehicle.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = insertVehicleSchema.safeParse({
        ...req.body,
        userId: req.user!.id,
      });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid vehicle data", details: parsed.error });
      }
      const vehicle = await storage.createVehicle(parsed.data);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const existingVehicle = await storage.getVehicle(req.params.id);
      if (!existingVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      if (existingVehicle.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const vehicle = await storage.updateVehicle(req.params.id, req.body);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const existingVehicle = await storage.getVehicle(req.params.id);
      if (!existingVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      if (existingVehicle.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // =====================
  // BOOKINGS (Authenticated, owner only)
  // =====================
  
  app.get("/api/bookings", requireAuth, async (req: Request, res: Response) => {
    try {
      if (req.user!.role === "admin") {
        const bookings = await storage.getBookings();
        return res.json(bookings);
      }
      const bookings = await storage.getBookings(req.user!.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      if (booking.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = insertBookingSchema.safeParse({
        ...req.body,
        userId: req.user!.id,
      });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid booking data", details: parsed.error });
      }
      const booking = await storage.createBooking(parsed.data);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const existingBooking = await storage.getBooking(req.params.id);
      if (!existingBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      if (existingBooking.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const booking = await storage.updateBooking(req.params.id, req.body);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.post("/api/bookings/:id/cancel", requireAuth, async (req: Request, res: Response) => {
    try {
      const existingBooking = await storage.getBooking(req.params.id);
      if (!existingBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      if (existingBooking.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.cancelBooking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // =====================
  // ADMIN ONLY ENDPOINTS
  // =====================
  
  app.post("/api/admin/seed-services", requireAuth, requireAdmin, async (req, res) => {
    try {
      const defaultServices = [
        {
          name: "Express Exterior",
          description: "Full exterior wash and dry with tire dressing & rim cleaning",
          category: "exterior",
          price: "95.00",
          duration: 35,
          features: JSON.stringify(["Full exterior wash and dry", "Tire dressing & rim cleaning", "Exterior window cleaning", "Glossy exterior finish"]),
          isActive: true,
        },
        {
          name: "Gold Wash",
          description: "Full exterior hand wash with thorough interior vacuum and cleaning",
          category: "exterior",
          price: "145.00",
          duration: 62,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Glossy exterior finish"]),
          isActive: true,
        },
        {
          name: "Platinum Wash",
          description: "Complete hand wash with wax, leather conditioning, and light stain removal",
          category: "exterior",
          price: "225.00",
          duration: 105,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Complete wax", "Leather cleaning & conditioning", "Light stain removal"]),
          isActive: true,
        },
        {
          name: "Scratch Removal",
          description: "Professional scratch assessment and removal with machine polish and buffing",
          category: "exterior",
          price: "260.00",
          duration: 80,
          features: JSON.stringify(["Scratch assessment", "Surface cleaning and prep", "Compound", "Machine polish", "Final buffing for smoothness", "Clear coat repair", "Touch up paint/blending"]),
          isActive: true,
        },
        {
          name: "Interior Detail",
          description: "Thorough vacuum, steam clean, and conditioning of entire interior",
          category: "interior",
          price: "350.00",
          duration: 90,
          features: JSON.stringify(["Thorough vacuum including trunk", "Standard pet hair removal", "Thorough interior wipe down", "Shampoo carpets & floor mats", "Interior steam clean at 212F", "Leather cleaning & conditioning"]),
          isActive: true,
        },
        {
          name: "Deluxe Detail",
          description: "Full exterior and interior detail with clay bar, wax, and plastic dressing",
          category: "premium",
          price: "415.00",
          duration: 165,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Complete wax", "Leather cleaning & conditioning", "Clay bar paint treatment", "Outside plastic dressing", "Mats & carpets shampooed"]),
          isActive: true,
        },
        {
          name: "Signature Detail",
          description: "Ultimate detail with multi-stage buffing, sealant wax, and single-stage paint buffing",
          category: "premium",
          price: "625.00",
          duration: 220,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Leather cleaning & conditioning", "Clay bar paint treatment", "Water spot removal", "Outside plastic dressing", "Mats & carpets shampooed", "Plastic dressing inside", "Single-stage paint buffing", "Sealant wax", "Shampoo seats"]),
          isActive: true,
        },
        {
          name: "Diamond Ceramic",
          description: "Glass-like ceramic coating with 1-3 years protection and 9h hardness",
          category: "protection",
          price: "1045.00",
          duration: 330,
          features: JSON.stringify(["Super gloss", "Super hydrophobic", "Free inside and out wash", "Single-stage buffing", "1-3 layers of glass-like coating", "Above 9h hardness protection", "Chemical-resistant protection", "1-3 years of protection", "Clay bar paint treatment", "Standard inside and out wash"]),
          isActive: true,
        },
        {
          name: "Titanium Gloss",
          description: "Premium ceramic with multi-stage buffing, showroom finish, and 1-3 year protection",
          category: "protection",
          price: "1680.00",
          duration: 220,
          features: JSON.stringify(["Assessment of vehicle and paint evaluation", "Standard inside and out wash including trunk", "Wash and decontamination with clay bar and iron removal", "Clay bar paint treatment", "Heavy compounding", "Multi-stage buffing for smoothness", "Showroom finish", "Super hydrophobic", "1-3 layers of glass-like coating", "Above 9h hardness protection", "1-3 years of protection", "Super gloss", "Chemical-resistant protection"]),
          isActive: true,
        },
        {
          name: "Window Tinting",
          description: "Professional window tinting with UV and thermal protection",
          category: "protection",
          price: "1045.00",
          duration: 220,
          features: JSON.stringify(["UVA and UVB ray shielding", "Temperature reduction and glare elimination", "Improved protection from theft", "Adds appeal and aesthetics", "Safer driving with less glare"]),
          isActive: true,
        },
      ];

      for (const service of defaultServices) {
        await storage.createService(service);
      }

      res.json({ success: true, message: "Services seeded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed services" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
