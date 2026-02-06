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
    if (!message) return

    onSubmit(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-4 pb-4 md:px-0 md:pb-5">
      <Input
        placeholder="Enter message"
        onChange={e => setMessage(e.target.value)}
        value={message}
        autoFocus
      />
      <Button className="secondary">Send</Button>
    </form>
  )
}

export default FormChat
