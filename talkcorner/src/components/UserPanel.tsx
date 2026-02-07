import { useEffect, useState } from 'react'
import { Message } from '@/interfaces'
import FormChat from './FormChat'
import Messages from './Messages'
import { useSocket } from '@/context/socket-provider'
import { useAuth } from '@/context/auth-provider'

export default function UserPanel() {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!socket) return

    const receiveMessage = (message: Message) => {
      setMessages(prev => [...prev, message])
    }

    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [socket])

  const handleSubmit = (message: string) => {
    if (!socket || !user) return

    const newMessage: Message = {
      body: message,
      from: user.displayName,
      userId: user.userId,
    }

    setMessages(prev => [...prev, newMessage])
    socket.emit('message', newMessage.body)
  }

  if (!socket) return <div>Connecting...</div>

  return (
    <div className="flex flex-col justify-end h-full md:p-6 md:h-screen">
      <Messages messages={messages} />
      <FormChat onSubmit={handleSubmit} />
    </div>
  )
}
