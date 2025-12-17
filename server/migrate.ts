import { pool, db } from './db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Starting database migration...');
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        logo_url TEXT,
        primary_color TEXT DEFAULT '#1E90FF',
        secondary_color TEXT DEFAULT '#D4AF37',
        accent_color TEXT DEFAULT '#FFFFFF',
        contact_email TEXT,
        contact_phone TEXT,
        address TEXT,
        website TEXT,
        qr_code_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created businesses table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id VARCHAR REFERENCES businesses(id),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created users table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT,
        license_plate TEXT,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created vehicles table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id VARCHAR REFERENCES businesses(id),
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        duration INTEGER NOT NULL,
        image_url TEXT,
        features TEXT,
        is_active BOOLEAN DEFAULT true
      )
    `);
    console.log('Created services table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id),
        token VARCHAR NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created sessions table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id VARCHAR REFERENCES businesses(id),
        user_id VARCHAR REFERENCES users(id),
        vehicle_id VARCHAR REFERENCES vehicles(id),
        service_id VARCHAR REFERENCES services(id),
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        location TEXT,
        notes TEXT,
        total_price DECIMAL(10, 2),
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created bookings table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS membership_plans (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        frequency TEXT NOT NULL,
        price_per_month DECIMAL(10, 2) NOT NULL,
        service_included TEXT NOT NULL,
        features TEXT,
        savings_percent INTEGER,
        is_popular BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true
      )
    `);
    console.log('Created membership_plans table');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_memberships (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id),
        plan_id VARCHAR NOT NULL REFERENCES membership_plans(id),
        status TEXT NOT NULL DEFAULT 'active',
        start_date TIMESTAMP DEFAULT NOW(),
        next_wash_date TIMESTAMP,
        washes_remaining INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Created user_memberships table');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate();
