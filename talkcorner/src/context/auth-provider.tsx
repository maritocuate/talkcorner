import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User } from '../types/User'

interface AuthContextType {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

        // Check if user is authenticated
        fetch(`${apiUrl}/auth/me`, {
            credentials: 'include' // Send cookies
        })
            .then(res => {
                if (!res.ok) throw new Error('Not authenticated')
                return res.json()
            })
            .then((data: User) => {
                setUser(data)
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const logout = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

        try {
            await fetch(`${apiUrl}/auth/logout`, {
                credentials: 'include'
            })
            setUser(null)
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
