import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/auth-provider'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'

export default function UserName() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.photo || "https://github.com/shadcn.png"} alt={user.displayName} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-bold text-primary">
            {user.displayName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        title="Logout"
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={20} />
      </Button>
    </div>
  )
}
