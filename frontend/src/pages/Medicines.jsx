import { useState, useEffect } from 'react';
import { medicineAPI } from '../services/api';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  AlertCircle,
  ChevronRight,
  MapPin,
  Navigation,
  Pill,
  Search,
  Store,
  XCircle
} from 'lucide-react';
import {
  EmptyState,
  IconBadge,
  InlineNotice,
  PageHeader,
  PageShell,
  SectionHeader,
  Skeleton,
  StatusBadge
} from '../components/ui/PagePrimitives';

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [pharmacyError, setPharmacyError] = useState('');
  const [searchError, setSearchError] = useState('');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setPharmaciesLoading(true);
    setPharmacyError('');
    try {
      const response = await medicineAPI.getPharmacies();
      setPharmacies(response.data);
    } catch {
      setPharmacyError('The pharmacy directory could not be loaded from the service. Showing the available directory instead.');
      setPharmacies([
        { name: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura', city: 'Nabha' },
        { name: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala', city: 'Nabha' },
        { name: 'Pardeep Medicos', address: 'Patiala Gate', city: 'Nabha' },
        { name: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road', city: 'Nabha' },
        { name: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road', city: 'Nabha' },
        { name: 'Raja Medical Hall', address: 'Inside Alohran Gate, Ghas Mandi Road', city: 'Nabha' },
        { name: 'Royal Medical Store', address: 'Laxman Nagar', city: 'Nabha' },
        { name: 'Bakshi Healthcare', address: 'Malerkotla Road', city: 'Nabha' },
        { name: 'Shakti Medical Agency', address: 'Cinema Road, Guru Nanak Pura', city: 'Nabha' },
        { name: 'Dhanjal Medical Hall', address: 'Civil Hospital Road', city: 'Nabha' }
      ]);
    } finally {
      setPharmaciesLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setSearchError('');
    try {
      const response = await medicineAPI.searchMedicines(searchQuery);
      setMedicines(response.data);
    } catch {
      setSearchError('Live search is unavailable right now. Showing sample availability results instead.');
      const demoMedicines = {
        [searchQuery]: [
          { pharmacy: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura, Nabha', available: true, price: 25, distance: 1.2 },
          { pharmacy: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala, Nabha', available: false, price: null, distance: 2.5 },
          { pharmacy: 'Pardeep Medicos', address: 'Patiala Gate, Nabha', available: true, price: 28, distance: 1.8 },
          { pharmacy: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road, Nabha', available: true, price: 22, distance: 2.0 },
          { pharmacy: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road, Nabha', available: true, price: 30, distance: 3.5 },
          { pharmacy: 'Royal Medical Store', address: 'Laxman Nagar, Nabha', available: true, price: 26, distance: 2.8 }
        ]
      };
      setMedicines(demoMedicines);
    } finally {
      setLoading(false);
    }
  };

  const commonMedicines = [
    'Paracetamol', 'Cetirizine', 'Ibuprofen', 'Azithromycin',
    'Amoxicillin', 'ORS', 'Cough Syrup', 'Antacid'
  ];

  const handleQuickSearch = (medicine) => {
    setSearchQuery(medicine);
    setLoading(true);
    setSearched(true);
    setSearchError('Quick search is showing sample availability results.');

    setTimeout(() => {
      const demoMedicines = {
        [medicine]: [
          { pharmacy: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 1.2 },
          { pharmacy: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala, Nabha', available: Math.random() > 0.5, price: Math.floor(Math.random() * 50) + 10, distance: 2.5 },
          { pharmacy: 'Pardeep Medicos', address: 'Patiala Gate, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 1.8 },
          { pharmacy: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.0 },
          { pharmacy: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 3.5 },
          { pharmacy: 'Royal Medical Store', address: 'Laxman Nagar, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.8 },
          { pharmacy: 'Bakshi Healthcare', address: 'Malerkotla Road, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 3.2 },
          { pharmacy: 'Raja Medical Hall', address: 'Inside Alohran Gate, Ghas Mandi Road, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.3 }
        ]
      };
      setMedicines(demoMedicines);
      setLoading(false);
    }, 600);
  };

  const handleGetDirections = (pharmacyName, address, e) => {
    if (e) {
      e.stopPropagation();
    }

    const fullAddress = address ? `${pharmacyName}, ${address}` : pharmacyName;
    const searchQuery = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMedicines([]);
    setSearched(false);
    setSearchError('');
  };

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

  return (
    <PageShell className="py-8 sm:py-10">
      <motion.div variants={containerVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
        <PageHeader
          eyebrow="Local pharmacy finder"
          title="Find medicines nearby"
          description="Search for a medicine to view pharmacy availability, pricing, and directions."
          icon={Pill}
        />

        {pharmacyError && (
          <InlineNotice icon={AlertCircle} title="Using the available pharmacy directory" tone="warning" className="mb-6">
            {pharmacyError}
          </InlineNotice>
        )}

        <Card className="mb-8 overflow-hidden p-0 shadow-premium">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-br from-primary-50/80 via-white to-slate-50 p-6 dark:border-slate-800 dark:from-primary-900/25 dark:via-slate-900 dark:to-slate-900 sm:flex-row sm:items-center sm:p-8">
            <IconBadge icon={Pill} tone="primary" size="lg" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Medicine search</p>
              <h2 className="text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">What are you looking for?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Use the medicine name exactly as it appears on your prescription.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-primary-700 dark:border-primary-800/70 dark:bg-slate-900/70 dark:text-primary-300">
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              Pharmacy availability
            </span>
          </div>

          <form onSubmit={handleSearch} className="p-6 sm:p-8">
            <label htmlFor="medicine-search" className="label">Medicine name</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <input
                  id="medicine-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a medicine, e.g. Paracetamol"
                  autoComplete="off"
                  className="input-field h-16 border-2 border-slate-200 bg-white pl-14 pr-12 text-lg font-semibold dark:border-slate-700 dark:bg-slate-800/70"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear medicine search"
                    className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                icon={Search}
                disabled={loading || !searchQuery.trim()}
                isLoading={loading}
                className="h-16 w-full sm:w-36"
                loadingText="Searching"
              >
                Search
              </Button>
            </div>

            <div className="mt-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Quick searches</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {commonMedicines.map((medicine) => (
                  <button
                    key={medicine}
                    type="button"
                    onClick={() => handleQuickSearch(medicine)}
                    className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-[background-color,border-color,color] duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/35 dark:hover:text-primary-300"
                  >
                    {medicine}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Card>

        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div key="search-loading" variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-56" />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400" role="status">Searching pharmacies…</span>
              </div>
              <Card className="space-y-5 p-5 sm:p-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                ))}
              </Card>
            </motion.div>
          ) : searched && Object.keys(medicines).length > 0 ? (
            <motion.div key="search-results" variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" className="space-y-5">
              {searchError && (
                <InlineNotice icon={AlertCircle} title="Sample availability shown" tone="warning">
                  {searchError}
                </InlineNotice>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow="Search results"
                  title="Pharmacy availability"
                  description="Availability and pricing are shown for each pharmacy result."
                  className="mb-0 flex-1"
                />
                <span className="pb-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {Object.values(medicines).reduce((total, availability) => total + availability.length, 0)} results
                </span>
              </div>
              {Object.entries(medicines).map(([medicineName, availability]) => (
                <MedicineResultCard
                  key={medicineName}
                  medicineName={medicineName}
                  availability={availability}
                  onDirections={handleGetDirections}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>
          ) : searched ? (
            <motion.div key="no-results" variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
              <EmptyState
                icon={Search}
                title="No results found"
                description={`We couldn't find “${searchQuery || 'that medicine'}” in our local database. Try a different medicine name or check the spelling.`}
                action={<Button variant="secondary" onClick={clearSearch}>Clear search</Button>}
                className="min-h-[25rem]"
              />
            </motion.div>
          ) : (
            <motion.div key="pharmacy-directory" variants={itemVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
              <SectionHeader
                eyebrow="Local directory"
                title="Pharmacies in your area"
                description="Browse pharmacy details available through the service."
                action={!pharmaciesLoading && pharmacies.length > 0 ? <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{pharmacies.length} listed</span> : null}
                className="mb-6"
              />
              {pharmaciesLoading ? (
                <PharmacySkeleton />
              ) : pharmacies.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pharmacies.map((pharmacy, index) => (
                    <PharmacyCard key={index} pharmacy={pharmacy} onDirections={handleGetDirections} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Store}
                  title="No pharmacies listed"
                  description="Pharmacy details will appear here when they are available from the service."
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageShell>
  );
}

function MedicineResultCard({ medicineName, availability, onDirections, reduceMotion }) {
  return (
    <motion.div variants={reduceMotion ? undefined : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } } }} initial={reduceMotion ? false : 'hidden'} animate="visible">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/45 sm:flex-row sm:items-center sm:p-6">
          <IconBadge icon={Pill} tone="primary" size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-300">Medicine</p>
            <h2 className="mt-1 truncate text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">{medicineName}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Availability by pharmacy</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <Store className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
            {availability.length} {availability.length === 1 ? 'pharmacy' : 'pharmacies'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {availability.sort((a, b) => (b.available === a.available) ? 0 : a.available ? 1 : -1).map((item, index) => (
            <article key={index} className="flex flex-col gap-5 p-5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/35 lg:flex-row lg:items-center lg:justify-between lg:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <IconBadge icon={Store} tone={item.available ? 'success' : 'danger'} size="md" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-extrabold tracking-tight text-ink dark:text-white">{item.pharmacy}</h3>
                    <StatusBadge
                      status={item.available ? 'available' : 'unavailable'}
                      label={item.available ? 'In Stock' : 'Out of Stock'}
                    />
                  </div>
                  {item.address && (
                    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      {item.address}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.distance != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                        {item.distance} km away
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 lg:min-w-[9.5rem] lg:justify-end lg:border-0 lg:pt-0">
                {item.available && item.price && (
                  <div className="text-left lg:text-right">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Price</p>
                    <p className="mt-0.5 text-xl font-extrabold text-ink dark:text-white">₹{item.price}</p>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Navigation}
                  onClick={(event) => onDirections(item.pharmacy, item.address, event)}
                  aria-label={`Get directions to ${item.pharmacy}`}
                  className="shrink-0"
                >
                  Directions
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function PharmacyCard({ pharmacy, onDirections }) {
  return (
    <Card
      hoverEffect
      onClick={() => onDirections(pharmacy.name || pharmacy, `${pharmacy.address || ''}, ${pharmacy.city || 'Nabha'}`)}
      className="group flex h-full cursor-pointer flex-col border-transparent transition-[border-color,box-shadow] hover:border-primary-200 dark:hover:border-primary-800"
    >
      <div className="flex items-start justify-between gap-4">
        <IconBadge icon={Store} tone="primary" size="md" />
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Pharmacy
        </span>
      </div>
      <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink dark:text-white">{pharmacy.name || pharmacy}</h3>
      <div className="mt-2 min-w-0 flex-1">
        {pharmacy.address && (
          <p className="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            {pharmacy.address}
          </p>
        )}
        {pharmacy.city && <p className="mt-1 pl-6 text-sm text-slate-500 dark:text-slate-400">{pharmacy.city}</p>}
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={Navigation}
        onClick={(event) => onDirections(pharmacy.name || pharmacy, `${pharmacy.address || ''}, ${pharmacy.city || 'Nabha'}`, event)}
        aria-label={`Get directions to ${pharmacy.name || pharmacy}`}
        className="mt-5 w-full justify-between px-3 text-primary-700 dark:text-primary-300"
      >
        Get directions
        <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
      </Button>
    </Card>
  );
}

function PharmacySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-11 w-11 rounded-[14px]" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </Card>
      ))}
      <span className="sr-only" role="status">Loading pharmacies</span>
    </div>
  );
}
