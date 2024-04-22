import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Message } from './interfaces'

const socket = io('/')

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  const receiveMessage = (message: Message) => {
    setMessages(prev => [message, ...prev])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newMessage: Message = {
      body: message,
      from: 'Me',
    }

    setMessages(prev => [newMessage, ...prev])
    setMessage('')
    socket.emit('message', newMessage.body)
    console.log(messages)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Enter message"
          onChange={e => setMessage(e.target.value)}
          value={message}
          autoFocus
        />
        <Button>Send</Button>
      </form>
      <ul>
        {messages.map((message: Message, index) => (
          <li key={index}>
            <b>{message.from}</b>:{message.body}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
