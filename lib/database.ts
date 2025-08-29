import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDatabase() {
  if (!pool) {
    const isProduction = process.env.NODE_ENV === 'production';
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/shortlink';
    
    // Determine SSL configuration
    let sslConfig: any = false;
    
    if (isProduction) {
      // Only use SSL for production and cloud databases
      if (databaseUrl.includes('supabase.co') || 
          databaseUrl.includes('neon.tech') || 
          databaseUrl.includes('railway.app') || 
          databaseUrl.includes('amazonaws.com') ||
          databaseUrl.includes('planetscale.com')) {
        sslConfig = { rejectUnauthorized: false };
      }
    }
    
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: sslConfig,
      // Connection pool configuration
      max: isProduction ? 20 : 10, // Maximum number of clients in the pool
      min: isProduction ? 5 : 2,   // Minimum number of clients in the pool
      idleTimeoutMillis: 30000,    // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds
    });
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function initDatabase() {
  const db = getDatabase();
  
  try {
    // Test connection
    await db.query('SELECT NOW()');
    
    // Create table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        short_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        click_count INTEGER DEFAULT 0
      )
    `);
    
    // Create index for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
