import { useState, useEffect } from 'react';
import { recordAPI } from '../services/api';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Activity,
  AlertCircle,
  Calendar,
  ClipboardList,
  Download,
  FileText,
  HeartPulse,
  Pill,
  Sparkles,
  Stethoscope,
  Thermometer
} from 'lucide-react';
import {
  DataPanel,
  EmptyState,
  IconBadge,
  InlineNotice,
  PageHeader,
  PageShell,
  SectionHeader,
  Skeleton,
  StatusBadge
} from '../components/ui/PagePrimitives';
import { cn } from '../lib/utils';

const recordTabs = [
  { id: 'all', label: 'All Records', icon: ClipboardList },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'checkups', label: 'Routine Checkups', icon: Stethoscope },
  { id: 'ai_history', label: 'AI History', icon: Sparkles }
];

export default function HealthRecords({ user }) {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [aiHistory, setAiHistory] = useState([]);
  const [selectedAiRecord, setSelectedAiRecord] = useState(null);
  const [error, setError] = useState('');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchRecords();
    try {
      const storedAiHistory = JSON.parse(localStorage.getItem('aiSymptomHistory') || '[]');
      setAiHistory(Array.isArray(storedAiHistory) ? storedAiHistory : []);
    } catch {
      localStorage.removeItem('aiSymptomHistory');
      setAiHistory([]);
    }
  }, []);

  const fetchRecords = async () => {
    setError('');
    try {
      const response = await recordAPI.getRecords({ patientId: user?.uid });
      const mappedRecords = response.data.map(r => ({
        ...r,
        doctorName: r.doctor?.name || r.doctorName || 'Unknown Doctor'
      }));
      setRecords(mappedRecords);
      setSelectedRecord(mappedRecords[0] || null);
    } catch {
      setError('Your records could not be loaded from the service. No sample records are shown.');
      setRecords([]);
      setSelectedRecord(null);
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

  const downloadRecord = (record) => {
    if (!record) return;
    const file = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-record-${record.id || 'record'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRecords = records.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'prescriptions') return record.prescription?.length > 0;
    if (activeTab === 'checkups') return record.diagnosis === 'Routine Checkup';
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.35, staggerChildren: reduceMotion ? 0 : 0.07 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }
    }
  };

  if (loading) {
    return (
      <PageShell className="py-8 sm:py-10">
        <PageHeader
          eyebrow="Your care, in one view"
          title="Health Records"
          description="Review your medical history, prescriptions, vitals, and saved symptom checker entries."
          icon={HeartPulse}
        />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-[14px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </Card>
            ))}
          </div>
          <div className="lg:col-span-7">
            <DataPanel className="p-6 sm:p-8">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="mt-4 h-4 w-2/3" />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 w-full" />)}
              </div>
              <Skeleton className="mt-8 h-40 w-full" />
            </DataPanel>
          </div>
        </div>
        <span className="sr-only" role="status">Loading health records</span>
      </PageShell>
    );
  }

  return (
    <PageShell className="py-8 sm:py-10">
      <motion.div variants={containerVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
        <PageHeader
          eyebrow="Your care, in one view"
          title="Health Records"
          description="A clear, organized view of your medical history, prescriptions, and saved symptom checker entries."
          icon={HeartPulse}
          actions={selectedRecord ? (
            <Button variant="secondary" icon={Download} onClick={() => downloadRecord(selectedRecord)}>Download</Button>
          ) : null}
        />

        {error && (
          <InlineNotice icon={AlertCircle} title="Records unavailable" tone="warning" className="mb-6">
            {error}
          </InlineNotice>
        )}

        <div className="mb-7 rounded-[22px] border border-slate-200/80 bg-white p-2 shadow-card dark:border-white/[0.08] dark:bg-slate-900/80">
          <div className="hide-scrollbars flex gap-2 overflow-x-auto" role="tablist" aria-label="Health record categories">
            {recordTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[16px] px-4 py-2.5 text-sm font-bold transition-[background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:px-5',
                  activeTab === id
                    ? 'bg-primary-600 text-white shadow-[0_12px_24px_-16px_rgba(18,104,177,0.7)]'
                    : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-5" aria-label="Record timeline">
            <SectionHeader
              eyebrow={activeTab === 'ai_history' ? 'Saved on this device' : 'Chronological view'}
              title={activeTab === 'ai_history' ? 'AI symptom history' : 'Record timeline'}
              description={activeTab === 'ai_history'
                ? 'Review previous symptom checker entries stored in this browser.'
                : 'Select a record to view the details saved for that visit.'}
              className="mb-5"
            />
            <div role="tabpanel" aria-label={activeTab === 'ai_history' ? 'AI symptom history' : 'Medical record timeline'}>
              <AnimatePresence mode="popLayout" initial={false}>
                {activeTab === 'ai_history' ? (
                  aiHistory.length > 0 ? (
                    aiHistory.map((aiRecord, idx) => (
                      <AiTimelineCard
                        key={idx}
                        aiRecord={aiRecord}
                        index={idx}
                        selected={selectedAiRecord?.date === aiRecord.date}
                        onSelect={() => setSelectedAiRecord(aiRecord)}
                        formatDate={formatDate}
                        reduceMotion={reduceMotion}
                        itemVariants={itemVariants}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={Sparkles}
                      title="No AI history yet"
                      description="Symptom checker entries saved on this device will appear here."
                    />
                  )
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <RecordTimelineCard
                      key={record.id}
                      record={record}
                      selected={selectedRecord?.id === record.id}
                      onSelect={() => setSelectedRecord(record)}
                      formatDate={formatDate}
                      reduceMotion={reduceMotion}
                      itemVariants={itemVariants}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={activeTab === 'checkups' ? Stethoscope : FileText}
                    title={activeTab === 'all' ? 'No records listed' : activeTab === 'checkups' ? 'No routine checkups listed' : 'No prescriptions listed'}
                    description={activeTab === 'all'
                      ? 'Medical records will appear here when they are available.'
                      : activeTab === 'checkups'
                        ? 'Routine checkup records will appear here when they are available.'
                        : 'Records with a prescribed medicine list will appear here.'}
                  />
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="lg:col-span-7" aria-label="Selected record details">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab !== 'ai_history' && selectedRecord ? (
                <MedicalRecordDetail
                  key={selectedRecord.id}
                  record={selectedRecord}
                  formatDate={formatDate}
                  reduceMotion={reduceMotion}
                  onDownload={downloadRecord}
                />
              ) : activeTab === 'ai_history' && selectedAiRecord ? (
                <AiRecordDetail
                  key={selectedAiRecord.date}
                  record={selectedAiRecord}
                  formatDate={formatDate}
                  reduceMotion={reduceMotion}
                />
              ) : (
                <motion.div
                  key="empty-detail"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <EmptyState
                    icon={activeTab === 'ai_history' ? Sparkles : FileText}
                    title={activeTab === 'ai_history' ? 'Select an AI entry' : 'Select a record'}
                    description="Choose an item from the timeline to see its saved details here."
                    className="min-h-[28rem]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </motion.div>
    </PageShell>
  );
}

function RecordTimelineCard({ record, selected, onSelect, formatDate, reduceMotion, itemVariants }) {
  const hasPrescription = record.prescription?.length > 0;

  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-7 z-10 h-3 w-3 rounded-full border-2 border-white bg-primary-500 shadow-[0_0_0_3px_rgba(31,134,214,0.12)] dark:border-slate-900" aria-hidden="true" />
      <motion.div variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" layout={!reduceMotion} className="mb-4 last:mb-0">
        <Card hoverEffect className={cn('overflow-hidden p-0 transition-[border-color,box-shadow] duration-200', selected ? 'border-primary-300 ring-2 ring-primary-500/15 dark:border-primary-700' : 'hover:border-primary-200 dark:hover:border-primary-800')}>
          <button type="button" onClick={onSelect} aria-pressed={selected} className="group block w-full p-5 text-left sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <IconBadge icon={FileText} tone={selected ? 'primary' : 'neutral'} />
              {hasPrescription && (
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold',
                  selected
                    ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-900/45 dark:text-primary-300'
                    : 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                )}>
                  <Pill className="h-3.5 w-3.5" aria-hidden="true" />
                  {record.prescription.length} meds
                </span>
              )}
            </div>
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Medical record</p>
              <h3 className="text-lg font-extrabold leading-snug tracking-tight text-ink dark:text-white sm:text-xl">
                {record.diagnosis || 'Medical record'}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Stethoscope className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                {record.doctorName}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                {formatDate(record.date)}
              </p>
            </div>
            <span className="mt-5 inline-flex min-h-10 items-center text-sm font-bold text-primary-700 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-primary-300">
              View details
            </span>
          </button>
        </Card>
      </motion.div>
    </div>
  );
}

function AiTimelineCard({ aiRecord, selected, onSelect, formatDate, reduceMotion, itemVariants }) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-7 z-10 h-3 w-3 rounded-full border-2 border-white bg-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.14)] dark:border-slate-900" aria-hidden="true" />
      <motion.div variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" layout={!reduceMotion} className="mb-4 last:mb-0">
        <Card hoverEffect className={cn('overflow-hidden p-0 transition-[border-color,box-shadow] duration-200', selected ? 'border-violet-300 ring-2 ring-violet-500/15 dark:border-violet-700' : 'hover:border-violet-200 dark:hover:border-violet-800')}>
          <button type="button" onClick={onSelect} aria-pressed={selected} className="group block w-full p-5 text-left sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <IconBadge icon={Sparkles} tone="primary" />
              <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/40 dark:text-violet-300">AI Analysis</span>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Reported symptoms</p>
              <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-ink dark:text-white sm:text-xl">
                {aiRecord.symptoms || 'Symptoms not provided'}
              </h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                {formatDate(aiRecord.date)}
              </p>
            </div>
            <span className="mt-5 inline-flex min-h-10 items-center text-sm font-bold text-violet-700 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-violet-300">
              View entry
            </span>
          </button>
        </Card>
      </motion.div>
    </div>
  );
}

function MedicalRecordDetail({ record, formatDate, reduceMotion, onDownload }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden p-0">
        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-primary-50 via-white to-slate-50 p-6 dark:border-slate-800 dark:from-primary-900/25 dark:via-slate-900 dark:to-slate-900 sm:p-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-700/10" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <StatusBadge status="available" label="Record available" />
                <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-ink dark:text-white sm:text-3xl">
                  {record.diagnosis || 'Medical record'}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                    {record.doctorName}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                    {formatDate(record.date)}
                  </span>
                </div>
              </div>
              <Button variant="secondary" icon={Download} onClick={() => onDownload(record)} className="w-full sm:w-auto">Download</Button>
            </div>
          </div>
        </div>

        <div className="space-y-9 p-6 sm:p-8">
          {record.vitals && (
            <section aria-labelledby="vitals-heading">
              <div className="mb-4 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-rose-500" aria-hidden="true" />
                <h3 id="vitals-heading" className="text-lg font-extrabold tracking-tight text-ink dark:text-white">Patient vitals</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <VitalTile icon={Thermometer} label="Temperature" value={record.vitals.temperature} tone="rose" />
                <VitalTile icon={Activity} label="Blood pressure" value={record.vitals.bp} tone="blue" />
                <VitalTile icon={HeartPulse} label="Pulse rate" value={record.vitals.pulse} tone="indigo" />
              </div>
            </section>
          )}

          <section aria-labelledby="prescription-heading">
            <div className="mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
              <h3 id="prescription-heading" className="text-lg font-extrabold tracking-tight text-ink dark:text-white">Prescribed medicines</h3>
            </div>
            {record.prescription?.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/70">
                <table className="w-full min-w-[620px] text-left">
                  <thead className="bg-slate-50/90 dark:bg-slate-800/70">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Medicine</th>
                      <th scope="col" className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Dosage</th>
                      <th scope="col" className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Schedule</th>
                      <th scope="col" className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {record.prescription.map((medicine, index) => (
                      <tr key={`${medicine.medicine}-${index}`} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-5 py-4 text-sm font-extrabold text-ink dark:text-white">{medicine.medicine}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{medicine.dosage}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{medicine.frequency}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{medicine.duration}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <InlineNotice icon={ClipboardList} title="No prescription listed" tone="info">
                No medicine list is included in this record.
              </InlineNotice>
            )}
          </section>

          {record.notes && (
            <section aria-labelledby="notes-heading">
              <div className="mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-violet-500" aria-hidden="true" />
                <h3 id="notes-heading" className="text-lg font-extrabold tracking-tight text-ink dark:text-white">Physician&apos;s notes</h3>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 dark:border-violet-900/40 dark:bg-violet-950/20 sm:p-6">
                <p className="leading-7 text-slate-700 dark:text-slate-200">“{record.notes}”</p>
              </div>
            </section>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function AiRecordDetail({ record, formatDate, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden p-0">
        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 dark:border-slate-800 dark:from-violet-950/25 dark:via-slate-900 dark:to-slate-900 sm:p-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-700/10" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/45 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI symptom checker result
            </span>
            <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-ink dark:text-white sm:text-3xl">
              Reported: {record.symptoms || 'Symptoms not provided'}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
              {formatDate(record.date)}
            </p>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <InlineNotice icon={Sparkles} title="Saved AI history" tone="info">
            This entry is a saved symptom checker result from this device.
          </InlineNotice>

          {record.analysis?.possibleConditions && (
            <section aria-labelledby="conditions-heading">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                <h3 id="conditions-heading" className="text-lg font-extrabold tracking-tight text-ink dark:text-white">Possible conditions</h3>
              </div>
              <ul className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                {record.analysis.possibleConditions.map((condition, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
                    {condition}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {record.analysis?.advice && (
            <section aria-labelledby="advice-heading">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                <h3 id="advice-heading" className="text-lg font-extrabold tracking-tight text-ink dark:text-white">Advice</h3>
              </div>
              <ul className="space-y-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 dark:border-primary-800/60 dark:bg-primary-900/25">
                {record.analysis.advice.map((advice, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-6 text-primary-900 dark:text-primary-100">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
                    {advice}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function VitalTile({ icon: Icon, label, value, tone }) {
  const tones = {
    rose: 'border-rose-100 bg-rose-50/70 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
    blue: 'border-blue-100 bg-blue-50/70 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300',
    indigo: 'border-indigo-100 bg-indigo-50/70 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300'
  };

  return (
    <div className={cn('rounded-2xl border p-4', tones[tone])}>
      <Icon className="h-5 w-5" aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-ink dark:text-white">{value || '—'}</p>
    </div>
  );
}
