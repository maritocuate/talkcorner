import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
import { z } from 'zod'

// Validation schemas
const authSchema = z.object({
  userName: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  userId: z.string().uuid('Invalid user ID format'),
  serverOffset: z.number().int().min(0).optional().default(0)
})

const messageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(2000, 'Message is too long (max 2000 characters)')
  .trim()

const usernameUpdateSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens')
  .trim()

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
})

// INIT DATABASE
dotenv.config()

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    userId TEXT,
    body TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// END DATABASE

const onlineUsers = []
io.on('connection', async socket => {
  // Validate authentication data
  const authResult = authSchema.safeParse(socket.handshake.auth)

  if (!authResult.success) {
    console.warn('⚠️ Invalid authentication attempt:', authResult.error.errors)
    socket.emit('validation-error', { message: 'Invalid authentication data', errors: authResult.error.errors })
    socket.disconnect()
    return
  }

  const { userName, userId, serverOffset } = authResult.data

  onlineUsers.push({ userId, userName })
  io.emit('onlineUsers', onlineUsers)

  socket.on('message', async body => {
    // Validate message
    const messageResult = messageSchema.safeParse(body)

    if (!messageResult.success) {
      console.warn('⚠️ Invalid message from', userName, ':', messageResult.error.errors[0].message)
      socket.emit('validation-error', { message: messageResult.error.errors[0].message })
      return
    }

    const sanitizedMessage = messageResult.data

    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (username, userId, body) VALUES (:username, :userId, :message)',
        args: { username: userName, userId: userId, message: sanitizedMessage },
      })
    } catch (error) {
      console.error('❌ Database error:', error.message)
      socket.emit('validation-error', { message: 'Failed to send message' })
      return
    }

    socket.broadcast.emit('message', {
      body,
      from: userName,
      userId: userId,
    })
  })

  socket.on('update-username', (newUserName) => {
    // Validate new username
    const usernameResult = usernameUpdateSchema.safeParse(newUserName)

    if (!usernameResult.success) {
      console.warn('⚠️ Invalid username update attempt by', userName, ':', usernameResult.error.errors[0].message)
      socket.emit('validation-error', { message: usernameResult.error.errors[0].message })
      return
    }

    const sanitizedUsername = usernameResult.data
    const oldUserName = socket.handshake.auth.userName
    socket.handshake.auth.userName = sanitizedUsername

    // Update in onlineUsers list
    const userIndex = onlineUsers.findIndex(u => u.userId === userId)
    if (userIndex !== -1) {
      onlineUsers[userIndex].userName = sanitizedUsername
    }

    // Broadcast to all clients
    io.emit('onlineUsers', onlineUsers)
    io.emit('username-updated', { userId, oldUserName, newUserName: sanitizedUsername })
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: 'SELECT * FROM messages WHERE id > ?',
        args: [serverOffset],
      })

      results.rows.forEach(row => {
        socket.emit('message', {
          body: row.body,
          from: row.username,
          userId: row.userId,
        })
      })
    } catch (error) {
      console.error('❌ Error recovering messages:', error.message)
    }
  }

  socket.on('disconnect', () => {
    const index = onlineUsers.findIndex(u => u.userId === userId)
    if (index !== -1) {
      onlineUsers.splice(index, 1)
      io.emit('onlineUsers', onlineUsers)
    }
  })
})

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>HW  </h1>')
})

// Error handling for server
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('❌ Port 3000 is already in use. Please stop other instances or change the port.')
    process.exit(1)
  } else {
    console.error('❌ Server error:', error)
  }
})

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  // Don't exit, just log
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  // Don't exit, just log
})

server.listen(process.env.PORT || 3000, () => {
  console.log('✅ Server listening on port 3000')
})
