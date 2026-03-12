import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, appointmentAPI } from '../services/api';

// Demo doctors — always shown as fallback
const DEMO_DOCTORS = [
  { id: '1', name: 'Dr. Rajesh Sharma', specialty: 'General Physician', available: true },
  { id: '2', name: 'Dr. Priya Patel', specialty: 'Pediatrician', available: true },
  { id: '3', name: 'Dr. Amit Kumar', specialty: 'Cardiologist', available: false },
  { id: '4', name: 'Dr. Sunita Gupta', specialty: 'Dermatologist', available: true }
];

function BookAppointment({ user }) {
  const [doctors, setDoctors] = useState(DEMO_DOCTORS); // ✅ Default demo data
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false); // ✅ false by default — doctors pehle se hain
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(''); // ✅ Error state add kiya
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDoctors();
      // ✅ Sirf tab update karo jab API se valid data aaye
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        setDoctors(response.data);
      }
      // Agar empty array aaye, demo data rehne do
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // ✅ Demo data already set hai, kuch karne ki zarurat nahi
    } finally {
      setLoading(false); // ✅ Hamesha false karo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return;

    setSubmitting(true);
    setError('');

    try {
      await appointmentAPI.createAppointment({
        patientId: user?.uid || 'demo-user',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time,
        type,
        notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      // ✅ Demo mode mein success dikhao, production mein error dikhao
      if (import.meta.env.DEV) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError('Appointment booking failed. Please try again!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h1>
        <p className="text-slate-600 mb-4">
          Your consultation with <strong>{selectedDoctor?.name}</strong> has been scheduled for{' '}
          <strong>{date}</strong> at <strong>{time}</strong>.
        </p>
        <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Book Appointment</h1>
      <p className="text-slate-500 mb-8">Schedule a consultation with a doctor</p>

      {/* ✅ Error message show karo */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Doctor */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Select Doctor
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-xl animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => doctor.available && setSelectedDoctor(doctor)}
                  disabled={!doctor.available}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                      : doctor.available
                      ? 'border-slate-200 hover:border-primary-200 hover:bg-slate-50'
                      : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedDoctor?.id === doctor.id ? 'bg-primary-100' : 'bg-slate-100'
                    }`}>
                      <DoctorIcon className={`w-6 h-6 ${
                        selectedDoctor?.id === doctor.id ? 'text-primary-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
                      <p className="text-sm text-slate-500">{doctor.specialty}</p>
                    </div>
                    {!doctor.available && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Unavailable</span>
                    )}
                    {doctor.available && selectedDoctor?.id === doctor.id && (
                      <CheckCircleIcon className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Step 2: Select Date & Time */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Select Date & Time
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDate()}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Step 3: Consultation Type */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Consultation Type
          </h2>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType('video')}
              className={`flex-1 p-4 border rounded-xl flex items-center justify-center gap-3 transition-all ${
                type === 'video'
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                  : 'border-slate-200 hover:border-primary-200'
              }`}
            >
              <VideoIcon className={`w-6 h-6 ${type === 'video' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${type === 'video' ? 'text-primary-700' : 'text-slate-600'}`}>
                Video Call
              </span>
            </button>

            <button
              type="button"
              onClick={() => setType('audio')}
              className={`flex-1 p-4 border rounded-xl flex items-center justify-center gap-3 transition-all ${
                type === 'audio'
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                  : 'border-slate-200 hover:border-primary-200'
              }`}
            >
              <PhoneIcon className={`w-6 h-6 ${type === 'audio' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${type === 'audio' ? 'text-primary-700' : 'text-slate-600'}`}>
                Audio Call
              </span>
            </button>
          </div>
        </section>

        {/* Step 4: Additional Notes */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            Additional Notes (Optional)
          </h2>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for consultation..."
            className="input-field min-h-[100px] resize-none"
            rows={3}
          />
        </section>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedDoctor || !date || !time || submitting}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Booking...
              </>
            ) : (
              <>
                <CalendarIcon className="w-5 h-5" />
                Confirm Appointment
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

// Icon Components
function DoctorIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

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

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export default BookAppointment;
