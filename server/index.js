import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import passport from 'passport'
import cookieParser from 'cookie-parser'

// Import configurations and middleware
import { db, initDatabase } from './config/database.js'
import { configurePassport } from './config/passport.js'
import { socketAuthMiddleware } from './middleware/socketAuth.js'
import authRoutes from './routes/auth.js'

// Load environment variables
dotenv.config()

// Validation schema for messages
const messageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(2000, 'Message is too long (max 2000 characters)')
  .trim()

// Initialize Express app
const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
})

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

// Configure Passport
configurePassport()

// Initialize database
await initDatabase()

// Auth routes
app.use(authRoutes)

// Socket.io authentication and connection handling
const onlineUsers = new Map()

io.use(socketAuthMiddleware)

io.on('connection', async socket => {
  // Only add authenticated users to online users
  if (!socket.isAnonymous) {
    onlineUsers.set(socket.userId, {
      displayName: socket.displayName,
      photo: socket.photo,
      email: socket.email
    })

    // Broadcast online users
    io.emit('onlineUsers', Array.from(onlineUsers.values()))
  }

  // Handle messages
  socket.on('message', async body => {
    // Block anonymous users from sending messages
    if (socket.isAnonymous) {
      socket.emit('auth-required', {
        message: 'You must be logged in to send messages'
      })
      return
    }

    const messageResult = messageSchema.safeParse(body)

    if (!messageResult.success) {
      socket.emit('validation-error', {
        message: messageResult.error.errors[0].message
      })
      return
    }

    const sanitizedMessage = messageResult.data

    try {
      await db.execute({
        sql: 'INSERT INTO messages (username, userId, body) VALUES (?, ?, ?)',
        args: [socket.displayName, socket.userId, sanitizedMessage],
      })

      socket.broadcast.emit('message', {
        body: sanitizedMessage,
        from: socket.displayName,
        userId: socket.userId,
      })
    } catch (error) {
      console.error('Database error:', error.message)
      socket.emit('validation-error', { message: 'Failed to send message' })
    }
  })

  // Load historical messages for all users (anonymous and authenticated)
  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: 'SELECT * FROM messages ORDER BY id DESC LIMIT 50',
        args: []
      })

      results.rows.reverse().forEach(row => {
        socket.emit('message', {
          body: row.body,
          from: row.username,
          userId: row.userId,
        })
      })
    } catch (error) {
      console.error('Error recovering messages:', error.message)
    }
  }

  // Handle disconnect - only for authenticated users
  socket.on('disconnect', () => {
    if (!socket.isAnonymous) {
      onlineUsers.delete(socket.userId)
      io.emit('onlineUsers', Array.from(onlineUsers.values()))
    }
  })
})

// Error handlers
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('Port 3000 is already in use. Please stop other instances or change the port.')
    process.exit(1)
  } else {
    console.error('Server error:', error)
  }
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
