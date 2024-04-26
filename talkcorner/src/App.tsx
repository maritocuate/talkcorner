import './App.css'
import { ThemeProvider } from './components/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import io, { Socket } from 'socket.io-client'
import { generateUsername } from 'unique-username-generator'

import UserPanel from './components/UserPanel'
import UsersList from './components/UsersList'

let userName
if (!localStorage.getItem('local-username')) {
  const randomName = generateUsername('-', 0, 15)
  localStorage.setItem('local-username', randomName)
  userName = randomName
} else {
  userName = localStorage.getItem('local-username')
}

const socket: Socket = io(
  import.meta.env.VITE_SOCKET || 'http://localhost:3000',
  {
    auth: {
      serverOffset: 0,
      userName: userName,
    },
  }
)

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {window.innerWidth < 768 ? (
        <ResizablePanelGroup
          className="md:hidden h-screen"
          direction="vertical"
        >
          <ResizablePanel defaultSize={25}>
            <UsersList socket={socket} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel className="p-6">
            <UserPanel socket={socket} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup
          className="hidden md:block h-screen"
          direction="horizontal"
        >
          <ResizablePanel>
            <UsersList socket={socket} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel className="p-6">
            <UserPanel socket={socket} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </ThemeProvider>
  )
}

export default App
