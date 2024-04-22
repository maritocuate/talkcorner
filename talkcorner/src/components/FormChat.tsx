import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface MessageFormProps {
  onSubmit: (message: string) => void
}

const FormChat: React.FC<MessageFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Enter message"
        onChange={e => setMessage(e.target.value)}
        value={message}
        autoFocus
      />
      <Button>Send</Button>
    </form>
  )
}

export default FormChat
