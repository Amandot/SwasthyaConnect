import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, aiAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';

function Dashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [healthTip, setHealthTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch upcoming appointments
      const appointmentsRes = await appointmentAPI.getAppointments({ 
        patientId: user.uid,
        status: 'scheduled' 
      });
      setAppointments(appointmentsRes.data.slice(0, 3));

      // Fetch health tip
      const tipsRes = await aiAPI.getHealthTips();
      setHealthTip(tipsRes.data.dailyTip);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set demo data if API fails
      setAppointments([
        {
          id: '1',
          doctorName: 'Sharma',
          date: '2026-03-15',
          time: '10:00 AM',
          type: 'video',
          status: 'scheduled',
          roomId: 'demo-room-123'
        }
      ]);
      setHealthTip('Drink at least 8 glasses of water daily');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Book Consultation',
      description: 'Schedule a video call with a doctor',
      icon: <CalendarIcon className="w-6 h-6" />,
      link: '/book-appointment',
      color: 'bg-primary-500'
    },
    {
      title: 'Check Medicines',
      description: 'Find medicines at nearby pharmacies',
      icon: <PillIcon className="w-6 h-6" />,
      link: '/medicines',
      color: 'bg-emerald-500'
    },
    {
      title: 'Health Records',
      description: 'View your medical history',
      icon: <FileIcon className="w-6 h-6" />,
      link: '/health-records',
      color: 'bg-blue-500'
    },
    {
      title: 'Symptom Checker',
      description: 'AI-powered health assessment',
      icon: <AIIcon className="w-6 h-6" />,
      link: '/symptom-checker',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome back, {user.displayName || user.email?.split('@')[0] || 'Patient'}
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your health from the comfort of your home
        </p>
      </section>

      {/* Health Tip Banner */}
      {healthTip && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <LightbulbIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-primary-100 text-sm font-medium">Daily Health Tip</p>
                <p className="text-white text-lg font-semibold mt-1">{healthTip}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="feature-card flex flex-col items-start"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-slate-800">{action.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Appointments</h2>
          <Link 
            to="/book-appointment" 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
          >
            View all
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="card bg-slate-50 text-center py-12">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No Upcoming Appointments</h3>
            <p className="text-slate-500 mb-4">Book a consultation with a doctor today</p>
            <Link to="/book-appointment" className="btn-primary inline-flex">
              Book Appointment
            </Link>
          </div>
        )}
      </section>

      {/* Emergency Contact */}
      <section>
        <div className="card bg-red-50 border-red-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Emergency Helpline</h3>
                <p className="text-red-600">For medical emergencies, call immediately</p>
              </div>
            </div>
            <a 
              href="tel:102" 
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Call 102
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// Icon Components
function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function PillIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function FileIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AIIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function LightbulbIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

export default Dashboard;
