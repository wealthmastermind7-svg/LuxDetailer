import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertBookingSchema, insertVehicleSchema, insertServiceSchema, insertUserSchema, insertUserMembershipSchema } from "@shared/schema";
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
      console.error("Booking creation error:", error);
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
  // MEMBERSHIPS (Public read, Authenticated subscribe)
  // =====================

  app.get("/api/memberships/plans", async (req, res) => {
    try {
      const plans = await storage.getMembershipPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership plans" });
    }
  });

  app.get("/api/memberships/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getMembershipPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership plan" });
    }
  });

  app.get("/api/memberships/my", requireAuth, async (req: Request, res: Response) => {
    try {
      const membership = await storage.getUserMembership(req.user!.id);
      res.json(membership || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership" });
    }
  });

  app.post("/api/memberships/subscribe", requireAuth, async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;
      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      const plan = await storage.getMembershipPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      const existingMembership = await storage.getUserMembership(req.user!.id);
      if (existingMembership && existingMembership.status === "active") {
        return res.status(409).json({ error: "You already have an active membership" });
      }

      const nextWashDate = new Date();
      nextWashDate.setDate(nextWashDate.getDate() + 1);

      const washesPerMonth = plan.frequency === "weekly" ? 4 : plan.frequency === "fortnightly" ? 2 : 1;

      const membership = await storage.createUserMembership({
        userId: req.user!.id,
        planId,
        status: "active",
        nextWashDate,
        washesRemaining: washesPerMonth,
      });

      res.status(201).json(membership);
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/memberships/cancel", requireAuth, async (req: Request, res: Response) => {
    try {
      const membership = await storage.getUserMembership(req.user!.id);
      if (!membership) {
        return res.status(404).json({ error: "No active membership found" });
      }

      await storage.cancelUserMembership(membership.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel membership" });
    }
  });

  // =====================
  // ADMIN ONLY ENDPOINTS
  // =====================
  
  app.post("/api/admin/seed-services", requireAuth, requireAdmin, async (req, res) => {
    try {
      const defaultServices = [
        {
          name: "Ceramic Coating",
          description: "Professional ceramic coating application with 1-3 years protection and 9h hardness",
          category: "protection",
          price: "1200.00",
          duration: 330,
          features: JSON.stringify(["Multi-layer ceramic coating", "9h hardness protection", "Super hydrophobic finish", "Showroom gloss", "1-3 years durability", "Chemical resistant", "UV protection"]),
          isActive: true,
        },
        {
          name: "Paint Protection Film",
          description: "Premium paint protection film installation for maximum durability",
          category: "protection",
          price: "1500.00",
          duration: 400,
          features: JSON.stringify(["Full front coverage or custom zones", "Self-healing technology", "Clear protection", "Stone chip resistant", "UV protection", "Easy maintenance", "Professional installation"]),
          isActive: true,
        },
        {
          name: "Paint Correction",
          description: "Expert paint correction removing swirls, scratches, and imperfections",
          category: "exterior",
          price: "800.00",
          duration: 240,
          features: JSON.stringify(["Scratch assessment", "Multi-stage polishing", "Swirl removal", "Clear coat refinement", "Machine polishing", "Final buffing", "Paint depth gauge included"]),
          isActive: true,
        },
        {
          name: "Vinyl Wraps",
          description: "Professional vinyl wrap installation for complete vehicle transformation",
          category: "exterior",
          price: "2500.00",
          duration: 480,
          features: JSON.stringify(["Full vinyl wrap installation", "Custom color options", "Matte or gloss finish", "Professional application", "Edge sealing", "Removable without damage", "Design consultation"]),
          isActive: true,
        },
        {
          name: "Powder Coating",
          description: "Professional powder coating for wheels and calipers with premium finish",
          category: "exterior",
          price: "600.00",
          duration: 180,
          features: JSON.stringify(["Wheel powder coating", "Brake caliper coating", "Prep and sandblasting", "Premium color selection", "Durable finish", "Rust resistant", "Heat cured"]),
          isActive: true,
        },
        {
          name: "Window Tinting",
          description: "Professional window tinting with UV and thermal protection",
          category: "protection",
          price: "400.00",
          duration: 120,
          features: JSON.stringify(["UVA and UVB protection", "Heat reduction", "Glare elimination", "Enhanced privacy", "Professional application", "Lifetime warranty available", "Customizable tint levels"]),
          isActive: true,
        },
        {
          name: "Full Detailing",
          description: "Complete exterior and interior detailing with ceramic ready finish",
          category: "premium",
          price: "700.00",
          duration: 240,
          features: JSON.stringify(["Exterior wash and dry", "Interior vacuum and wipe", "Tire and rim cleaning", "Leather conditioning", "Window cleaning", "Door jambs cleaning", "Ceramic ready prep"]),
          isActive: true,
        },
        {
          name: "Express Wash",
          description: "Quick exterior wash and dry with tire dressing",
          category: "exterior",
          price: "150.00",
          duration: 45,
          features: JSON.stringify(["Full exterior wash", "Tire dressing", "Rim cleaning", "Exterior windows", "Quick dry"]),
          isActive: true,
        },
        {
          name: "Interior Detail",
          description: "Thorough interior cleaning with vacuuming, steaming, and conditioning",
          category: "interior",
          price: "400.00",
          duration: 150,
          features: JSON.stringify(["Deep vacuum", "Steam cleaning", "Leather conditioning", "Carpet shampooing", "Interior wipe down"]),
          isActive: true,
        },
        {
          name: "Premium Bundle",
          description: "Complete detailing with ceramic coating preparation",
          category: "premium",
          price: "1500.00",
          duration: 360,
          features: JSON.stringify(["Full detailing service", "Paint correction", "Ceramic ready prep", "Protection package", "Final inspection"]),
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

  app.post("/api/admin/seed-memberships", requireAuth, requireAdmin, async (req, res) => {
    try {
      const membershipPlans = [
        {
          name: "Weekly Wash Club",
          description: "Perfect for those who love a spotless ride. Get a professional exterior wash every week.",
          frequency: "weekly",
          pricePerMonth: "149.00",
          serviceIncluded: "Express Exterior",
          features: JSON.stringify(["Weekly exterior wash", "Tire dressing included", "Priority scheduling", "10% off add-ons"]),
          savingsPercent: 60,
          isPopular: false,
          isActive: true,
        },
        {
          name: "Fortnightly Fresh",
          description: "Ideal balance of value and convenience. Bi-weekly washes to keep your car looking great.",
          frequency: "fortnightly",
          pricePerMonth: "99.00",
          serviceIncluded: "Express Exterior",
          features: JSON.stringify(["Bi-weekly exterior wash", "Tire dressing included", "Flexible scheduling", "5% off add-ons"]),
          savingsPercent: 45,
          isPopular: true,
          isActive: true,
        },
        {
          name: "Monthly Maintain",
          description: "Essential care for busy lifestyles. Monthly professional wash to maintain your vehicle.",
          frequency: "monthly",
          pricePerMonth: "79.00",
          serviceIncluded: "Gold Wash",
          features: JSON.stringify(["Monthly Gold Wash", "Interior vacuum included", "Window cleaning", "Membership rewards"]),
          savingsPercent: 45,
          isPopular: false,
          isActive: true,
        },
      ];

      for (const plan of membershipPlans) {
        await storage.createMembershipPlan(plan);
      }

      res.json({ success: true, message: "Membership plans seeded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed membership plans" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
