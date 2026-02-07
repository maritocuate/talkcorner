import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

// Initiate OAuth flow
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent'
    })
)

// OAuth callback
router.get('/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: process.env.CLIENT_URL
    }),
    (req, res) => {
        try {
            // Generate JWT
            const token = jwt.sign(
                {
                    userId: req.user.google_id,
                    email: req.user.email,
                    displayName: req.user.display_name,
                    photo: req.user.photo
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            const isProduction = process.env.NODE_ENV === 'production'

            // Set httpOnly cookie
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: isProduction, // true in production (HTTPS required)
                sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            console.error('Error in OAuth callback:', error)
            res.redirect(process.env.CLIENT_URL)
        }
    }
)

// Logout
router.get('/auth/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production'

    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    })
    res.json({ success: true })
})

// Get current user
router.get('/auth/me', (req, res) => {
    const token = req.cookies.auth_token

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json(decoded)
    } catch (err) {
        const isProduction = process.env.NODE_ENV === 'production'

        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        })
        res.status(401).json({ error: 'Invalid token' })
    }
})

export default router
