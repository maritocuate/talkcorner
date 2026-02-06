import './App.css'
import { ThemeProvider } from './components/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import UserPanel from './components/UserPanel'
import UsersList from './components/UsersList'
import { useMediaQuery } from './hooks/use-media-query'
import { SocketProvider } from './context/socket-provider'

function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <SocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {!isDesktop ? (
          <ResizablePanelGroup
            className="md:hidden h-screen"
            direction="vertical"
          >
            <ResizablePanel defaultSize={25}>
              <UsersList />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel className="p-6">
              <UserPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <ResizablePanelGroup
            className="hidden md:block h-screen"
            direction="horizontal"
          >
            <ResizablePanel>
              <UsersList />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel className="p-6">
              <UserPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
