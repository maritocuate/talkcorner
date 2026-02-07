import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ModeToggle } from './mode-toggle'
import { User } from 'lucide-react'
import UserName from './UserName'
import { useSocket } from '@/context/socket-provider'
import { useAuth } from '@/context/auth-provider'

interface OnlineUser {
  displayName: string
  photo?: string
  email: string
}

export default function UsersList() {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!socket) return

    socket.on('onlineUsers', (users: OnlineUser[]) => {
      // Filter out current user from list
      const filteredUsers = users.filter((u) => u.email !== user?.email)
      setOnlineUsers(filteredUsers)

      // Show toast for new user
      if (users.length > 0) {
        toast({
          description: `${users[users.length - 1]?.displayName || 'Someone'} joined the chat`,
          className:
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        })
      }
    })

    return () => {
      socket.off('onlineUsers')
    }
  }, [socket, toast, user])

  if (!socket) return <div>Loading...</div>

  return (
    <div className="text-left p-2">
      <UserName />

      <p className="text-muted-foreground font-semibold mb-3 mt-4">
        <span className="mr-3">Online Users {onlineUsers.length}</span>
        <ModeToggle />
      </p>
      <ul className="space-y-2">
        {onlineUsers.map((onlineUser, index) => (
          <li key={`${onlineUser.email}-${index}`} className="flex gap-2 items-center">
            <User size={22} className="text-primary" />
            <span>{onlineUser.displayName}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
