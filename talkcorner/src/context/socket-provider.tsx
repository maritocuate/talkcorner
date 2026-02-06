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
    updateUsername: (newUserName: string) => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    updateUsername: () => { },
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

        // Generate or retrieve userId (persistent across sessions)
        let userId = localStorage.getItem('local-userId')
        if (!userId) {
            userId = crypto.randomUUID()
            localStorage.setItem('local-userId', userId)
        }

        // Initialize socket
        const socketInstance = io(
            import.meta.env.VITE_SOCKET || 'http://localhost:3000',
            {
                auth: {
                    serverOffset: 0,
                    userName: userName,
                    userId: userId,
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

    const updateUsername = (newUserName: string) => {
        if (socket) {
            localStorage.setItem('local-username', newUserName)
            socket.emit('update-username', newUserName)
        }
    }

    return (
        <SocketContext.Provider value={{ socket, isConnected, updateUsername }}>
            {children}
        </SocketContext.Provider>
    )
}
