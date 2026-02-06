import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ModeToggle } from './mode-toggle'
import { User } from 'lucide-react'
import UserName from './UserName'
import { useSocket } from '@/context/socket-provider'

export default function UsersList() {
  const { socket } = useSocket()
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; userName: string }>>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!socket) return

    socket.on('onlineUsers', users => {
      const filterUsers = (
        userList: Array<{ userId: string; userName: string }>
      ): Array<{ userId: string; userName: string }> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUserId = (socket.auth as any).userId
        return userList.filter((user) => user.userId !== currentUserId)
      }

      const filteredUsers = filterUsers(users)
      setOnlineUsers(filteredUsers)

      toast({
        description: `${users[users.length - 1]?.userName || 'Someone'} joined the chat`,
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      })
    })

    return () => {
      socket.off('onlineUsers')
    }
  }, [socket, toast])

  if (!socket) return <div>Loading...</div>

  return (
    <div className="text-left p-2">
      <UserName
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        username={(socket.auth as any).userName}
      />

      <p className="text-muted-foreground font-semibold mb-3">
        <span className="mr-3">Online Users {onlineUsers.length}</span>
        <ModeToggle />
      </p>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.userId} className="flex gap-2">
            <User size={22} className="text-primary" />
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  )
}
