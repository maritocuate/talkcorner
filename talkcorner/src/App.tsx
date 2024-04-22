import './App.css'
import { ThemeProvider } from './components/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import UserPanel from './components/UserPanel'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel>Connected users</ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel className="p-6">
          <UserPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ThemeProvider>
  )
}

export default App
