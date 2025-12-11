import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import * as fs from "fs";
import * as path from "path";

const app = express();
const log = console.log;

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

function setupCors(app: express.Application) {
  app.use((req, res, next) => {
    const origins = new Set<string>();

    if (process.env.REPLIT_DEV_DOMAIN) {
      origins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
    }

    if (process.env.REPLIT_DOMAINS) {
      process.env.REPLIT_DOMAINS.split(",").forEach((d) => {
        origins.add(`https://${d.trim()}`);
      });
    }

    const origin = req.header("origin");

    if (origin && origins.has(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      );
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });
}

function setupBodyParsing(app: express.Application) {
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));
}

function setupStaticFiles(app: express.Application) {
  const publicPath = path.resolve(process.cwd(), "public");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath, { maxAge: "1d" }));
  }
}

function setupRequestLogging(app: express.Application) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      if (!path.startsWith("/api")) return;

      const duration = Date.now() - start;

      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    });

    next();
  });
}

function getAppName(): string {
  try {
    const appJsonPath = path.resolve(process.cwd(), "app.json");
    const appJsonContent = fs.readFileSync(appJsonPath, "utf-8");
    const appJson = JSON.parse(appJsonContent);
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function serveExpoManifest(platform: string, res: Response) {
  const manifestPath = path.resolve(
    process.cwd(),
    "static-build",
    platform,
    "manifest.json",
  );

  if (!fs.existsSync(manifestPath)) {
    return res
      .status(404)
      .json({ error: `Manifest not found for platform: ${platform}` });
  }

  res.setHeader("expo-protocol-version", "1");
  res.setHeader("expo-sfv-version", "0");
  res.setHeader("content-type", "application/json");

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.send(manifest);
}

function serveLandingPage({
  req,
  res,
  landingPageTemplate,
  appName,
}: {
  req: Request;
  res: Response;
  landingPageTemplate: string;
  appName: string;
}) {
  const forwardedProto = req.header("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol || "https";
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  log(`baseUrl`, baseUrl);
  log(`expsUrl`, expsUrl);

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

function configureExpoAndLanding(app: express.Application) {
  const templatePath = path.resolve(
    process.cwd(),
    "server",
    "templates",
    "landing-page.html",
  );
  const landingPageTemplate = fs.readFileSync(templatePath, "utf-8");
  const appName = getAppName();

  log("Serving static Expo files with dynamic manifest routing");

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    if (req.path !== "/" && req.path !== "/manifest") {
      return next();
    }

    const platform = req.header("expo-platform");
    if (platform && (platform === "ios" || platform === "android")) {
      return serveExpoManifest(platform, res);
    }

    if (req.path === "/") {
      return serveLandingPage({
        req,
        res,
        landingPageTemplate,
        appName,
      });
    }

    next();
  });

  app.use("/assets", express.static(path.resolve(process.cwd(), "assets")));
  app.use(express.static(path.resolve(process.cwd(), "static-build")));

  log("Expo routing: Checking expo-platform header on / and /manifest");
}

function setupErrorHandler(app: express.Application) {
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const error = err as {
      status?: number;
      statusCode?: number;
      message?: string;
    };

    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(status).json({ message });

    throw err;
  });
}

(async () => {
  try {
    setupCors(app);
    setupBodyParsing(app);
    setupRequestLogging(app);
    setupStaticFiles(app);

    configureExpoAndLanding(app);

    const server = await registerRoutes(app);

    setupErrorHandler(app);

    // Seed services and membership plans before starting server
    await seedServices();
    await seedMembershipPlans();

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`express server serving on port ${port}`);
      },
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

async function seedServices() {
  try {
    const { storage } = await import("./storage");
    const existingServices = await storage.getServices();
    
    if (existingServices.length === 0) {
      const defaultServices = [
        {
          name: "Express Exterior",
          description: "Full exterior wash and dry with tire dressing & rim cleaning",
          category: "exterior" as const,
          price: "95.00",
          duration: 35,
          features: JSON.stringify(["Full exterior wash and dry", "Tire dressing & rim cleaning", "Exterior window cleaning", "Glossy exterior finish"]),
          isActive: true,
        },
        {
          name: "Gold Wash",
          description: "Full exterior hand wash with thorough interior vacuum and cleaning",
          category: "exterior" as const,
          price: "145.00",
          duration: 62,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Glossy exterior finish"]),
          isActive: true,
        },
        {
          name: "Platinum Wash",
          description: "Complete hand wash with wax, leather conditioning, and light stain removal",
          category: "exterior" as const,
          price: "225.00",
          duration: 105,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Complete wax", "Leather cleaning & conditioning", "Light stain removal"]),
          isActive: true,
        },
        {
          name: "Scratch Removal",
          description: "Professional scratch assessment and removal with machine polish and buffing",
          category: "exterior" as const,
          price: "260.00",
          duration: 80,
          features: JSON.stringify(["Scratch assessment", "Surface cleaning and prep", "Compound", "Machine polish", "Final buffing for smoothness", "Clear coat repair", "Touch up paint/blending"]),
          isActive: true,
        },
        {
          name: "Interior Detail",
          description: "Thorough vacuum, steam clean, and conditioning of entire interior",
          category: "interior" as const,
          price: "350.00",
          duration: 90,
          features: JSON.stringify(["Thorough vacuum including trunk", "Standard pet hair removal", "Thorough interior wipe down", "Shampoo carpets & floor mats", "Interior steam clean at 212F", "Leather cleaning & conditioning"]),
          isActive: true,
        },
        {
          name: "Deluxe Detail",
          description: "Full exterior and interior detail with clay bar, wax, and plastic dressing",
          category: "premium" as const,
          price: "415.00",
          duration: 165,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Complete wax", "Leather cleaning & conditioning", "Clay bar paint treatment", "Outside plastic dressing", "Mats & carpets shampooed"]),
          isActive: true,
        },
        {
          name: "Signature Detail",
          description: "Ultimate detail with multi-stage buffing, sealant wax, and single-stage paint buffing",
          category: "premium" as const,
          price: "625.00",
          duration: 220,
          features: JSON.stringify(["Full exterior hand wash", "Tire dressing & rim cleaning", "Exterior window cleaning", "Interior & trunk vacuum", "Interior wipe down", "Door jambs", "Window cleaning inside", "Leather cleaning & conditioning", "Clay bar paint treatment", "Water spot removal", "Outside plastic dressing", "Mats & carpets shampooed", "Plastic dressing inside", "Single-stage paint buffing", "Sealant wax", "Shampoo seats"]),
          isActive: true,
        },
        {
          name: "Diamond Ceramic",
          description: "Glass-like ceramic coating with 1-3 years protection and 9h hardness",
          category: "protection" as const,
          price: "1045.00",
          duration: 330,
          features: JSON.stringify(["Super gloss", "Super hydrophobic", "Free inside and out wash", "Single-stage buffing", "1-3 layers of glass-like coating", "Above 9h hardness protection", "Chemical-resistant protection", "1-3 years of protection", "Clay bar paint treatment", "Standard inside and out wash"]),
          isActive: true,
        },
        {
          name: "Titanium Gloss",
          description: "Premium ceramic with multi-stage buffing, showroom finish, and 1-3 year protection",
          category: "protection" as const,
          price: "1680.00",
          duration: 220,
          features: JSON.stringify(["Assessment of vehicle and paint evaluation", "Standard inside and out wash including trunk", "Wash and decontamination with clay bar and iron removal", "Clay bar paint treatment", "Heavy compounding", "Multi-stage buffing for smoothness", "Showroom finish", "Super hydrophobic", "1-3 layers of glass-like coating", "Above 9h hardness protection", "1-3 years of protection", "Super gloss", "Chemical-resistant protection"]),
          isActive: true,
        },
        {
          name: "Window Tinting",
          description: "Professional window tinting with UV and thermal protection",
          category: "protection" as const,
          price: "1045.00",
          duration: 220,
          features: JSON.stringify(["UVA and UVB ray shielding", "Temperature reduction and glare elimination", "Improved protection from theft", "Adds appeal and aesthetics", "Safer driving with less glare"]),
          isActive: true,
        },
      ];

      for (const service of defaultServices) {
        await storage.createService(service);
      }
      
      log("Services seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding services:", error);
  }
}

async function seedMembershipPlans() {
  try {
    const { storage } = await import("./storage");
    const existingPlans = await storage.getMembershipPlans();
    
    if (existingPlans.length === 0) {
      const membershipPlans = [
        {
          name: "Weekly Wash Club",
          description: "Perfect for those who love a spotless ride. Get a professional exterior wash every week.",
          frequency: "weekly" as const,
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
          frequency: "fortnightly" as const,
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
          frequency: "monthly" as const,
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
      
      log("Membership plans seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding membership plans:", error);
  }
}
