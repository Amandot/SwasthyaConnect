# SwasthyaConnect — Rural TeleHealth Access System

A full-stack telehealth platform built to bring remote healthcare access to rural communities. Patients can consult doctors via live video, check medicine availability, manage health records, and get AI-powered symptom assessments.

---

## Features

- Video Consultations via Jitsi Meet (HD video, screen share, chat)
- Patient & Doctor authentication with Firebase
- Appointment booking and management
- Digital health records and prescriptions
- Medicine availability search across pharmacies
- AI symptom checker powered by Google Gemini
- Progressive Web App (offline support, installable)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion |
| Video | Jitsi Meet SDK (`@jitsi/react-sdk`) |
| Auth | Firebase Authentication |
| Backend | Node.js, Express |
| Database | Cloud Firestore (Firebase Admin SDK) |
| AI | Google Gemini (`gemini-2.5-flash`) |
| DevOps | Docker, Docker Compose |

---

## Project Structure

```
telehealth-system/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Navbar, VideoCall, SymptomChecker, etc.
│   │   ├── pages/          # Dashboard, BookAppointment, HealthRecords, etc.
│   │   ├── services/api.js # Axios API client
│   │   └── firebase/       # Firebase client config
│   ├── public/             # PWA manifest & service worker
│   └── .env.example
├── server/                 # Express API
│   ├── controllers/        # userController, appointmentController, etc.
│   ├── routes/             # /api/users, /api/appointments, etc.
│   ├── middleware/         # auth, cors, rateLimit, errorHandler
│   ├── config/             # Firebase Admin, logger
│   ├── index.js
│   └── .env.example
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project (Firestore + Authentication enabled)
- Google Gemini API key (for AI symptom checker)

### 1. Clone & Install

```bash
git clone <repo-url>
cd telehealth-system

# Backend
cd server && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** — copy and fill `server/.env`:

```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Frontend** — copy and fill `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx
VITE_JITSI_DOMAIN=meet.jit.si
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Authentication** → Email/Password (and Google if needed)
3. Create a **Firestore Database** in production mode
4. Apply these security rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    match /health_records/{recordId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'doctor';
    }
    match /medicines/{medicineId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'pharmacy';
    }
  }
}
```

5. Go to **Project Settings → Service Accounts** → Generate a new private key for the backend

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5001`

---

## Docker

```bash
cd telehealth-system
docker-compose up --build
```

Frontend served on port `80`, backend on port `5000`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List users |
| GET | `/api/users/doctors` | List doctors |
| POST | `/api/users` | Create user |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id/cancel` | Cancel appointment |
| GET | `/api/records` | Get health records |
| POST | `/api/records` | Create health record |
| GET | `/api/medicines` | List medicines |
| GET | `/api/medicines/search?query=` | Search medicines |
| POST | `/api/symptom-check` | AI symptom analysis |
| GET | `/api/health-tips` | Get health tips |

All `/api/*` routes (except health check) require a Firebase ID token in the `Authorization: Bearer <token>` header.

---

## Firestore Data Models

```json
// users
{ "name": "string", "role": "patient|doctor", "email": "string", "age": "number", "phone": "string" }

// appointments
{ "patientId": "string", "doctorId": "string", "date": "string", "time": "string", "type": "video", "status": "scheduled|completed|cancelled", "roomId": "string" }

// health_records
{ "patientId": "string", "doctorId": "string", "diagnosis": "string", "prescription": [], "vitals": {}, "notes": "string" }

// medicines
{ "name": "string", "pharmacy": "string", "available": "boolean", "price": "number", "quantity": "number" }
```

---

## Deployment

- **Backend**: Railway, Render, or any Node.js host — set all env vars from `.env.example`
- **Frontend**: Vercel or Netlify — set all `VITE_*` env vars in the dashboard
- Update `CORS_ORIGIN` in backend to match your frontend production URL

---

## License

MIT
