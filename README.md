# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 💰 Finance Tracker - Full Stack Application

Eine moderne Full-Stack-Anwendung für Finanztracking mit React Frontend und Node.js Backend, optimiert für **Bun**.

## 🏗️ Projektstruktur

```
finance_tracker_with_react/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   ├── pages/        # Seiten (Login, Register, etc.)
│   │   ├── context/      # React Context (Auth)
│   │   └── styles/       # CSS Dateien
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/  # API Controller
│   │   ├── models/       # MongoDB Models
│   │   ├── routes/       # Express Routes
│   │   ├── middleware/   # Auth Middleware
│   │   └── types/        # TypeScript Types
│   └── package.json
├── package.json       # Root Scripts für gesamtes Projekt
└── README.md
```

## 🚀 Schnellstart mit Bun

### Voraussetzungen
- [Bun](https://bun.sh/) (>= 1.0.0)
- [MongoDB Atlas](https://www.mongodb.com/atlas) Account

### Installation & Setup

1. **Alle Dependencies installieren:**
   ```bash
   bun run install:all
   ```

2. **Backend Environment konfigurieren:**
   ```bash
   cd backend
   cp .env.example .env
   # Bearbeite .env mit deinen MongoDB-Zugangsdaten
   ```

3. **Beide Services gleichzeitig starten:**
   ```bash
   bun dev
   ```

### Einzeln starten:

**Frontend:** (Port 5173)
```bash
bun run dev:frontend
```

**Backend:** (Port 5000)
```bash
bun run dev:backend
```

## 🔧 Verfügbare Scripts

| Script | Beschreibung |
|--------|-------------|
| `bun dev` | Startet Frontend & Backend gleichzeitig |
| `bun run dev:frontend` | Nur Frontend (React + Vite) |
| `bun run dev:backend` | Nur Backend (Node.js + Express) |
| `bun run build` | Baut beide Projekte für Production |
| `bun run install:all` | Installiert alle Dependencies |
| `bun run clean` | Löscht alle node_modules und dist Ordner |
| `bun run lint` | Führt ESLint auf Frontend aus |
| `bun run test` | Führt Tests für Backend und Frontend aus |

## 🛠️ Technologien

### Frontend
- **React 18** mit TypeScript
- **Vite** für ultra-schnelles Development
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Context API** für State Management

### Backend
- **Node.js** mit **Express**
- **TypeScript** für Type Safety
- **MongoDB** mit **Mongoose**
- **JWT** für Authentication
- **bcrypt** für Password Hashing
- **CORS** für Cross-Origin Requests

### Development Tools
- **Bun** als Runtime & Package Manager
- **ESLint** für Code Quality
- **Nodemon** für Backend Hot Reload
- **concurrently** für gleichzeitiges Starten

## 🔐 Authentication

Das System implementiert JWT-basierte Authentifizierung mit:
- ✅ Registrierung neuer Benutzer
- ✅ Login/Logout Funktionalität
- ✅ Geschützte Routen
- ✅ HTTP-Only Cookies für Sicherheit
- ✅ Passwort-Hashing mit bcrypt

## 📱 Features

- **Responsive Design** für alle Geräte
- **Echtzeitvalidierung** bei Formulareingaben
- **Fehlerbehandlung** mit spezifischen Meldungen
- **Loading States** für bessere UX
- **Passwort-Sichtbarkeit** Toggle
- **Automatische Navigation** nach Login/Register

## 🌟 Warum Bun?

- **⚡ 3x schneller** als npm bei Package Installation
- **🔥 Native TypeScript** Support ohne zusätzliche Tools
- **📦 Eingebauter Bundler** und Test Runner
- **🚀 Optimierte Performance** für moderne JavaScript
- **🔄 Hot Reload** out-of-the-box

## 📝 Development Notes

- Frontend läuft auf `http://localhost:5173`
- Backend API läuft auf `http://localhost:5000`
- MongoDB Atlas wird für die Datenbank verwendet
- Alle API-Routen sind unter `/api/auth/` verfügbar

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 🏗️ Projekt-Struktur

```
finance_tracker_with_react/
├── frontend/          # React TypeScript Frontend
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── context/       # React Context (Auth, etc.)
│   │   ├── styles/        # CSS Styles
│   │   └── assets/        # Statische Assets
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js Express Backend
│   ├── src/
│   │   ├── controllers/   # Route Controller
│   │   ├── models/        # MongoDB Models
│   │   ├── routes/        # API Routes
│   │   ├── middleware/    # Express Middleware
│   │   └── types/         # TypeScript Types
│   ├── package.json
│   └── .env
├── package.json       # Root package.json für Scripts
└── README.md
```

## 🚀 Schnellstart

### Alle Abhängigkeiten installieren
```bash
npm run install:all
```

### Entwicklung starten (Frontend + Backend)
```bash
npm run dev
```

### Nur Frontend starten
```bash
npm run dev:frontend
```

### Nur Backend starten
```bash
npm run dev:backend
```

## 🔧 Technologie-Stack

### Frontend
- **React 18** mit TypeScript
- **Vite** für schnelles Development
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Context API** für State Management

### Backend
- **Node.js** mit TypeScript
- **Express.js** Web Framework
- **MongoDB** mit Mongoose ODM
- **JWT** für Authentication
- **bcrypt** für Passwort-Hashing
- **CORS** für Cross-Origin Requests

## 🔐 Authentifizierung

Das System verwendet JWT (JSON Web Tokens) mit HTTP-Only Cookies für sichere Authentifizierung:

- **Registrierung**: Neue Benutzer können sich registrieren
- **Login**: Authentifizierung mit E-Mail und Passwort
- **Geschützte Routen**: Nur eingeloggte Benutzer können auf bestimmte Bereiche zugreifen
- **Auto-Logout**: Tokens haben eine begrenzte Lebensdauer

## 🌍 Umgebungsvariablen

Erstellen Sie eine `.env` Datei im `backend/` Ordner:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 📱 Features

- ✅ Benutzer-Registrierung und -Anmeldung
- ✅ Passwort-Validierung mit Sicherheitsanforderungen
- ✅ Responsive Design
- ✅ Passwort-Sichtbarkeit Toggle
- ✅ Eingabe-Validierung mit spezifischen Fehlermeldungen
- ✅ Geschützte Routen
- 🔄 Transaction Management (in Entwicklung)
- 🔄 Expense Tracking (in Entwicklung)
- 🔄 Investment Tracking (in Entwicklung)
- 🔄 Crypto Portfolio (in Entwicklung)

## 🛠️ Entwicklung

### Ports
- **Frontend**: http://localhost:5173 (oder nächster verfügbarer Port)
- **Backend**: http://localhost:5000

### API Endpoints
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `POST /api/auth/logout` - Benutzer abmelden
- `GET /api/auth/profile` - Benutzerprofil abrufen (geschützt)
- `GET /api/auth/verify` - Token validieren (geschützt)

## 📦 Deployment

### Frontend Build
```bash
npm run build:frontend
```

### Backend Build
```bash
npm run build:backend
```

### Beide builds
```bash
npm run build
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
