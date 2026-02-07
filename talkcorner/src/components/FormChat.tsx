import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface MessageFormProps {
  onSubmit: (message: string) => void
  isAuthenticated: boolean
  onLoginRequired: () => void
}

const FormChat: React.FC<MessageFormProps> = ({
  onSubmit,
  isAuthenticated,
  onLoginRequired
}) => {
  const [message, setMessage] = useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message) return

    if (!isAuthenticated) {
      onLoginRequired()
      return
    }

    onSubmit(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-4 pb-4 md:px-0 md:pb-5">
      {
        isAuthenticated && (
          <Input
            placeholder={"Enter message"}
            onChange={e => setMessage(e.target.value)}
            value={message}
            autoFocus={isAuthenticated}
          />
        )
      }
      <Button
        className={`secondary ${!isAuthenticated ? 'w-full' : ''}`}
        type={isAuthenticated ? "submit" : "button"}
        onClick={!isAuthenticated ? onLoginRequired : undefined}
      >
        {isAuthenticated ? 'Send' : 'Login to send messages'}
      </Button>
    </form>
  )
}

export default FormChat
