import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

// Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import HealthRecords from './pages/HealthRecords.jsx';
import Medicines from './pages/Medicines.jsx';
import Consultation from './pages/Consultation.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';

// Components
import Navbar from './components/Navbar.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {user && <Navbar user={user} />}
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/book-appointment" 
            element={user ? <BookAppointment user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/health-records" 
            element={user ? <HealthRecords user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medicines" 
            element={user ? <Medicines /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/consultation/:roomId" 
            element={user ? <Consultation user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/symptom-checker" 
            element={user ? <SymptomChecker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
