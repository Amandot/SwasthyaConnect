# SwasthyaConnect Project Guide

## 1. Project Overview

SwasthyaConnect is a full-stack rural telehealth application. It connects patients with doctors through appointment booking, health records, medicine search, symptom analysis, and video consultations.

The project is split into two independently runnable applications:

- `frontend/`: React 18 and Vite user interface.
- `backend/`: Node.js and Express REST API.

The main external services are:

- Firebase Authentication for patient and doctor sign-in.
- Supabase PostgreSQL for application data.
- Google Gemini for optional AI symptom analysis.
- Jitsi Meet for video consultations.

## 2. High-Level Architecture

```text
Browser
  |
  | React UI, Firebase client authentication, Jitsi client
  v
frontend/src/services/api.js
  |
  | Axios requests with Firebase ID token
  v
backend/index.js
  |
  +--> Authentication middleware --> Firebase Admin
  |
  +--> Controllers -------------> Supabase PostgreSQL
  |
  +--> AI controller ------------> Google Gemini API
  |
  +--> Appointment data ---------> Jitsi room identifiers
```

The frontend authenticates users with Firebase and sends the resulting ID token to the backend. The backend verifies the token, identifies the application user, and uses Supabase for users, appointments, records, and medicines.

## 3. Repository Structure

```text
SwasthyaConnect/
|
+-- README.md                 Basic project documentation
+-- depth.md                  Detailed architecture and structure guide
+-- backend/                  Express API application
`-- frontend/                 React/Vite web application
```

The backend and frontend each have their own `package.json`, environment file, dependencies, and development command. Install dependencies from each directory separately.

## 4. Backend Structure

```text
backend/
|
+-- index.js                  Express application entry point
+-- package.json              Backend scripts and dependencies
+-- .env.example              Backend configuration template
+-- supabase_schema.sql       Database tables and schema
|
+-- config/
|   +-- firebase.js           Firebase Admin SDK initialization
|   +-- supabase.js           Supabase client initialization
|   +-- logger.js              Winston logger configuration
|   `-- firebase.example.json Example Firebase service-account shape
|
+-- routes/
|   +-- users.js              User and doctor endpoints
|   +-- appointments.js       Appointment endpoints
|   +-- records.js            Health record endpoints
|   +-- medicines.js          Medicine and pharmacy endpoints
|   `-- ai.js                 Symptom and health-assistance endpoints
|
+-- controllers/
|   +-- userController.js     User profile and doctor queries
|   +-- appointmentController.js Appointment CRUD and video rooms
|   +-- recordController.js  Health records and prescriptions
|   +-- medicineController.js Medicine and pharmacy operations
|   `-- aiController.js       Gemini integration and demo analysis
|
+-- middleware/
|   +-- auth.js               Firebase token verification and roles
|   +-- validate.js           Joi request validation helpers
|   +-- rateLimit.js          Rate-limit definitions
|   +-- cors.js               Reusable CORS configuration
|   `-- errorHandler.js       Error response and logging helper
|
+-- scripts/
|   `-- setup_doctors.js      Utility for initial doctor setup
|
`-- test_*.js                 Manual/integration database and booking checks
```

### Backend entry point

`backend/index.js` performs the following tasks:

1. Loads variables from `.env`.
2. Creates the Express application.
3. Enables CORS and JSON request parsing.
4. Mounts routes under `/api`.
5. Exposes `/` and `/api/health`.
6. Starts the HTTP server using `PORT` or the default port `5000`.

### Backend routes

| Route | Purpose |
| --- | --- |
| `/api/users` | Create, read, and update user profiles; list doctors |
| `/api/appointments` | List, book, update, and cancel appointments |
| `/api/records` | Read and manage health records and prescriptions |
| `/api/medicines` | Search medicines and pharmacies |
| `/api/symptom-check` | Analyze symptoms using Gemini or a demo response |
| `/api/health` | Backend health check |

### Controllers

Routes define the URL and HTTP method. Controllers contain the application behavior and database queries.

- `userController.js` manages profiles and doctor discovery.
- `appointmentController.js` handles appointment lifecycle operations and creates consultation room identifiers.
- `recordController.js` handles patient records and prescriptions.
- `medicineController.js` handles medicine and pharmacy searches and protected updates.
- `aiController.js` calls Gemini when configured and returns a local demo analysis otherwise.

### Authentication

`middleware/auth.js` reads the `Authorization: Bearer <token>` header.

In normal operation it verifies a Firebase ID token with Firebase Admin and looks up the corresponding user in Supabase. It attaches the result to `req.user` for controllers.

When Firebase Admin credentials are absent, the backend enters demo mode. The recognized demo tokens are:

- `demo-patient-token`
- `demo-doctor-token`

Demo mode is intended for local development only. A working Supabase configuration is still needed for persistent application data.

### Database

`supabase_schema.sql` defines the application database. The main domain tables are:

- `users`
- `appointments`
- `health_records`
- `medicines`

The backend uses the Supabase service-role key. Keep this key only in the backend environment; it must never be exposed to the browser.

## 5. Frontend Structure

```text
frontend/
|
+-- index.html                 Vite HTML entry point
+-- package.json               Frontend scripts and dependencies
+-- vite.config.js             Vite configuration
+-- tailwind.config.js         Tailwind configuration
+-- postcss.config.js          PostCSS configuration
+-- .env.example               Frontend configuration template
|
+-- public/
|   +-- manifest.json          Progressive Web App metadata
|   `-- sw.js                  Service worker
|
`-- src/
    +-- main.jsx               React bootstrap and service-worker registration
    +-- App.jsx                Application shell and route definitions
    +-- index.css              Global styles
    |
    +-- components/
    |   +-- Navbar.jsx         Shared navigation
    |   +-- AppointmentCard.jsx Appointment display and actions
    |   +-- SymptomChecker.jsx Shared symptom-checking UI
    |   +-- VideoCall.jsx      Jitsi video-call wrapper
    |   +-- VoiceChat.jsx      Voice interaction UI
    |   +-- ThemeProvider.jsx  Theme context/provider
    |   +-- ThemeToggle.jsx    Theme switch control
    |   +-- ui/                Reusable Button and Card components
    |   +-- logo/              Logo components/assets
    |   `-- routing/           ProtectedRoute component
    |
    +-- pages/
    |   +-- Home.jsx           Public landing/home page
    |   +-- LoginSelection.jsx Patient/doctor login choice
    |   +-- PatientLogin.jsx   Patient authentication
    |   +-- PatientSignup.jsx  Patient registration
    |   +-- DoctorLogin.jsx    Doctor authentication
    |   +-- DoctorSignup.jsx   Doctor registration
    |   +-- Dashboard.jsx      Patient dashboard
    |   +-- DoctorDashboard.jsx Doctor dashboard
    |   +-- BookAppointment.jsx Appointment booking
    |   +-- Consultation.jsx   Consultation and video room page
    |   +-- HealthRecords.jsx  Records and prescriptions
    |   +-- Medicines.jsx      Medicine search
    |   +-- SymptomChecker.jsx AI symptom-checking page
    |   +-- Emergency.jsx      Emergency information
    |   `-- *VideoTest.jsx     Jitsi diagnostic/test pages
    |
    +-- services/
    |   `-- api.js             Axios client and API methods
    |
    +-- firebase/
    |   `-- firebaseConfig.js  Firebase client initialization
    |
    `-- lib/
        `-- utils.js           Shared frontend utilities
```

### Frontend entry flow

1. `src/main.jsx` mounts React and loads global CSS.
2. `src/App.jsx` initializes the theme, router, Firebase auth listener, and application routes.
3. The auth listener determines whether a user is signed in.
4. `ProtectedRoute.jsx` restricts patient and doctor pages based on authentication and role.
5. Pages call backend endpoints through `src/services/api.js`.

### Frontend API client

`src/services/api.js` creates an Axios client. Its base URL is selected in this order:

1. `VITE_API_BASE_URL`
2. `VITE_API_URL`
3. `http://localhost:5001/api`

Before requests, the client adds a Firebase ID token when a Firebase user is signed in. It falls back to a token stored in `localStorage` for demo flows. A `401` response removes the stored token and redirects to `/login`.

### Main user workflows

#### Patient workflow

```text
Login/signup
  -> Dashboard
  -> Find a doctor
  -> Book appointment
  -> View records or medicines
  -> Join consultation
```

#### Doctor workflow

```text
Doctor login/signup
  -> Doctor dashboard
  -> Review appointments
  -> Join consultation
  -> Manage records/prescriptions
```

#### Symptom workflow

```text
Patient enters symptoms
  -> Frontend calls /api/symptom-check
  -> Backend uses Gemini when configured
  -> Backend returns analysis or demo response
```

## 6. Environment Configuration

### Backend `.env`

Copy `backend/.env.example` to `backend/.env` and configure:

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

The backend source currently uses `FRONTEND_URL` for CORS. Keep it aligned with the frontend development URL.

### Frontend `.env`

Copy `frontend/.env.example` to `frontend/.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_JITSI_DOMAIN=meet.jit.si
```

Only variables prefixed with `VITE_` are exposed to frontend code. Never place Firebase Admin credentials or the Supabase service-role key in the frontend `.env` file.

## 7. Running Locally

Open two terminals from the repository root.

### Terminal 1: backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Terminal 2: frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Check the backend separately:

```bash
curl http://localhost:5001/api/health
```

The backend source defaults to port `5000`, while the supplied environment examples and frontend API fallback use `5001`. Set `PORT=5001` in `backend/.env` to keep the local setup consistent.

## 8. Build and Quality Commands

From `frontend/`:

```bash
npm run build
npm run build:prod
npm run preview
npm run lint
```

From `backend/`:

```bash
npm start
npm run dev
npm run prod
```

The files named `test_*.js` and `get_appointments_test.js` are manual or integration-style scripts. They may require valid Firebase, Supabase, and environment configuration before they can run successfully.

## 9. Important Development Notes

- Firebase is primarily used for authentication in the current architecture; Supabase stores the application records.
- Gemini is optional. Without `GEMINI_API_KEY`, the symptom checker returns a demo response.
- Jitsi uses room identifiers generated or selected by the consultation flow. Browser camera and microphone permissions are required.
- Some pages are intentionally diagnostic pages for video testing and are not necessarily part of the main user navigation.
- Emergency information and some dashboard statistics may be local or static rather than database-driven.
- Do not commit `.env` files, private keys, Firebase service-account JSON files, or Supabase service-role keys.

## 10. Known Documentation Caveats

The original `README.md` contains a few stale references, including the project name `Arogo`, a `cd Arogo` command, and documentation paths that are not present in the current repository. This file describes the current `SwasthyaConnect` layout and runtime configuration instead.
