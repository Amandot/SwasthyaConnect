import { useState, useEffect } from 'react';
import { recordAPI } from '../services/api';

function HealthRecords({ user }) {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await recordAPI.getRecords({ patientId: user.uid });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
      // Demo data
      setRecords([
        {
          id: '1',
          date: '2026-03-10',
          doctorName: 'Dr. Rajesh Sharma',
          diagnosis: 'Viral Fever',
          prescription: [
            { medicine: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
            { medicine: 'Vitamin C', dosage: '1 tablet', frequency: 'Once daily', duration: '10 days' }
          ],
          vitals: { temperature: '101°F', bp: '120/80', pulse: '88 bpm' },
          notes: 'Rest advised. Drink plenty of fluids. Follow up if fever persists.'
        },
        {
          id: '2',
          date: '2026-02-15',
          doctorName: 'Dr. Priya Patel',
          diagnosis: 'Seasonal Allergies',
          prescription: [
            { medicine: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '7 days' }
          ],
          vitals: { temperature: '98.6°F', bp: '118/76', pulse: '72 bpm' },
          notes: 'Avoid dust exposure. Use mask outdoors.'
        },
        {
          id: '3',
          date: '2026-01-20',
          doctorName: 'Dr. Amit Kumar',
          diagnosis: 'Routine Checkup',
          prescription: [],
          vitals: { temperature: '98.4°F', bp: '120/82', pulse: '76 bpm' },
          notes: 'All vitals normal. Continue healthy lifestyle.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredRecords = records.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'prescriptions') return record.prescription?.length > 0;
    if (activeTab === 'checkups') return record.diagnosis === 'Routine Checkup';
    return true;
  });

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="lg:col-span-2 h-96 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Health Records</h1>
      <p className="text-slate-500 mb-6">View your medical history, prescriptions, and reports</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'prescriptions', 'checkups'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' && 'All Records'}
            {tab === 'prescriptions' && 'Prescriptions'}
            {tab === 'checkups' && 'Checkups'}
          </button>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="card bg-slate-50 text-center py-16">
          <FileIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No Health Records</h3>
          <p className="text-slate-500">Your medical records will appear here after consultations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredRecords.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedRecord?.id === record.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                    : 'border-slate-200 bg-white hover:border-primary-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{record.diagnosis}</p>
                    <p className="text-sm text-slate-500">{record.doctorName}</p>
                    <p className="text-sm text-slate-400 mt-1">{formatDate(record.date)}</p>
                  </div>
                  {record.prescription?.length > 0 && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {record.prescription.length} meds
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Record Details */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="card space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedRecord.diagnosis}</h2>
                    <p className="text-slate-500">{selectedRecord.doctorName}</p>
                    <p className="text-slate-400 text-sm">{formatDate(selectedRecord.date)}</p>
                  </div>
                  <button className="btn-secondary text-sm">
                    Download PDF
                  </button>
                </div>

                {/* Vitals */}
                {selectedRecord.vitals && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      Vitals
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <p className="text-2xl font-bold text-slate-800">{selectedRecord.vitals.temperature}</p>
                        <p className="text-sm text-slate-500">Temperature</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <p className="text-2xl font-bold text-slate-800">{selectedRecord.vitals.bp}</p>
                        <p className="text-sm text-slate-500">Blood Pressure</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <p className="text-2xl font-bold text-slate-800">{selectedRecord.vitals.pulse}</p>
                        <p className="text-sm text-slate-500">Pulse Rate</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prescription */}
                {selectedRecord.prescription?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <PillIcon className="w-5 h-5 text-primary-500" />
                      Prescription
                    </h3>
                    <div className="bg-slate-50 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Medicine</th>
                            <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Dosage</th>
                            <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Frequency</th>
                            <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.prescription.map((med, index) => (
                            <tr key={index} className="border-t border-slate-200">
                              <td className="px-4 py-3 font-medium text-slate-800">{med.medicine}</td>
                              <td className="px-4 py-3 text-slate-600">{med.dosage}</td>
                              <td className="px-4 py-3 text-slate-600">{med.frequency}</td>
                              <td className="px-4 py-3 text-slate-600">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Doctor Notes */}
                {selectedRecord.notes && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <NoteIcon className="w-5 h-5 text-blue-500" />
                      Doctor's Notes
                    </h3>
                    <p className="text-slate-600 bg-blue-50 p-4 rounded-xl">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card bg-slate-50 text-center py-16">
                <FileIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a record to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// Icon Components
function FileIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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

function NoteIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

export default HealthRecords;
