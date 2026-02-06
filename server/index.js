import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

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
  const userName = socket.handshake.auth.userName
  const userId = socket.handshake.auth.userId

  onlineUsers.push({ userId, userName })
  io.emit('onlineUsers', onlineUsers)

  socket.on('message', async body => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (username, userId, body) VALUES (:username, :userId, :message)',
        args: { username: userName, userId: userId, message: body },
      })
    } catch (error) {
      console.error(error)
      return
    }

    socket.broadcast.emit('message', {
      body,
      from: userName,
      userId: userId,
    })
  })

  socket.on('update-username', (newUserName) => {
    const oldUserName = socket.handshake.auth.userName
    socket.handshake.auth.userName = newUserName

    // Update in onlineUsers list
    const userIndex = onlineUsers.findIndex(u => u.userId === userId)
    if (userIndex !== -1) {
      onlineUsers[userIndex].userName = newUserName
    }

    // Broadcast to all clients
    io.emit('onlineUsers', onlineUsers)
    io.emit('username-updated', { userId, oldUserName, newUserName })
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: 'SELECT * FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset || 0],
      })

      results.rows.forEach(row => {
        socket.emit('message', {
          body: row.body,
          from: row.username,
          userId: row.userId,
        })
      })
    } catch (error) {
      console.error(error)
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

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on 3000')
})
