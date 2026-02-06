import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSocket } from '@/context/socket-provider'

interface UserNameProps {
  username: string
}

export default function UserName({
  username,
}: UserNameProps) {
  const { updateUsername } = useSocket()
  const [editing, setEditing] = useState<boolean>(false)
  const [currentName, setCurrentName] = useState<string>(username)

  useEffect(() => {
    setCurrentName(username)
  }, [username])

  const saveEdit = () => {
    if (currentName.length < 4) {
      const prevName = localStorage.getItem('local-username')
      setCurrentName(prevName || username)
      return
    }

    setEditing(false)
    if (localStorage.getItem('local-username') !== currentName) {
      updateUsername(currentName)
    }
  }

  return (
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
  )
}
