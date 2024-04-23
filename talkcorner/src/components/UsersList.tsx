import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useToast } from '@/components/ui/use-toast'

const socket = io('https://glib-chief-august.glitch.me')

export default function UsersList() {
  const [onlineUsers, setOnlineUsers] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    socket.on('onlineUsers', users => {
      setOnlineUsers(users)

      const userName = users[users.length - 1].slice(0, 6)
      toast({
        description: `${userName} joined the room`,
      })
    })

    return () => {
      socket.off('onlineUsers', setOnlineUsers)
    }
  }, [toast])

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
