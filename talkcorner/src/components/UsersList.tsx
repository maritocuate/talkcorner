import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { useToast } from '@/components/ui/use-toast'
import { ModeToggle } from './mode-toggle'
import { Pencil, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function UsersList({ socket }: { socket: Socket }) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    socket.on('onlineUsers', users => {
      const filteredUsers: string[] = users.filter(
        (user: string) => user !== null
      )
      const uniqueArray: string[] = [...new Set(filteredUsers)]
      setOnlineUsers(uniqueArray)

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

  return (
    <div className="text-left p-2">
      <h2 className="flex items-center gap-2 text-primary text-3xl font-bold mb-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {(socket.auth as any).userName}
        <Pencil size={15} className="text-muted-foreground" />
      </h2>
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
