import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  businesses,
  users,
  vehicles,
  services,
  bookings,
  membershipPlans,
  userMemberships,
  type Business,
  type InsertBusiness,
  type User,
  type InsertUser,
  type Vehicle,
  type InsertVehicle,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type MembershipPlan,
  type InsertMembershipPlan,
  type UserMembership,
  type InsertUserMembership,
} from "@shared/schema";

export interface IStorage {
  getBusiness(id: string): Promise<Business | undefined>;
  getBusinessBySlug(slug: string): Promise<Business | undefined>;
  getBusinesses(): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business | undefined>;

  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVehicles(userId: string): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;
  
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  getBookings(userId?: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  cancelBooking(id: string): Promise<boolean>;

  getMembershipPlans(): Promise<MembershipPlan[]>;
  getMembershipPlan(id: string): Promise<MembershipPlan | undefined>;
  createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan>;

  getUserMembership(userId: string): Promise<UserMembership | undefined>;
  createUserMembership(membership: InsertUserMembership): Promise<UserMembership>;
  updateUserMembership(id: string, updates: Partial<InsertUserMembership>): Promise<UserMembership | undefined>;
  cancelUserMembership(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getBusiness(id: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async getBusinessBySlug(slug: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.slug, slug));
    return business;
  }

  async getBusinesses(): Promise<Business[]> {
    return db.select().from(businesses).where(eq(businesses.isActive, true));
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [newBusiness] = await db.insert(businesses).values(business).returning();
    return newBusiness;
  }

  async updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business | undefined> {
    const [business] = await db.update(businesses).set(updates).where(eq(businesses.id, id)).returning();
    return business;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser & { role?: string }): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: insertUser.role || "user",
    }).returning();
    return user;
  }

  async getVehicles(userId: string): Promise<Vehicle[]> {
    return db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }

  async updateVehicle(id: string, updates: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [vehicle] = await db.update(vehicles).set(updates).where(eq(vehicles.id, id)).returning();
    return vehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return true;
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.isActive, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return db.select().from(services).where(eq(services.category, category));
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async getBookings(userId?: string): Promise<Booking[]> {
    if (userId) {
      return db.select().from(bookings).where(eq(bookings.userId, userId));
    }
    return db.select().from(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(bookings.id, id)).returning();
    return booking;
  }

  async cancelBooking(id: string): Promise<boolean> {
    await db.update(bookings).set({ status: "cancelled", updatedAt: new Date() }).where(eq(bookings.id, id));
    return true;
  }

  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return db.select().from(membershipPlans).where(eq(membershipPlans.isActive, true));
  }

  async getMembershipPlan(id: string): Promise<MembershipPlan | undefined> {
    const [plan] = await db.select().from(membershipPlans).where(eq(membershipPlans.id, id));
    return plan;
  }

  async createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan> {
    const [newPlan] = await db.insert(membershipPlans).values(plan).returning();
    return newPlan;
  }

  async getUserMembership(userId: string): Promise<UserMembership | undefined> {
    const [membership] = await db.select().from(userMemberships)
      .where(eq(userMemberships.userId, userId));
    return membership;
  }

  async createUserMembership(membership: InsertUserMembership): Promise<UserMembership> {
    const [newMembership] = await db.insert(userMemberships).values(membership).returning();
    return newMembership;
  }

  async updateUserMembership(id: string, updates: Partial<InsertUserMembership>): Promise<UserMembership | undefined> {
    const [membership] = await db.update(userMemberships).set(updates).where(eq(userMemberships.id, id)).returning();
    return membership;
  }

  async cancelUserMembership(id: string): Promise<boolean> {
    await db.update(userMemberships).set({ status: "cancelled" }).where(eq(userMemberships.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
