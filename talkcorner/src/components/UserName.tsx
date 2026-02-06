import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSocket } from '@/context/socket-provider'

interface UserNameProps {
  username: string
}

// Same validation as backend
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/
const MIN_LENGTH = 3
const MAX_LENGTH = 20

export default function UserName({
  username,
}: UserNameProps) {
  const { updateUsername } = useSocket()
  const [editing, setEditing] = useState<boolean>(false)
  const [currentName, setCurrentName] = useState<string>(username)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setCurrentName(username)
  }, [username])

  const validateUsername = (name: string): string | null => {
    if (name.length < MIN_LENGTH) {
      return `Username must be at least ${MIN_LENGTH} characters`
    }
    if (name.length > MAX_LENGTH) {
      return `Username must be at most ${MAX_LENGTH} characters`
    }
    if (!USERNAME_REGEX.test(name)) {
      return 'Username can only contain letters, numbers, underscores and hyphens'
    }
    return null
  }

  const saveEdit = () => {
    setError('')

    // Validate username
    const validationError = validateUsername(currentName)
    if (validationError) {
      setError(validationError)
      // Revert to previous username
      const prevName = localStorage.getItem('local-username')
      setCurrentName(prevName || username)
      setTimeout(() => setError(''), 3000) // Clear error after 3s
      return
    }

    setEditing(false)
    if (localStorage.getItem('local-username') !== currentName) {
      updateUsername(currentName)
    }
  }

  return (
    <div className="flex flex-col">
      <h2 className="flex items-center gap-2 text-primary text-3xl font-bold mb-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {editing ? (
          <input
            className="bg-transparent"
            type="text"
            value={currentName}
            maxLength={20}
            autoFocus
            onBlur={saveEdit}
            onChange={e => {
              setCurrentName(e.target.value)
            }}
          />
        ) : (
          <span onClick={() => setEditing(true)}>{currentName}</span>
        )}

        <Pencil size={15} className="text-muted-foreground" />
      </h2>

      {error && (
        <p className="text-red-500 text-sm -mt-2 mb-2">
          {error}
        </p>
      )}
    </div>
  )
}
