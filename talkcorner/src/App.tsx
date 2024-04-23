import './App.css'
import { ThemeProvider } from './components/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import io, { Socket } from 'socket.io-client'
import UserPanel from './components/UserPanel'
import UsersList from './components/UsersList'

const socket = io('https://glib-chief-august.glitch.me')
//const socket: Socket = io('http://localhost:3000')

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel>
          <UsersList socket={socket} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel className="p-6">
          <UserPanel socket={socket} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ThemeProvider>
  )
}

export default App
