import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

export const db = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

// Initialize database tables
export const initDatabase = async () => {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      photo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      userId TEXT,
      body TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}
