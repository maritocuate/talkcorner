import { useEffect, useState } from 'react'
import { Message } from '@/interfaces'
import FormChat from './FormChat'
import Messages from './Messages'
import io from 'socket.io-client'

const socket = io('https://glib-chief-august.glitch.me')

export default function UserPanel() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  const receiveMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const handleSubmit = (message: string) => {
    const newMessage: Message = {
      body: message,
      from: 'Me',
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
