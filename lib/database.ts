import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/shortlink',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDatabase() {
  const db = getDatabase();
  
  try {
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
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
