import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import io, { Socket } from 'socket.io-client'

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        console.log('🔌 Initializing socket connection...')

        // Initialize socket - cookies will be sent automatically
        const socketInstance = io(
            import.meta.env.VITE_SOCKET || 'http://localhost:3000',
            {
                withCredentials: true, // This sends cookies automatically
                transports: ['websocket', 'polling']
            }
        )

        socketInstance.on('connect', () => {
            setIsConnected(true)
            console.log('✅ Socket connected')
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false)
            console.log('👋 Socket disconnected')
        })

        socketInstance.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message)
            setIsConnected(false)
        })

        // Handle validation errors from server
        socketInstance.on('validation-error', (error: { message: string }) => {
            console.warn('⚠️ Validation error:', error.message)
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
