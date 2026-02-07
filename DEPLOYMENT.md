# Deployment Guide - TalkCorner

Guía para deployar TalkCorner en producción (Render.com + Vercel).

## 🚀 Backend - Render.com

### 1. Variables de Entorno

En Render.com Dashboard → tu servicio → Environment:

```bash
# Database (Turso)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-token

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Security
SESSION_SECRET=your-random-secret-here
JWT_SECRET=your-random-jwt-secret

# URLs - ⚠️ IMPORTANTE
CLIENT_URL=https://talkcorner.vercel.app
NODE_ENV=production
PORT=3000
```

**⚠️ Importante**: `CLIENT_URL` debe ser la URL de tu frontend en Vercel **sin trailing slash**.

### 2. Google Cloud Console - Redirect URI

En Google Cloud Console → APIs & Services → Credentials → tu OAuth Client:

**Authorized redirect URIs**:
- Desarrollo: `http://localhost:3000/auth/google/callback`
- **Producción**: `https://tu-backend.onrender.com/auth/google/callback`

Ejemplo: `https://talkcorner-api.onrender.com/auth/google/callback`

### 3. Build Settings en Render

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 o superior

---

## 🎨 Frontend - Vercel

### 1. Variables de Entorno

En Vercel Dashboard → tu proyecto → Settings → Environment Variables:

```bash
VITE_API_URL=https://tu-backend.onrender.com

# Solo si usas un socket URL diferente (opcional)
VITE_SOCKET=https://tu-backend.onrender.com
```

**⚠️ Importante**: La URL **no** debe tener trailing slash.

Ejemplo: `https://talkcorner-api.onrender.com`

### 2. Build Settings

Vercel detecta automáticamente Vite, pero si necesitas configurar manualmente:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. CORS Configuration

El backend ya tiene CORS configurado dinámicamente usando `CLIENT_URL`. Asegúrate que:
1. `CLIENT_URL` en Render apunte a tu dominio de Vercel
2. No incluya trailing slash
3. Use `https://` (no `http://`)

---

## 🔐 Verificación de Seguridad

### Backend (Render.com)

Verifica que estas variables estén configuradas:

```bash
NODE_ENV=production
CLIENT_URL=https://talkcorner.vercel.app  # Tu frontend
```

### Frontend (Vercel)

Verifica que esta variable esté configurada:

```bash
VITE_API_URL=https://talkcorner-api.onrender.com  # Tu backend
```

---

## 🧪 Testing en Producción

1. **Abre tu frontend en Vercel**: `https://talkcorner.vercel.app`
2. **Click en "Sign in with Google"**
3. **Verifica el flujo**:
   - ✅ Redirige a Google para autenticación
   - ✅ Después de autorizar, vuelve a **tu dominio de Vercel** (no a localhost)
   - ✅ Puedes enviar mensajes
   - ✅ Logout funciona

---

## 🐛 Troubleshooting

### Problema: Redirige a localhost después de OAuth

**Causa**: `CLIENT_URL` en Render no está configurado correctamente.

**Solución**:
1. Ve a Render.com → Environment
2. Verifica que `CLIENT_URL=https://talkcorner.vercel.app`
3. Reinicia el servicio

### Problema: "redirect_uri_mismatch"

**Causa**: Google Cloud Console no tiene la URL correcta.

**Solución**:
1. Ve a Google Cloud Console → Credentials
2. En "Authorized redirect URIs" agrega:
   `https://tu-backend.onrender.com/auth/google/callback`

### Problema: CORS error

**Causa**: `CLIENT_URL` y `VITE_API_URL` no coinciden o tienen trailing slashes.

**Solución**:
- Backend `CLIENT_URL`: `https://talkcorner.vercel.app`
- Frontend `VITE_API_URL`: `https://talkcorner-api.onrender.com`
- Sin `/` al final

### Problema: Socket.io no conecta

**Solución**:
1. Verifica que Render.com permita conexiones WebSocket
2. Asegúrate que `VITE_API_URL` esté configurado en Vercel
3. socket-provider.tsx ya usa `withCredentials: true` y la URL correcta

---

## 📝 Checklist de Deploy

### Backend (Render.com)

- [ ] Todas las variables de entorno configuradas
- [ ] `CLIENT_URL` apunta a Vercel (sin trailing slash)
- [ ] `NODE_ENV=production`
- [ ] Build exitoso
- [ ] Servicio corriendo

### Frontend (Vercel)

- [ ] `VITE_API_URL` apunta a Render (sin trailing slash)
- [ ] Build exitoso
- [ ] Deploy exitoso

### Google Cloud Console

- [ ] Redirect URI de **producción** agregado
- [ ] Redirect URI: `https://tu-backend.onrender.com/auth/google/callback`

### Testing

- [ ] Login con Google funciona
- [ ] Redirige a Vercel (no a localhost)
- [ ] Mensajes se envían correctamente
- [ ] Socket.io conecta
- [ ] Logout funciona

---

## 🎉 Deploy Completado

Si todos los checkboxes están marcados, tu aplicación debería estar funcionando correctamente en producción.

**URLs**:
- Frontend: `https://talkcorner.vercel.app`
- Backend API: `https://tu-backend.onrender.com`
- Google OAuth Callback: `https://tu-backend.onrender.com/auth/google/callback`
