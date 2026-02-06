import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ModeToggle } from './mode-toggle'
import { User } from 'lucide-react'
import UserName from './UserName'
import { useSocket } from '@/context/socket-provider'

export default function UsersList() {
  const { socket } = useSocket()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!socket) return

    socket.on('onlineUsers', users => {
      const filterUsers = (userList: string[]): string[] => {
        const filtered: string[] = userList.filter(
          (user: string) => user !== null
        )
        const uniqueArray: string[] = [...new Set(filtered)]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUserName = (socket.auth as any).userName
        const deleteCurrentUser = uniqueArray.filter(
          (user: string) => user !== currentUserName
        )
        return deleteCurrentUser
      }

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

  const handleUserNameChange = (newUserName: string) => {
    if (!socket) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ; (socket.auth as any).userName = newUserName
  }

  if (!socket) return <div>Loading...</div>

  return (
    <div className="text-left p-2">
      <UserName
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        username={(socket.auth as any).userName}
        onUserNameChange={handleUserNameChange}
      />

      <p className="text-muted-foreground font-semibold mb-3">
        <span className="mr-3">Online Users {onlineUsers.length}</span>
        <ModeToggle />
      </p>
      <ul>
        {onlineUsers.map((userId: string) => (
          <li key={userId} className="flex gap-2">
            <User size={22} className="text-primary" />
            {userId}
          </li>
        ))}
      </ul>
    </div>
  )
}
