# Remdo — Todo List PWA

Remdo is a premium MERN stack Todo & Reminder application built to be fully installable as a Progressive Web App (PWA). It features custom alarm triggers, customizable snooze configurations, dynamic interactive components, and offline capability.

## Project Structure

```
todo-list-pwa/
├── client/                          # React (Vite) frontend
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── sw.js                   # Service worker
│   │   └── icons/                  # App icons (192, 512, favicon)
│   ├── src/
│   │   ├── main.jsx                # Entry + SW registration
│   │   ├── App.jsx                 # Main app shell
│   │   ├── index.css               # Full design system
│   │   ├── api/todos.js            # API fetch helpers
│   │   ├── hooks/
│   │   │   ├── useTodos.js         # CRUD state management + Offline cache
│   │   │   └── useAlarm.js         # Alarm checking logic
│   │   ├── utils/time.js           # Date formatting
│   │   └── components/
│   │       ├── Header.jsx          # Brand + install button
│   │       ├── TodoList.jsx        # Active/Completed sections
│   │       ├── TodoItem.jsx        # Card with checkbox + expand
│   │       ├── TodoDetail.jsx      # Expanded info (created, alarm, etc)
│   │       ├── AddTodo.jsx         # Modal form (bottom sheet on mobile)
│   │       ├── ReminderOverlay.jsx # Full-screen alarm UI
│   │       └── InstallPrompt.jsx   # PWA install hook
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── server/                          # Express + MongoDB backend
    ├── config/db.js                 # MongoDB connection
    ├── models/Todo.js               # Mongoose schema
    ├── controllers/todoController.js # CRUD handlers
    ├── routes/todoRoutes.js         # REST API routes
    ├── middleware/errorHandler.js    # Global error handler
    ├── server.js                    # Entry point
    ├── .env.example
    └── package.json
```

---

## How to Run Locally

### 1. Set up MongoDB

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and get your connection string.

### 2. Start the Backend

```bash
cd server
cp .env.example .env
# Edit .env and set MONGO_URI
npm install
npm run dev
```

The backend server starts on `http://localhost:5005` (port modified from 5000 to 5005 to avoid macOS AirPlay Receiver port conflicts).

### 3. Start the Frontend

```bash
cd client
cp .env.example .env
# VITE_API_URL is pre-configured to http://localhost:5005
npm install
npm run dev
```

App opens at `http://localhost:5173`.

---

## Offline Capability

* **Static Caching**: The PWA Service Worker (`sw.js`) caches the application's shell assets (HTML, CSS, JS, manifest, and icons). When you visit the app offline, the page loads instantly from the cache.
* **Data Caching**: Successfully loaded reminders are automatically cached in browser `localStorage`. If you open the app without internet access:
  * The app switches to **Offline Mode** and displays a badge at the top.
  * Your active and completed reminders are loaded from the cache.
  * Active alarms and notifications will trigger at the correct times, fully offline.
* **Adding Reminders**: Creating new reminders requires a network connection to sync with the MongoDB database.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/todos` | List all todos (newest first) |
| `POST` | `/api/todos` | Create a todo |
| `GET` | `/api/todos/:id` | Get a single todo |
| `PUT` | `/api/todos/:id` | Update a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |

---

## Deployment Instructions

### Frontend → Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the following options:
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Environment Variable**: `VITE_API_URL` = your deployed Render backend URL (e.g. `https://remdo-api.onrender.com`).

### Backend → Render

1. Import the repository in [Render](https://render.com).
2. Create a new **Web Service**.
3. Set the following options:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Environment Variables**:
     * `MONGO_URI` = your MongoDB Atlas connection string.
     * `CLIENT_URL` = your deployed Vercel frontend URL (needed for CORS).
     * `NODE_ENV` = `production`

> **Note on CORS configuration**: Once both Vercel and Render services are live, ensure that the CORS environment variables link to each other's live production URLs.
