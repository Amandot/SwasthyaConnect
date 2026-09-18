# SwasthyaConnect — Rural TeleHealth Access System

A full-stack telehealth platform built to bring remote healthcare access to rural communities. Patients can consult doctors via live video, check medicine availability, manage health records, and get AI-powered symptom assessments.

---

## Features

- **Live Video Consultations** — HD video, screen sharing, and in-call chat via Jitsi Meet SDK
- **Role-Based Authentication** — Secure Patient/Doctor login via Firebase
- **Appointment Management** — Scheduling, rescheduling, and status tracking
- **Digital Health Records** — Secure prescriptions, vitals, and diagnoses
- **Pharmacy & Medicine Search** — Real-time stock and pricing lookup
- **AI Symptom Checker** — Google Gemini (`gemini-2.5-flash`) suggests likely specialists
- **Progressive Web App** — Installable, offline-resilient for low-connectivity areas

---

## Tech Stack

| Layer      | Technologies                                               |
|------------|------------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router , Framer Motion |
| Video      | Jitsi Meet SDK (`@jitsi/react-sdk`)                        |
| Auth & DB  | Firebase Auth, Cloud Firestore                             |
| Backend    | Node.js, Express, Helmet, CORS, Rate Limiting, Winston     |
| AI         | Google Gemini API                                          |
| Deployment | Vercel (frontend) · Render (backend)                       |

---

## Getting Started

```bash
git clone 
cd Arogo

# Backend
cd backend && npm install && cp .env.example .env
npm run dev   # runs on localhost:5000

# Frontend (new terminal)
cd frontend && npm install && cp .env.example .env
npm run dev   # runs on localhost:5173
```

Fill in `backend/.env` and `frontend/.env` with your Firebase and Gemini credentials — see `.env.example` in each folder for required keys.

---

## API Reference

| Method     | Endpoint                            | Description          |
|------------|-------------------------------------|----------------------|
| GET        | `/api/health`                       | Health check         |
| GET        | `/api/users` / `/api/users/doctors` | List users / doctors |
| POST       | `/api/users`                        | Create user          |
| GET/POST   | `/api/appointments`                 | List/Bookappointments|
| PUT/DELETE | `/api/appointments/:id`             | Update / appointment |
| GET/POST   | `/api/records`                      | Get/healthrecords    |
| GET        | `/api/medicines/search?query=`      | Search medicines     |
| POST       | `/api/symptom-check`                | AI symptom analysis  |

All routes except `/api/health` require a Firebase ID token (`Authorization: Bearer <token>`).

---

## Deployment

- **Frontend** → Vercel (root: `frontend`, build: `npm run build:prod`, output: `dist`)
- **Backend** → Render (root: `backend`, build: `npm install`, start: `npm start`)

Full guides: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) · [`docs/TESTING.md`](docs/TESTING.md)

---

## Roadmap

- [ ] Doctor availability calendar
- [ ] In-app appointment notifications
- [ ] Doctor analytics dashboard
- [ ] Multi-language support

---

## License

MIT
