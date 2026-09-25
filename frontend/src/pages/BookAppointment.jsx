import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  PhoneCall,
  Star,
  Stethoscope,
  Video
} from 'lucide-react';
import { userAPI, appointmentAPI } from '../services/api';
import { InlineNotice, PageHeader, PageShell, Skeleton } from '../components/ui/PagePrimitives';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const SAMPLE_DOCTORS = [
  { id: 'sample-1', name: 'Sample general physician', specialty: 'General Physician', available: true },
  { id: 'sample-2', name: 'Sample pediatrician', specialty: 'Pediatrician', available: true },
  { id: 'sample-3', name: 'Sample cardiologist', specialty: 'Cardiologist', available: false },
  { id: 'sample-4', name: 'Sample dermatologist', specialty: 'Dermatologist', available: true }
];

const STEPS = [
  { label: 'Doctor', description: 'Choose provider' },
  { label: 'Date', description: 'Pick a day' },
  { label: 'Time', description: 'Select a slot' },
  { label: 'Confirm', description: 'Review details' }
];

const consultationOptions = [
  {
    value: 'video',
    title: 'Video call',
    description: 'High-quality face-to-face consultation',
    icon: Video
  },
  {
    value: 'audio',
    title: 'Voice call',
    description: 'Low-bandwidth consultation',
    icon: PhoneCall
  }
];

export default function BookAppointment({ user }) {
  const [doctors, setDoctors] = useState(SAMPLE_DOCTORS);
  const [usingSampleDoctors, setUsingSampleDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [validationField, setValidationField] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const doctorGroupRef = useRef(null);
  const dateInputRef = useRef(null);
  const timeGroupRef = useRef(null);
  const stepPanelRef = useRef(null);
  const hasMountedRef = useRef(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    stepPanelRef.current?.focus({ preventScroll: true });
  }, [currentStep]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDoctors();
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        setDoctors(response.data);
        setUsingSampleDoctors(false);
      } else {
        setDoctors([]);
        setUsingSampleDoctors(false);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors(SAMPLE_DOCTORS);
      setUsingSampleDoctors(true);
    } finally {
      setLoading(false);
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
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('The appointment could not be confirmed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (value) => {
    if (!value) return 'Not selected';
    const parsedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(parsedDate);
  };

  const getDoctorInitials = (name = '') => name
    .replace(/^Dr\.\s*/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const clearValidation = (field) => {
    if (validationField === field) {
      setValidationField('');
      setValidationError('');
    }
  };

  const showValidationError = (field, message) => {
    setValidationField(field);
    setValidationError(message);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedDoctor) {
      showValidationError('doctor', 'Choose an available doctor to continue.');
      doctorGroupRef.current?.focus();
      return;
    }

    if (currentStep === 2) {
      const minDate = getMinDate();
      if (!date || date < minDate) {
        showValidationError('date', date ? 'Choose today or a future date to continue.' : 'Choose a date to continue.');
        dateInputRef.current?.focus();
        return;
      }
    }

    if (currentStep === 3 && !time) {
      showValidationError('time', 'Choose a time slot to continue.');
      timeGroupRef.current?.focus();
      return;
    }

    setValidationField('');
    setValidationError('');
    setCurrentStep((step) => Math.min(step + 1, 4));
  };

  const handleBackStep = () => {
    if (currentStep === 1) {
      navigate('/dashboard');
      return;
    }

    setValidationField('');
    setValidationError('');
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  if (success) {
    return (
      <PageShell className="flex min-h-[80vh] items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="overflow-hidden border-emerald-200/80 p-0 text-center shadow-float dark:border-emerald-800/70">
            <div className="bg-gradient-to-b from-emerald-50 to-white px-8 pb-7 pt-9 dark:from-emerald-950/40 dark:to-slate-900">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-success text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950/50"
              >
                <CheckCircle2 size={46} aria-hidden="true" />
              </motion.div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Appointment confirmed</p>
              <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-ink dark:text-white">Booking Confirmed!</h1>
              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
                Your consultation with <strong className="font-bold text-ink dark:text-white">{selectedDoctor?.name}</strong> has been scheduled.
              </p>
            </div>
            <div className="px-6 pb-7 sm:px-8">
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left sm:grid-cols-2 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</p>
                    <p className="mt-0.5 text-sm font-bold text-ink dark:text-white">{formatDate(date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Time</p>
                    <p className="mt-0.5 text-sm font-bold text-ink dark:text-white">{time}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent dark:border-primary-400" aria-hidden="true" />
                Redirecting to your dashboard...
              </div>
            </div>
          </Card>
        </motion.div>
      </PageShell>
    );
  }

  const currentStepInfo = STEPS[currentStep - 1];
  const progressWidth = `${(currentStep / STEPS.length) * 100}%`;

  return (
    <PageShell className="py-8 sm:py-10 lg:py-12">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          eyebrow="Appointment booking"
          title="Book a consultation"
          description="Choose a provider, select a convenient time, and review your appointment before confirming."
          icon={CalendarCheck2}
        />

        {error && (
          <div role="alert" className="mb-6">
            <InlineNotice tone="danger" icon={AlertCircle} title="Unable to book appointment">
              {error}
            </InlineNotice>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {selectedDoctor && (
            <Card className="mb-5 p-4 lg:hidden" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-50 text-sm font-extrabold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  {getDoctorInitials(selectedDoctor.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Booking with</p>
                  <p className="truncate text-sm font-bold text-ink dark:text-white">{selectedDoctor.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{selectedDoctor.specialty}</p>
                </div>
                {(date || time) && (
                  <div className="ml-auto hidden text-right min-[380px]:block">
                    {date && <p className="text-xs font-bold text-ink dark:text-white">{formatDate(date)}</p>}
                    {time && <p className="text-xs text-primary-700 dark:text-primary-300">{time}</p>}
                  </div>
                )}
              </div>
            </Card>
          )}

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
            <div className="min-w-0">
              <Card className="sticky top-3 z-20 overflow-hidden p-0 shadow-float backdrop-blur-xl">
                <div
                  className="h-1.5 bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-label={`Step ${currentStep} of 4: ${currentStepInfo.label}`}
                  aria-valuemin="1"
                  aria-valuemax="4"
                  aria-valuenow={currentStep}
                >
                  <motion.div
                    className="h-full rounded-r-full bg-gradient-to-r from-primary-600 to-primary-400"
                    animate={{ width: progressWidth }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                </div>
                <ol className="grid grid-cols-4 border-b border-slate-100 px-1 dark:border-slate-800 sm:px-3" aria-label="Booking progress">
                  {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCurrent = currentStep === stepNumber;
                    const isComplete = currentStep > stepNumber;

                    return (
                      <li
                        key={step.label}
                        className={cn(
                          'flex min-w-0 flex-col items-center gap-1.5 border-l border-slate-100 px-1 py-3 text-center first:border-l-0 dark:border-slate-800 sm:flex-row sm:gap-3 sm:px-3 sm:py-4 sm:text-left',
                          isCurrent && 'bg-primary-50/70 dark:bg-primary-900/30'
                        )}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`${step.label}${isCurrent ? ', current step' : ''}`}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition-colors',
                            isCurrent && 'border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-600/20',
                            isComplete && 'border-primary-600 bg-primary-600 text-white',
                            !isCurrent && !isComplete && 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                          )}
                          aria-hidden="true"
                        >
                          {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
                        </span>
                        <span className="min-w-0">
                          <span className={cn('block truncate text-[11px] font-extrabold sm:text-sm', isCurrent ? 'text-primary-800 dark:text-primary-200' : 'text-ink dark:text-slate-200')}>
                            {step.label}
                          </span>
                          <span className="mt-0.5 hidden truncate text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:block">
                            {step.description}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <div className="flex items-center justify-between gap-3 bg-white/80 p-3 dark:bg-slate-900/80 sm:px-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackStep}
                    icon={ArrowLeft}
                    className="min-h-11 px-3 sm:px-5"
                  >
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                    <span className="sr-only"> to {currentStep === 1 ? 'cancel booking' : STEPS[currentStep - 2].label}</span>
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="min-h-11 px-4 sm:px-6"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      <span className="sr-only"> to {STEPS[currentStep].label}</span>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!selectedDoctor || !date || !time || submitting}
                      isLoading={submitting}
                      icon={CheckCircle2}
                      loadingText="Confirming..."
                      className="min-h-11 px-4 sm:px-6"
                    >
                      Confirm appointment
                    </Button>
                  )}
                </div>
              </Card>

              <motion.section
                key={currentStep}
                ref={stepPanelRef}
                tabIndex={-1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 outline-none sm:mt-7"
                aria-labelledby="booking-step-title"
              >
                <div className="mb-5 sm:mb-6">
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">Step {currentStep} of 4</p>
                  <h2 id="booking-step-title" className="text-2xl font-extrabold tracking-[-0.03em] text-ink dark:text-white sm:text-3xl">
                    {currentStep === 1 && 'Choose your doctor'}
                    {currentStep === 2 && 'Select an appointment date'}
                    {currentStep === 3 && 'Choose a time slot'}
                    {currentStep === 4 && 'Review and confirm'}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                    {currentStep === 1 && 'Select an available provider to begin your booking.'}
                    {currentStep === 2 && 'Choose today or any future date for your consultation.'}
                    {currentStep === 3 && 'Select the time that works best for your appointment.'}
                    {currentStep === 4 && 'Check every detail, add any notes, then confirm your appointment.'}
                  </p>
                </div>

                 {currentStep === 1 && (
                   <div>
                     {usingSampleDoctors && (
                       <InlineNotice icon={AlertCircle} title="Sample provider directory" tone="warning" className="mb-5">
                         Sample providers are shown for preview only while the service directory is unavailable. They cannot be booked.
                       </InlineNotice>
                     )}
                     <div
                       ref={doctorGroupRef}
                      role="group"
                      aria-labelledby="booking-step-title"
                      aria-describedby="doctor-selection-help doctor-selection-error"
                      aria-invalid={validationField === 'doctor' || undefined}
                      tabIndex={-1}
                      className="grid grid-cols-1 gap-4 rounded-[22px] outline-none focus-visible:ring-4 focus-visible:ring-primary-500/15 sm:grid-cols-2"
                    >
                      {loading ? (
                        [1, 2, 3, 4].map((item) => (
                          <Card key={item} className="p-0" aria-hidden="true">
                            <div className="space-y-5 p-5">
                              <div className="flex items-center gap-4">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-3/4" />
                                  <Skeleton className="h-3 w-1/2" />
                                </div>
                              </div>
                              <Skeleton className="h-3 w-full" />
                            </div>
                          </Card>
                        ))
                      ) : (
                         doctors.map((doctor) => {
                           const isSelected = selectedDoctor?.id === doctor.id;
                           const canSelect = doctor.available && !usingSampleDoctors;

                           return (
                            <Card
                              key={doctor.id}
                              className={cn(
                                'h-full overflow-hidden p-0 transition-[border-color,box-shadow,opacity] duration-200',
                                isSelected && 'border-primary-500 shadow-soft ring-2 ring-primary-500/15',
                                !doctor.available && 'opacity-60'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                   if (canSelect) {
                                    setSelectedDoctor(doctor);
                                    clearValidation('doctor');
                                  }
                                }}
                                 disabled={!canSelect}
                                aria-pressed={isSelected}
                                className={cn(
                                  'group relative flex h-full min-h-[190px] w-full flex-col p-5 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-500/25',
                                   canSelect ? 'cursor-pointer' : 'cursor-not-allowed'
                                )}
                              >
                                <div className="flex w-full items-start justify-between gap-3">
                                  <span
                                    className={cn(
                                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold transition-colors',
                                      isSelected
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                    )}
                                    aria-hidden="true"
                                  >
                                    {getDoctorInitials(doctor.name)}
                                  </span>
                                  <span
                                    className={cn(
                                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold',
                                     canSelect
                                       ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300'
                                        : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                    )}
                                  >
                                     <span className={cn('h-1.5 w-1.5 rounded-full', canSelect ? 'bg-emerald-500' : 'bg-slate-400')} aria-hidden="true" />
                                     {usingSampleDoctors ? 'Sample' : doctor.available ? 'Available' : 'Unavailable'}
                                  </span>
                                </div>
                                <div className="mt-5 min-w-0 flex-1">
                                  <div className="flex items-start gap-2">
                                    <h3 className="min-w-0 flex-1 truncate text-base font-extrabold text-ink dark:text-white">{doctor.name}</h3>
                                    {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />}
                                  </div>
                                  <p className="mt-1 text-sm font-semibold text-primary-700 dark:text-primary-300">{doctor.specialty}</p>
                                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {doctor.experience && <span>{doctor.experience} experience</span>}
                                    {doctor.rating && (
                                      <span className="inline-flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                        {doctor.rating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </Card>
                          );
                        })
                      )}
                     </div>
                     {!loading && doctors.length === 0 && (
                       <InlineNotice icon={AlertCircle} title="No providers available" tone="warning" className="mt-4">
                         No provider directory is available right now. Check again later or contact your local care service.
                       </InlineNotice>
                     )}
                     <p id="doctor-selection-help" className="sr-only">Use the available doctor cards to choose a provider.</p>
                    {validationField === 'doctor' && (
                      <p id="doctor-selection-error" role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {validationError}
                      </p>
                    )}
                    <span className="sr-only" role="status">{loading ? 'Loading doctors' : `${doctors.length} doctors loaded`}</span>
                  </div>
                )}

                {currentStep === 2 && (
                  <Card className="overflow-hidden p-0">
                    <div className="flex items-center gap-4 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-cyan-50/70 px-5 py-5 dark:border-primary-900/60 dark:from-primary-900/40 dark:to-cyan-950/20 sm:px-7 sm:py-6">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                        <CalendarDays className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-300">Appointment date</p>
                        <p className="mt-1 text-lg font-extrabold text-ink dark:text-white">{date ? formatDate(date) : 'Choose a date'}</p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-7">
                      <label htmlFor="appointment-date" className="label text-ink dark:text-slate-200">Select date</label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                        <input
                          ref={dateInputRef}
                          id="appointment-date"
                          type="date"
                          value={date}
                          onChange={(event) => {
                            setDate(event.target.value);
                            clearValidation('date');
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              handleNextStep();
                            }
                          }}
                          min={getMinDate()}
                          required
                          aria-invalid={validationField === 'date' || undefined}
                          aria-describedby={validationField === 'date' ? 'appointment-date-error appointment-date-help' : 'appointment-date-help'}
                          className="input-field h-14 bg-white pl-12 pr-4 text-base font-bold text-ink shadow-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      {validationField === 'date' && (
                        <p id="appointment-date-error" role="alert" className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {validationError}
                        </p>
                      )}
                      <p id="appointment-date-help" className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Booking is available from today onward.</p>
                    </div>
                  </Card>
                )}

                {currentStep === 3 && (
                  <Card className="overflow-hidden p-0">
                    <div className="flex items-center gap-4 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-cyan-50/70 px-5 py-5 dark:border-primary-900/60 dark:from-primary-900/40 dark:to-cyan-950/20 sm:px-7 sm:py-6">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                        <Clock className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-300">Available schedule</p>
                        <p className="mt-1 text-lg font-extrabold text-ink dark:text-white">{date ? formatDate(date) : 'Select a time slot'}</p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-7">
                      <fieldset>
                        <legend className="label text-ink dark:text-slate-200">Select a time</legend>
                        <div
                          ref={timeGroupRef}
                          role="group"
                          aria-label="Available time slots"
                          aria-describedby={validationField === 'time' ? 'time-slot-error' : undefined}
                          aria-invalid={validationField === 'time' || undefined}
                          tabIndex={-1}
                          className="grid grid-cols-2 gap-3 rounded-[18px] outline-none focus-visible:ring-4 focus-visible:ring-primary-500/15 sm:grid-cols-3 lg:grid-cols-4"
                        >
                          {timeSlots.map((slot) => {
                            const isSelected = time === slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setTime(slot);
                                  clearValidation('time');
                                }}
                                aria-pressed={isSelected}
                                className={cn(
                                  'relative min-h-14 rounded-2xl border px-3 py-3 text-sm font-extrabold outline-none transition-all focus-visible:ring-4 focus-visible:ring-primary-500/20',
                                  isSelected
                                    ? 'border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50/60 hover:text-primary-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-200'
                                )}
                              >
                                {slot}
                                {isSelected && <Check className="absolute right-2.5 top-2.5 h-3.5 w-3.5" aria-hidden="true" />}
                              </button>
                            );
                          })}
                        </div>
                        {validationField === 'time' && (
                          <p id="time-slot-error" role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {validationError}
                          </p>
                        )}
                      </fieldset>
                    </div>
                  </Card>
                )}

                {currentStep === 4 && (
                  <div className="space-y-5">
                    <Card className="overflow-hidden p-0">
                      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                          <Stethoscope className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-ink dark:text-white">Appointment summary</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Review your consultation details</p>
                        </div>
                      </div>
                      <dl className="divide-y divide-slate-100 px-5 dark:divide-slate-800 sm:px-6">
                        <div className="flex items-center gap-4 py-4">
                          <dt className="w-24 shrink-0 text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Doctor</dt>
                          <dd className="min-w-0 flex-1 text-right">
                            <p className="truncate text-sm font-extrabold text-ink dark:text-white">{selectedDoctor?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedDoctor?.specialty}</p>
                          </dd>
                        </div>
                        <div className="flex items-center gap-4 py-4">
                          <dt className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</dt>
                          <dd className="ml-auto text-right text-sm font-extrabold text-ink dark:text-white">{formatDate(date)}</dd>
                        </div>
                        <div className="flex items-center gap-4 py-4">
                          <dt className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Time</dt>
                          <dd className="ml-auto text-right text-sm font-extrabold text-ink dark:text-white">{time}</dd>
                        </div>
                      </dl>
                    </Card>

                    <fieldset>
                      <legend className="mb-3 text-lg font-extrabold tracking-tight text-ink dark:text-white">Consultation method</legend>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {consultationOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = type === option.value;

                          return (
                            <label
                              key={option.value}
                              htmlFor={`consultation-${option.value}`}
                              className={cn(
                                'flex cursor-pointer items-center gap-4 rounded-[20px] border-2 bg-white p-4 transition-all focus-within:ring-4 focus-within:ring-primary-500/20 dark:bg-slate-900 sm:p-5',
                                isSelected
                                  ? 'border-primary-600 bg-primary-50/70 shadow-soft dark:border-primary-500 dark:bg-primary-900/30'
                                  : 'border-slate-200 hover:border-primary-300 dark:border-slate-800 dark:hover:border-primary-700'
                              )}
                            >
                              <input
                                id={`consultation-${option.value}`}
                                type="radio"
                                name="type"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => setType(option.value)}
                                className="sr-only"
                              />
                              <span className={cn(
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors',
                                isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                              )} aria-hidden="true">
                                <Icon className="h-6 w-6" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-extrabold text-ink dark:text-white">{option.title}</span>
                                <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{option.description}</span>
                              </span>
                              <span className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                                isSelected ? 'border-primary-600 dark:border-primary-400' : 'border-slate-300 dark:border-slate-600'
                              )} aria-hidden="true">
                                {isSelected && <span className="h-3 w-3 rounded-full bg-primary-600 dark:bg-primary-400" />}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <Card className="overflow-hidden p-0 transition-shadow focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10">
                      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50 sm:px-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <label htmlFor="appointment-notes" className="text-sm font-extrabold text-ink dark:text-white">Additional details</label>
                          <p id="appointment-notes-help" className="text-xs text-slate-500 dark:text-slate-400">Optional · Briefly describe your symptoms</p>
                        </div>
                      </div>
                      <textarea
                        id="appointment-notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        aria-describedby="appointment-notes-help"
                        placeholder="Share anything you want your doctor to know before the consultation..."
                        rows={5}
                        className="min-h-[140px] w-full resize-y border-0 bg-white p-5 text-[15px] leading-7 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 sm:p-6"
                      />
                    </Card>
                  </div>
                )}
              </motion.section>
            </div>

            <aside className="hidden lg:block" aria-label="Appointment summary">
              <Card className="sticky top-4 overflow-hidden p-0" aria-live="polite">
                <div className="border-b border-primary-100 bg-gradient-to-br from-primary-50 to-cyan-50/60 px-6 py-5 dark:border-primary-900/60 dark:from-primary-900/40 dark:to-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-300">
                      <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-ink dark:text-white">Appointment summary</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Your booking at a glance</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Doctor</p>
                  {selectedDoctor ? (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-sm font-extrabold text-white shadow-md shadow-primary-600/20" aria-hidden="true">
                        {getDoctorInitials(selectedDoctor.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink dark:text-white">{selectedDoctor.name}</p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-primary-700 dark:text-primary-300">{selectedDoctor.specialty}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-3 dark:border-slate-700">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        <Stethoscope className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Choose an available doctor to begin.</p>
                    </div>
                  )}

                  <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

                  <dl className="space-y-4">
                    <div className="flex items-center gap-3">
                      <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      </dt>
                      <dd className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Date</p>
                        <p className="truncate text-sm font-extrabold text-ink dark:text-white">{formatDate(date)}</p>
                      </dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                      </dt>
                      <dd className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Time</p>
                        <p className="truncate text-sm font-extrabold text-ink dark:text-white">{time || 'Not selected'}</p>
                      </dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {type === 'audio' ? <PhoneCall className="h-4 w-4" aria-hidden="true" /> : <Video className="h-4 w-4" aria-hidden="true" />}
                      </dt>
                      <dd className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Consultation</p>
                        <p className="truncate text-sm font-extrabold text-ink dark:text-white">{type === 'audio' ? 'Voice call' : 'Video call'}</p>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Review each step before confirming your appointment.</p>
                </div>
              </Card>
            </aside>
          </div>
        </form>
      </motion.div>
    </PageShell>
  );
}
