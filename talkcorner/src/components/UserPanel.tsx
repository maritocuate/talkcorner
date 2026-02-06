import { useEffect, useState } from 'react'
import { Message } from '@/interfaces'
import FormChat from './FormChat'
import Messages from './Messages'
import { useSocket } from '@/context/socket-provider'

export default function UserPanel() {
  const { socket } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!socket) return

    const receiveMessage = (message: Message, serverOffset: number) => {
      setMessages(prev => [...prev, message])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (socket.auth as any).serverOffset = serverOffset
    }

    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [socket])

  const handleSubmit = (message: string) => {
    if (!socket) return

    const newMessage: Message = {
      body: message,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      from: (socket.auth as any).userName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (socket.auth as any).userId,
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
