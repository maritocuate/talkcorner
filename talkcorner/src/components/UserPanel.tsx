import { useEffect, useState } from 'react'
import { Message } from '@/interfaces'
import { Socket } from 'socket.io-client'
import FormChat from './FormChat'
import Messages from './Messages'

export default function UserPanel({ socket }: { socket: Socket }) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  const receiveMessage = (message: Message, serverOffset: number) => {
    setMessages(prev => [...prev, message])
    ;(socket.auth as any).serverOffset = serverOffset
  }

  const handleSubmit = (message: string) => {
    const newMessage: Message = {
      body: message,
      from: (socket.auth as any).userName,
    }

    setMessages(prev => [...prev, newMessage])
    socket.emit('message', newMessage.body)
  }

  return (
    <div className="flex flex-col justify-end h-full">
      <Messages messages={messages} />
      <FormChat onSubmit={handleSubmit} />
    </div>
  )
}
