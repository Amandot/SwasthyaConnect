import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import { auth, isDemoFirebase } from './firebase/firebaseConfig';
import Home from './pages/Home.jsx';
import LoginSelection from './pages/LoginSelection.jsx';
import PatientLogin from './pages/PatientLogin.jsx';
import DoctorLogin from './pages/DoctorLogin.jsx';
import PatientSignup from './pages/PatientSignup.jsx';
import DoctorSignup from './pages/DoctorSignup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import HealthRecords from './pages/HealthRecords.jsx';
import Medicines from './pages/Medicines.jsx';
import Consultation from './pages/Consultation.jsx';
import VideoCallTest from './pages/VideoCallTest.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';
import Emergency from './pages/Emergency.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import { ThemeProvider } from './components/ThemeProvider';

function AppRoutes({ user, userRole, handleRoleChange }) {
  const location = useLocation();
  const isConsultation = location.pathname.startsWith('/consultation/');

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink transition-colors duration-200 dark:bg-[#07111f] dark:text-slate-100">
      {!isConsultation && <Navbar user={user} userRole={userRole} />}
      <main className={isConsultation ? 'flex min-h-screen flex-1 flex-col' : 'flex flex-1 flex-col pt-24 sm:pt-28'}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'} /> : <LoginSelection />} />
            <Route path="/signup/patient" element={user ? <Navigate to="/dashboard" /> : <PatientSignup onLogin={() => handleRoleChange('patient')} />} />
            <Route path="/signup/doctor" element={user ? <Navigate to="/doctor-dashboard" /> : <DoctorSignup onLogin={() => handleRoleChange('doctor')} />} />
            <Route path="/login/patient" element={user && userRole === 'patient' ? <Navigate to="/dashboard" /> : <PatientLogin onLogin={() => handleRoleChange('patient')} />} />
            <Route path="/login/doctor" element={user && userRole === 'doctor' ? <Navigate to="/doctor-dashboard" /> : <DoctorLogin onLogin={() => handleRoleChange('doctor')} />} />
            <Route path="/dashboard" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}><Dashboard user={user} /></ProtectedRoute>} />
            <Route path="/book-appointment" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}><BookAppointment user={user} /></ProtectedRoute>} />
            <Route path="/health-records" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}><HealthRecords user={user} /></ProtectedRoute>} />
            <Route path="/medicines" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}><Medicines /></ProtectedRoute>} />
            <Route path="/symptom-checker" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}><SymptomChecker /></ProtectedRoute>} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/doctor-dashboard" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['doctor']}><DoctorDashboard user={user} /></ProtectedRoute>} />
            <Route path="/consultation/:roomId" element={<ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient', 'doctor']}><Consultation user={user} /></ProtectedRoute>} />
            <Route path="/test/video-call" element={<VideoCallTest />} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const handleRoleChange = (role) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem('authToken', token);
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            setUserRole(profile.role);
            localStorage.setItem('userRole', profile.role);
          } else {
            const role = localStorage.getItem('userRole');
            if (role) setUserRole(role);
          }
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          const role = localStorage.getItem('userRole');
          if (role) setUserRole(role);
        }
      } else if (isDemoFirebase) {
        const storedDemo = localStorage.getItem('demoUser');
        if (storedDemo) {
          try {
            const demoUser = JSON.parse(storedDemo);
            if (!demoUser || typeof demoUser !== 'object') throw new Error('Invalid demo user');
            setUser(demoUser);
            const role = localStorage.getItem('userRole') || demoUser.role || 'patient';
            setUserRole(role);
          } catch {
            localStorage.removeItem('demoUser');
            setUser(null);
            setUserRole(null);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6 dark:bg-[#07111f]">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-premium">
            <HeartPulse className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-ink dark:text-white">SwasthyaConnect</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" role="status">Preparing your healthcare experience…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="theme">
      <Router>
        <AppRoutes user={user} userRole={userRole} handleRoleChange={handleRoleChange} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
