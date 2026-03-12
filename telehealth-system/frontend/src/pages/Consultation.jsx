import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import { appointmentAPI } from '../services/api';

function Consultation({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [roomId]);

  const fetchAppointment = async () => {
    try {
      // In a real app, you'd fetch the appointment by roomId
      // For demo, we'll use mock data
      setAppointment({
        id: '1',
        doctorName: 'Dr. Rajesh Sharma',
        patientName: user.displayName || user.email?.split('@')[0] || 'Patient',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: 'video',
        roomId: roomId
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCall = () => {
    setCallEnded(true);
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-white font-medium">Preparing consultation room...</p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Consultation Completed</h1>
          <p className="text-slate-600 mb-8">
            Your consultation with {appointment?.doctorName} has ended. 
            The doctor will update your health records shortly.
          </p>

          <div className="card mb-6">
            <h3 className="font-semibold text-slate-800 mb-4">What's next?</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-xs font-bold">1</span>
                </div>
                <p className="text-slate-600">Check your health records for prescription</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-xs font-bold">2</span>
                </div>
                <p className="text-slate-600">Find medicines at nearby pharmacies</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-xs font-bold">3</span>
                </div>
                <p className="text-slate-600">Book a follow-up if needed</p>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReturnToDashboard}
              className="btn-primary flex-1"
            >
              Return to Dashboard
            </button>
            <a href="/health-records" className="btn-secondary flex-1 text-center">
              View Health Records
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <VideoIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Video Consultation</h1>
                <p className="text-slate-400 text-sm">{appointment?.doctorName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
              <ClockIcon className="w-4 h-4" />
              <span>{appointment?.time}</span>
            </div>
            <button
              onClick={handleLeaveCall}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <PhoneOffIcon className="w-4 h-4" />
              End Call
            </button>
          </div>
        </div>
      </header>

      {/* Video Call Area */}
      <main className="h-[calc(100vh-65px)]">
        <VideoCall
          roomId={roomId}
          userName={appointment?.patientName}
          onLeave={handleLeaveCall}
        />
      </main>

      {/* Tips Panel (Desktop) */}
      <div className="hidden lg:block fixed right-4 top-24 w-72 bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <TipIcon className="w-5 h-5 text-primary-400" />
          Tips for Better Consultation
        </h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Ensure good lighting and a quiet environment
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Keep your symptoms list ready
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Have your previous prescriptions handy
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Speak clearly and face the camera
          </li>
        </ul>
      </div>
    </div>
  );
}

// Icon Components
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function VideoIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneOffIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
    </svg>
  );
}

function TipIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

export default Consultation;
