import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { db } from './database.js'

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id
            const email = profile.emails[0].value
            const displayName = profile.displayName
            const photo = profile.photos[0]?.value

            // Check if user exists
            const existingUser = await db.execute({
                sql: 'SELECT * FROM users WHERE google_id = ?',
                args: [googleId]
            })

            let user
            if (existingUser.rows.length > 0) {
                user = existingUser.rows[0]
            } else {
                // Create new user
                const result = await db.execute({
                    sql: 'INSERT INTO users (google_id, email, display_name, photo) VALUES (?, ?, ?, ?)',
                    args: [googleId, email, displayName, photo]
                })
                user = {
                    id: Number(result.lastInsertRowid),
                    google_id: googleId,
                    email,
                    display_name: displayName,
                    photo
                }
            }

            done(null, user)
        } catch (error) {
            console.error('Error in Google Strategy:', error)
            done(error, null)
        }
    }))
}
