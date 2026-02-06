import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import io, { Socket } from 'socket.io-client'
import { generateUsername } from 'unique-username-generator'

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
        // Generate or retrieve username
        let userName = localStorage.getItem('local-username')
        if (!userName) {
            userName = generateUsername('-', 0, 15)
            localStorage.setItem('local-username', userName)
        }

        // Initialize socket
        const socketInstance = io(
            import.meta.env.VITE_SOCKET || 'http://localhost:3000',
            {
                auth: {
                    serverOffset: 0,
                    userName: userName,
                },
            }
        )

        socketInstance.on('connect', () => {
            setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false)
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
