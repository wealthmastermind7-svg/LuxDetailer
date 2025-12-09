import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertBookingSchema, insertVehicleSchema, insertServiceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Services endpoints
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

  app.post("/api/services", async (req, res) => {
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

  // Vehicles endpoints
  app.get("/api/vehicles", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const vehicles = await storage.getVehicles(userId);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const parsed = insertVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid vehicle data", details: parsed.error });
      }
      const vehicle = await storage.createVehicle(parsed.data);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      await storage.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Bookings endpoints
  app.get("/api/bookings", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const bookings = await storage.getBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const parsed = insertBookingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid booking data", details: parsed.error });
      }
      const booking = await storage.createBooking(parsed.data);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
      await storage.cancelBooking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // Seed services endpoint (for initial data setup)
  app.post("/api/seed-services", async (req, res) => {
    try {
      const defaultServices = [
        {
          name: "Express Exterior Wash",
          description: "Quick exterior clean with premium soap and hand dry",
          category: "exterior",
          price: "49.00",
          duration: 30,
          features: JSON.stringify(["Hand wash", "Wheel cleaning", "Tire shine", "Window cleaning"]),
          isActive: true,
        },
        {
          name: "Premium Exterior Detail",
          description: "Complete exterior treatment with paint decontamination and protection",
          category: "exterior",
          price: "149.00",
          duration: 120,
          features: JSON.stringify(["Clay bar treatment", "Paint correction", "Sealant application", "Trim restoration"]),
          isActive: true,
        },
        {
          name: "Interior Deep Clean",
          description: "Thorough interior cleaning and conditioning",
          category: "interior",
          price: "129.00",
          duration: 90,
          features: JSON.stringify(["Vacuum & steam clean", "Leather conditioning", "Dashboard treatment", "Odor elimination"]),
          isActive: true,
        },
        {
          name: "Full Interior Restoration",
          description: "Complete interior revival with deep extraction and treatment",
          category: "interior",
          price: "249.00",
          duration: 180,
          features: JSON.stringify(["Deep extraction", "Stain removal", "UV protection", "Fabric coating"]),
          isActive: true,
        },
        {
          name: "Executive Detail Package",
          description: "Our signature full-service treatment inside and out",
          category: "premium",
          price: "399.00",
          duration: 300,
          features: JSON.stringify(["Full exterior detail", "Complete interior", "Engine bay cleaning", "Paint sealant"]),
          isActive: true,
        },
        {
          name: "Showroom Finish",
          description: "Competition-grade detail for the ultimate presentation",
          category: "premium",
          price: "599.00",
          duration: 480,
          features: JSON.stringify(["Multi-stage paint correction", "Ceramic coating prep", "Concours finish", "Photo documentation"]),
          isActive: true,
        },
        {
          name: "Ceramic Coating",
          description: "Professional-grade ceramic protection for lasting shine",
          category: "protection",
          price: "799.00",
          duration: 480,
          features: JSON.stringify(["Paint correction", "IGL Kenzo coating", "5-year protection", "Hydrophobic finish"]),
          isActive: true,
        },
        {
          name: "Paint Protection Film",
          description: "Self-healing PPF for ultimate paint protection",
          category: "protection",
          price: "1499.00",
          duration: 960,
          features: JSON.stringify(["XPEL Ultimate Plus", "Full front coverage", "10-year warranty", "Self-healing"]),
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
