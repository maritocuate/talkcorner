import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { useToast } from '@/components/ui/use-toast'
import { ModeToggle } from './mode-toggle'
import { User } from 'lucide-react'
import UserName from './UserName'

export default function UsersList({ socket }: { socket: Socket }) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    socket.on('onlineUsers', users => {
      const filteredUsers: string[] = filterUsers(users)
      setOnlineUsers(filteredUsers)

      toast({
        description: `${users[users.length - 1]} joined the chat`,
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      })
    })

    return () => {
      socket.off('onlineUsers')
    }
  }, [socket, toast])

  const filterUsers = (users: string[]): string[] => {
    const filteredUsers: string[] = users.filter(
      (user: string) => user !== null
    )
    const uniqueArray: string[] = [...new Set(filteredUsers)]
    const deleteCurrentUser = uniqueArray.filter(
      (user: string) => user !== (socket.auth as any).userName
    )
    return deleteCurrentUser
  }

  const handleUserNameChange = (newUserName: string) => {
    ;(socket.auth as any).userName = newUserName
  }

  return (
    <div className="text-left p-2">
      <UserName
        username={(socket.auth as any).userName}
        onUserNameChange={handleUserNameChange}
      />

      <p className="text-muted-foreground font-semibold mb-3">
        <span className="mr-3">Online Users {onlineUsers.length}</span>
        <ModeToggle />
      </p>
      <ul>
        {onlineUsers.map((userId: string, index: number) => (
          <li key={index} className="flex gap-2">
            <User size={22} className="text-primary" />
            {userId}
          </li>
        ))}
      </ul>
    </div>
  )
}
