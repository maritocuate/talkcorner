import './App.css'
import { useState } from 'react'
import { ThemeProvider } from './components/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Menu } from 'lucide-react'

import UserPanel from './components/UserPanel'
import UsersList from './components/UsersList'
import MobileSidebar from './components/MobileSidebar'
import { useMediaQuery } from './hooks/use-media-query'
import { SocketProvider } from './context/socket-provider'
import { AuthProvider, useAuth } from './context/auth-provider'
import { Button } from './components/ui/button'
import Login from './pages/Login'

function ChatInterface() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <SocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {!isDesktop ? (
          <div className="h-screen relative md:hidden">
            {/* Botón flotante para abrir sidebar */}
            <Button
              variant="default"
              size="icon"
              className="absolute top-4 left-4 z-30"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>

            {/* Sidebar móvil */}
            <MobileSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Chat a pantalla completa sin padding */}
            <UserPanel />
          </div>
        ) : (
          <ResizablePanelGroup
            className="hidden md:block h-screen"
            direction="horizontal"
          >
            <ResizablePanel minSize={25}>
              <UsersList />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel className="p-6" minSize={30}>
              <UserPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </ThemeProvider>
    </SocketProvider>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <ChatInterface />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
