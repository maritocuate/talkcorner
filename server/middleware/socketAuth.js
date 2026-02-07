import jwt from 'jsonwebtoken'

export const socketAuthMiddleware = (socket, next) => {
    // Parse cookies from handshake headers
    const cookies = socket.handshake.headers.cookie

    // No cookies - allow anonymous connection
    if (!cookies) {
        socket.isAnonymous = true
        return next()
    }

    // Extract auth_token from cookies
    const cookieArray = cookies.split(';')
    let token = null

    for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'auth_token') {
            token = value
            break
        }
    }

    // No token - allow anonymous connection
    if (!token) {
        socket.isAnonymous = true
        return next()
    }

    // Verify token and attach user data if valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.userId = decoded.userId
        socket.email = decoded.email
        socket.displayName = decoded.displayName
        socket.photo = decoded.photo
        socket.isAnonymous = false
        next()
    } catch (err) {
        // Invalid token - allow anonymous connection
        socket.isAnonymous = true
        next()
    }
}
