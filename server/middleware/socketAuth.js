import jwt from 'jsonwebtoken'

export const socketAuthMiddleware = (socket, next) => {
    // Parse cookies from handshake headers
    const cookies = socket.handshake.headers.cookie

    if (!cookies) {
        return next(new Error('Authentication required'))
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

    if (!token) {
        return next(new Error('Authentication required'))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.userId = decoded.userId
        socket.email = decoded.email
        socket.displayName = decoded.displayName
        socket.photo = decoded.photo
        next()
    } catch (err) {
        next(new Error('Invalid token'))
    }
}
