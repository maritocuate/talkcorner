import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'

const socket = io('/')

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  const receiveMessage = (message: string) => {
    setMessages(prev => [message, ...prev])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newMessage = {
      body: message,
      from: 'Me',
    }

    setMessages(prev => [newMessage, ...prev])
    setMessage('')
    socket.emit('message', newMessage.body)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Enter message"
          onChange={e => setMessage(e.target.value)}
        />
        <Button>Send</Button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <b>{message.from}</b>:{message.body}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
