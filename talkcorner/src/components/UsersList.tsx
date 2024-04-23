import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('https://glib-chief-august.glitch.me')

export default function UsersList() {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    socket.on('onlineUsers', users => {
      setOnlineUsers(users)
    })

    return () => {
      socket.off('onlineUsers')
    }
  }, [])

  return (
    <div>
      <h1>Online Users: {onlineUsers.length}</h1>
      <ul>
        {onlineUsers.map((userId: string) => (
          <li key={userId}>{userId.slice(0, 6)}</li>
        ))}
      </ul>
    </div>
  )
}
