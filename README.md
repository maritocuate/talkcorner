# TalkCorner - Real-time Chat Application

Aplicación de chat en tiempo real con autenticación OAuth 2.0 de Google.

## 🚀 Características

- ✅ Autenticación segura con Google OAuth 2.0
- ✅ Chat en tiempo real con Socket.io
- ✅ Tokens JWT en cookies httpOnly
- ✅ Validación de inputs con Zod
- ✅ UI responsiva con React + Vite
- ✅ Base de datos Turso (LibSQL)

## 📁 Estructura del Proyecto

```
talkcorner/
├── server/
│   ├── config/
│   │   ├── database.js      # Configuración de base de datos
│   │   └── passport.js      # Configuración de Google OAuth
│   ├── middleware/
│   │   └── socketAuth.js    # Middleware JWT para Socket.io
│   ├── routes/
│   │   └── auth.js          # Rutas de autenticación
│   └── index.js             # Servidor principal
├── talkcorner/              # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── auth-provider.tsx
│   │   │   └── socket-provider.tsx
│   │   ├── pages/
│   │   │   └── Login.tsx
│   │   └── types/
│   │       └── User.ts
│   └── ...
├── .env                     # Variables de entorno (no en git)
├── .env.example             # Template de variables
└── package.json
```

## ⚙️ Setup

### 1. Instalar dependencias

```bash
# Backend
npm install

# Frontend
cd talkcorner
npm install
```

### 2. Configurar Google OAuth

Sigue las instrucciones en `google_oauth_setup.md` para:
1. Crear un proyecto en Google Cloud Console
2. Configurar OAuth consent screen
3. Obtener Client ID y Client Secret

### 3. Variables de entorno

Copia `.env.example` a `.env` y completa:

```bash
# Database (Turso)
DATABASE_URL="your-turso-url"
DATABASE_AUTH_TOKEN="your-turso-token"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Security (genera strings aleatorios)
SESSION_SECRET="random-string-here"
JWT_SECRET="another-random-string"

# URLs
CLIENT_URL="http://localhost:5173"
PORT=3000
```

**Generar secrets aleatorios:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Ejecutar aplicación

**Backend (puerto 3000):**
```bash
npm run dev
```

**Frontend (puerto 5173):**
```bash
cd talkcorner
npm run dev
```

Abre `http://localhost:5173` y haz login con Google.

## 🔐 Seguridad

### Implementado

- ✅ OAuth 2.0 con Google
- ✅ JWT tokens en cookies httpOnly
- ✅ Validación de inputs (Zod)
- ✅ Socket.io protegido con JWT
- ✅ CORS configurado

### Pendiente

- ⏳ Rate limiting
- ⏳ Security headers (Helmet.js)
- ⏳ Actualizar dependencias vulnerables

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js + Express
- Socket.io
- Passport.js (Google OAuth)
- JWT (jsonwebtoken)
- Zod (validación)
- Turso/LibSQL (base de datos)

**Frontend:**
- React 19 + TypeScript
- Vite
- Socket.io Client
- Zustand (si aplica)
- Styled Components

## 📝 Scripts

```bash
# Backend
npm run dev      # Desarrollo con nodemon
npm start        # Producción

# Frontend (en /talkcorner)
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
lsof -i :3000
kill <PID>
```

### "No auth token found"
- Verifica que las credenciales de Google estén en `.env`
- Asegúrate que el redirect URI en Google Cloud Console sea: `http://localhost:3000/auth/google/callback`

### "Missing required parameter: scope"
- Verifica OAuth consent screen en Google Cloud Console
- Asegúrate que los scopes estén configurados

## 📄 Licencia

ISC
