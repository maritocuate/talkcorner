import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import { Message } from './interfaces'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Messages from './components/Messages'
import FormChat from './components/FormChat'

const socket = io('/')

function App() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  const receiveMessage = (message: Message) => {
    setMessages(prev => [message, ...prev])
  }

  const handleSubmit = (message: string) => {
    const newMessage: Message = {
      body: message,
      from: 'Me',
    }

    setMessages(prev => [newMessage, ...prev])
    socket.emit('message', newMessage.body)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Connected users</ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <FormChat onSubmit={handleSubmit} />

          <Messages messages={messages} />
        </ResizablePanel>
      </ResizablePanelGroup>

      <ModeToggle />
    </ThemeProvider>
  )
}

export default App
