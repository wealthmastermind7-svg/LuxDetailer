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
          features: JSON.stringify(["Thorough vacuum including trunk", "Standard pet hair removal", "Thorough interior wipe down", "Shampoo carpets & floor mats", "Interior steam clean at 212°F", "Leather cleaning & conditioning"]),
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
          features: JSON.stringify(["Assessment of vehicle and paint evaluation", "Standard inside and out wash including trunk", "Wash & decontamination with clay bar and iron removal", "Clay bar paint treatment", "Heavy compounding", "Multi-stage buffing for smoothness", "Showroom finish", "Super hydrophobic", "1-3 layers of glass-like coating", "Above 9h hardness protection", "1-3 years of protection", "Super gloss", "Chemical-resistant protection"]),
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
