import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  LocateFixed,
  MapPin,
  PackageSearch,
  Pill,
  RefreshCw,
  Search,
  Store,
  X,
  XCircle
} from 'lucide-react';
import { medicineAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  EmptyState,
  IconBadge,
  InlineNotice,
  PageHeader,
  PageShell,
  SectionHeader,
  Skeleton
} from '../components/ui/PagePrimitives';

const LOCATION_STORAGE_KEY = 'swasthyaConnect.medicineLocation';
const PROVIDER_NAMES = ['PharmEasy', 'Apollo Pharmacy', '1mg'];
const SORT_OPTIONS = [
  { value: 'availability', label: 'Availability' },
  { value: 'price', label: 'Price' },
  { value: 'provider', label: 'Provider' }
];
const AVAILABILITY_VALUES = new Set(['in-stock', 'out-of-stock', 'not-serviceable', 'unknown']);
const AVAILABILITY_ORDER = {
  'in-stock': 0,
  'out-of-stock': 1,
  'not-serviceable': 2,
  unknown: 3
};

function normalizePincode(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 6);
}

function getStoredLocation() {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return null;
    const pincode = normalizePincode(stored.pincode);
    if (!/^[1-9][0-9]{5}$/.test(pincode)) return null;
    return {
      pincode,
      area: typeof stored.area === 'string' ? stored.area : '',
      city: typeof stored.city === 'string' ? stored.city : '',
      state: typeof stored.state === 'string' ? stored.state : ''
    };
  } catch {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    return null;
  }
}

function storeLocation(location) {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
      pincode: location.pincode,
      area: location.area || '',
      city: location.city || '',
      state: location.state || ''
    }));
  } catch {
    return;
  }
}

function getLocationLabel(location) {
  if (!location?.pincode) return 'Location not selected';
  const locality = [location.area, location.city]
    .filter(Boolean)
    .filter((value, index, values) => values.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index)
    .join(', ');
  return `${locality || location.state || 'PIN code'} — ${location.pincode}`;
}

function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      const error = new Error('Geolocation is not supported by this browser.');
      error.code = 'unsupported';
      reject(error);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        const locationError = new Error(error.message || 'Location could not be detected.');
        locationError.code = error.code;
        reject(locationError);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  });
}

async function fetchJsonWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Location service unavailable');
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function extractLocationDetails(data) {
  const address = data?.address && typeof data.address === 'object' ? data.address : {};
  return {
    area: address.suburb || address.neighbourhood || address.city_district || address.quarter || address.locality || '',
    city: address.city || address.town || address.village || address.county || '',
    state: address.state || '',
    pincode: normalizePincode(address.postcode || address.pincode)
  };
}

async function reverseGeocode(latitude, longitude) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('layer', 'address');
  url.searchParams.set('accept-language', 'en');
  const data = await fetchJsonWithTimeout(url);
  const details = extractLocationDetails(data);
  if (!/^[1-9][0-9]{5}$/.test(details.pincode)) {
    throw new Error('A PIN code could not be determined for this location.');
  }
  return details;
}

async function geocodePincode(pincode) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', `${pincode}, India`);
  url.searchParams.set('countrycodes', 'in');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '5');
  const data = await fetchJsonWithTimeout(url);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('This PIN code could not be mapped to an area.');
  }
  const match = data.find((item) => normalizePincode(item?.address?.postcode) === pincode);
  if (!match) throw new Error('This PIN code could not be mapped to an area.');
  const details = extractLocationDetails(match);
  return { ...details, pincode };
}

function getLocationErrorMessage(error) {
  if (error?.code === 1) return 'Location permission was denied. Enter a PIN code manually.';
  if (error?.code === 2) return 'Your location is unavailable. Try again or enter a PIN code manually.';
  if (error?.code === 3) return 'Location detection timed out. Try again or enter a PIN code manually.';
  if (error?.code === 'unsupported') return 'This browser does not support location detection. Enter a PIN code manually.';
  if (error?.name === 'AbortError') return 'The area and PIN code lookup timed out. Enter a PIN code manually.';
  return error?.message || 'We could not determine your location. Enter a PIN code manually.';
}

function getSearchErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') return 'The medicine search took too long. Please try again.';
  if (error?.response?.status === 400) return error.response.data?.message || 'Enter a medicine name and a valid Indian PIN code.';
  if (error?.response?.status === 503) return 'Medicine search is not configured or is temporarily unavailable. Please try again later.';
  if (!error?.response) return 'We could not reach the medicine search service. Please check your connection and try again.';
  return 'Medicine search is temporarily unavailable. Please try again.';
}

function sanitizeResults(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && typeof item === 'object' && typeof item.medicineName === 'string' && item.medicineName.trim())
    .map((item, index) => ({
      ...item,
      medicineName: item.medicineName.trim(),
      provider: typeof item.provider === 'string' ? item.provider : 'Provider',
      availability: AVAILABILITY_VALUES.has(item.availability) ? item.availability : 'unknown',
      locationSpecific: item.locationSpecific === true,
      resultKey: `${item.provider || 'provider'}-${item.medicineName}-${item.url || 'result'}-${index}`
    }));
}

function sortItems(items, sortBy) {
  return [...items].sort((left, right) => {
    if (sortBy === 'price') {
      const leftPrice = Number.isFinite(left.price) ? left.price : Number.POSITIVE_INFINITY;
      const rightPrice = Number.isFinite(right.price) ? right.price : Number.POSITIVE_INFINITY;
      if (leftPrice !== rightPrice) return leftPrice - rightPrice;
    }
    if (sortBy === 'provider') {
      const providerComparison = left.provider.localeCompare(right.provider);
      if (providerComparison !== 0) return providerComparison;
    }
    if (sortBy === 'availability') {
      const availabilityComparison = AVAILABILITY_ORDER[left.availability] - AVAILABILITY_ORDER[right.availability];
      if (availabilityComparison !== 0) return availabilityComparison;
    }
    return left.provider.localeCompare(right.provider) || left.medicineName.localeCompare(right.medicineName);
  });
}

function groupResults(items, sortBy) {
  const groups = new Map();
  for (const item of items) {
    const key = item.medicineName.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()].map((group) => sortItems(group, sortBy));
}

function availabilityPresentation(item, pincode) {
  if (item.availability === 'in-stock' && item.locationSpecific) {
    return {
      label: `In stock for ${pincode}`,
      description: 'The provider supplied location-specific availability.',
      icon: CheckCircle2,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/35 dark:text-emerald-200'
    };
  }
  if (item.availability === 'in-stock') {
    return {
      label: 'Available online',
      description: `Local availability is not confirmed for ${pincode}.`,
      icon: CheckCircle2,
      className: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-800/70 dark:bg-cyan-950/30 dark:text-cyan-200'
    };
  }
  if (item.availability === 'out-of-stock') {
    return {
      label: 'Out of stock',
      description: item.locationSpecific ? `The provider reports no stock for ${pincode}.` : 'The provider reports this medicine as out of stock.',
      icon: XCircle,
      className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800/70 dark:bg-red-950/30 dark:text-red-200'
    };
  }
  if (item.availability === 'not-serviceable') {
    return {
      label: 'Not serviceable',
      description: `The provider reports that it cannot serve ${pincode}.`,
      icon: MapPin,
      className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-100'
    };
  }
  return {
    label: 'Availability not confirmed',
    description: 'The medicine was found in the provider catalog.',
    icon: CircleHelp,
    className: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
  };
}

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [location, setLocation] = useState(getStoredLocation);
  const [locationState, setLocationState] = useState(location ? 'ready' : 'idle');
  const [locationMessage, setLocationMessage] = useState('');
  const [locationEditorOpen, setLocationEditorOpen] = useState(false);
  const [pincode, setPincode] = useState(location?.pincode || '');
  const [pincodeError, setPincodeError] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [results, setResults] = useState([]);
  const [providers, setProviders] = useState([]);
  const [sortBy, setSortBy] = useState('availability');
  const requestSequence = useRef(0);
  const reduceMotion = useReducedMotion();

  const applyLocation = useCallback((nextLocation) => {
    setLocation(nextLocation);
    setPincode(nextLocation.pincode);
    setLocationState('ready');
    setLocationMessage('');
    storeLocation(nextLocation);
  }, []);

  const detectLocation = useCallback(async () => {
    setLocationState('detecting');
    setLocationMessage('Detecting your location...');
    try {
      const position = await getBrowserPosition();
      setLocationState('resolving');
      setLocationMessage('Finding your area and PIN code...');
      const resolvedLocation = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      applyLocation(resolvedLocation);
    } catch (error) {
      setLocationState('error');
      setLocationMessage(getLocationErrorMessage(error));
    }
  }, [applyLocation]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const performSearch = useCallback(async (medicine, selectedLocation) => {
    const normalizedMedicine = medicine.trim();
    const selectedPincode = normalizePincode(selectedLocation?.pincode);

    setSubmittedQuery(normalizedMedicine);
    setSearchQuery(normalizedMedicine);
    setSearched(true);
    setSearchError('');

    if (normalizedMedicine.length < 2) {
      setSearchError('Enter at least 2 characters for the medicine name.');
      setResults([]);
      setProviders([]);
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(selectedPincode)) {
      setSearchError('Select or enter a valid Indian PIN code before searching.');
      setLocationEditorOpen(true);
      setResults([]);
      setProviders([]);
      return;
    }

    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;
    setSearching(true);

    try {
      const response = await medicineAPI.searchNearbyMedicines({
        medicine: normalizedMedicine,
        pin: selectedPincode
      });
      if (requestId !== requestSequence.current) return;
      setResults(sanitizeResults(response.data?.results));
      setProviders(Array.isArray(response.data?.providers) ? response.data.providers : []);
    } catch (error) {
      if (requestId !== requestSequence.current) return;
      setResults([]);
      setProviders([]);
      setSearchError(getSearchErrorMessage(error));
    } finally {
      if (requestId === requestSequence.current) setSearching(false);
    }
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    performSearch(searchQuery, location);
  };

  const handleQuickSearch = (medicine) => {
    performSearch(medicine, location);
  };

  const handleUpdateLocation = async (event) => {
    event.preventDefault();
    const normalizedPincode = normalizePincode(pincode);
    if (!/^[1-9][0-9]{5}$/.test(normalizedPincode)) {
      setPincodeError('Enter a valid 6-digit Indian PIN code.');
      return;
    }

    setPincodeError('');
    setLocationState('resolving');
    setLocationMessage('Finding the area for this PIN code...');
    let resolvedLocation = { pincode: normalizedPincode, area: '', city: '', state: '' };
    let resolutionMessage = '';

    try {
      resolvedLocation = await geocodePincode(normalizedPincode);
    } catch {
      resolutionMessage = `Area lookup was unavailable. Searching with PIN ${normalizedPincode}.`;
    }

    applyLocation(resolvedLocation);
    setLocationMessage(resolutionMessage);
    setLocationEditorOpen(false);
    const medicineToSearch = submittedQuery || searchQuery.trim();
    if (medicineToSearch) await performSearch(medicineToSearch, resolvedLocation);
  };

  const clearSearch = () => {
    requestSequence.current += 1;
    setSearchQuery('');
    setSubmittedQuery('');
    setSearched(false);
    setSearchError('');
    setResults([]);
    setProviders([]);
    setSearching(false);
  };

  const availableGroups = useMemo(
    () => groupResults(results.filter((item) => item.availability === 'in-stock'), sortBy),
    [results, sortBy]
  );
  const outOfStockGroups = useMemo(
    () => groupResults(results.filter((item) => item.availability === 'out-of-stock'), sortBy),
    [results, sortBy]
  );
  const notServiceableGroups = useMemo(
    () => groupResults(results.filter((item) => item.availability === 'not-serviceable'), sortBy),
    [results, sortBy]
  );
  const unknownGroups = useMemo(
    () => groupResults(results.filter((item) => item.availability === 'unknown'), sortBy),
    [results, sortBy]
  );
  const providerMetadata = useMemo(
    () => Object.fromEntries(providers.map((provider) => [provider.provider, provider])),
    [providers]
  );
  const failedProviders = providers.filter((provider) => provider.status === 'error');
  const successfulProviders = providers.filter((provider) => provider.status === 'success');
  const hasLocationSpecificStock = results.some((item) => item.availability === 'in-stock' && item.locationSpecific);

  const pageVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.3 } }
  };

  return (
    <PageShell className="py-8 sm:py-10">
      <motion.div variants={pageVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
        <PageHeader
          eyebrow="Location-aware medicine search"
          title="Find medicine nearby"
          description="Use your location or an Indian PIN code to compare medicines from PharmEasy, Apollo Pharmacy, and 1mg."
          icon={Pill}
        />

        <Card className="mb-8 overflow-hidden p-0 shadow-premium">
          <div className="border-b border-slate-100 bg-gradient-to-br from-primary-50/80 via-white to-cyan-50/60 p-5 dark:border-slate-800 dark:from-primary-900/25 dark:via-slate-900 dark:to-cyan-950/20 sm:p-7">
            <div className="flex items-start gap-4">
              <IconBadge icon={MapPin} tone="primary" size="lg" />
              <div>
                <p className="eyebrow">Step 1</p>
                <h2 className="text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">Choose your location</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">Your PIN code is used only when a provider endpoint supports it.</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <LocationPanel
              location={location}
              locationState={locationState}
              locationMessage={locationMessage}
              reduceMotion={reduceMotion}
              editorOpen={locationEditorOpen}
              pincode={pincode}
              pincodeError={pincodeError}
              onPincodeChange={(value) => {
                setPincode(normalizePincode(value));
                if (pincodeError) setPincodeError('');
              }}
              onDetect={detectLocation}
              onOpenEditor={() => setLocationEditorOpen((value) => !value)}
              onUpdateLocation={handleUpdateLocation}
            />

            <div className="my-7 h-px bg-slate-100 dark:bg-slate-800" />

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex items-start gap-4">
                <IconBadge icon={Search} tone="teal" size="lg" />
                <div>
                  <p className="eyebrow">Step 2</p>
                  <h2 className="text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">Search for a medicine</h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">Providers are searched in parallel and failures are reported independently.</p>
                </div>
              </div>

              <div>
                <label htmlFor="medicine-search" className="label">Medicine name</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      id="medicine-search"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search medicine, e.g. Dolo 650"
                      autoComplete="off"
                      minLength={2}
                      maxLength={100}
                      className="input-field h-16 border-2 border-slate-200 bg-white pl-14 pr-12 text-lg font-semibold dark:border-slate-700 dark:bg-slate-800/70"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear medicine search"
                        className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={searching}
                    disabled={searching || searchQuery.trim().length < 2 || !location?.pincode}
                    className="h-16 w-full sm:w-40"
                    loadingText="Searching"
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Quick searches</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {['Dolo 650', 'Paracetamol', 'Cetirizine', 'Ibuprofen', 'ORS', 'Cough Syrup'].map((medicine) => (
                    <button
                      key={medicine}
                      type="button"
                      onClick={() => handleQuickSearch(medicine)}
                      disabled={searching || !location?.pincode}
                      className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-primary-800 dark:hover:bg-primary-900/35 dark:hover:text-primary-300"
                    >
                      {medicine}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </Card>

        {searchError && (
          <InlineNotice icon={AlertCircle} title="Medicine search could not be completed" tone="warning" className="mb-6">
            {searchError}
          </InlineNotice>
        )}

        {searching ? (
          <SearchLoading />
        ) : searched ? (
          <SearchResults
            query={submittedQuery}
            location={location}
            resultCount={results.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableGroups={availableGroups}
            outOfStockGroups={outOfStockGroups}
            notServiceableGroups={notServiceableGroups}
            unknownGroups={unknownGroups}
            hasLocationSpecificStock={hasLocationSpecificStock}
            providers={providers}
            providerMetadata={providerMetadata}
            failedProviders={failedProviders}
            successfulProviders={successfulProviders}
            onChangeLocation={() => setLocationEditorOpen(true)}
            onClear={clearSearch}
          />
        ) : (
          <InitialMedicineState hasLocation={Boolean(location?.pincode)} />
        )}
      </motion.div>
    </PageShell>
  );
}

function LocationPanel({
  location,
  locationState,
  locationMessage,
  reduceMotion,
  editorOpen,
  pincode,
  pincodeError,
  onPincodeChange,
  onDetect,
  onOpenEditor,
  onUpdateLocation
}) {
  const isLocating = locationState === 'detecting' || locationState === 'resolving';

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700/70 dark:bg-slate-900/45 sm:p-5">
      {isLocating ? (
        <div className="flex items-center gap-4" role="status" aria-live="polite">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300">
            <RefreshCw className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          </span>
          <div>
            <p className="font-extrabold text-ink dark:text-white">{locationMessage}</p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Your browser may ask for location permission.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <IconBadge icon={location ? MapPin : LocateFixed} tone={location ? 'success' : 'warning'} size="md" />
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400">Current location</p>
              <p className="mt-1 break-words text-base font-extrabold text-ink dark:text-white sm:text-lg">{getLocationLabel(location)}</p>
              {location && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Used for providers that support PIN-based availability.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="secondary" onClick={onDetect} icon={LocateFixed} className="w-full sm:w-auto">
              Use My Current Location
            </Button>
            <Button type="button" variant="ghost" onClick={onOpenEditor} icon={MapPin} className="w-full sm:w-auto">
              {editorOpen ? 'Cancel' : 'Change Location'}
            </Button>
          </div>
        </div>
      )}

      {!isLocating && locationMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-6 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-100" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{locationMessage}</span>
        </div>
      )}

      {editorOpen && !isLocating && (
        <motion.form
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={onUpdateLocation}
          className="mt-5 overflow-hidden border-t border-slate-200 pt-5 dark:border-slate-700/70"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="manual-pincode" className="label">Enter PIN code</label>
              <input
                id="manual-pincode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={pincode}
                onChange={(event) => onPincodeChange(event.target.value)}
                placeholder="400069"
                maxLength={6}
                aria-invalid={Boolean(pincodeError)}
                aria-describedby={pincodeError ? 'manual-pincode-error' : 'manual-pincode-help'}
                className="input-field h-[52px] text-lg font-bold tracking-[0.2em]"
              />
              <p id="manual-pincode-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Use a 6-digit Indian PIN code.</p>
              {pincodeError && <p id="manual-pincode-error" className="mt-1 text-sm font-semibold text-red-700 dark:text-red-300" role="alert">{pincodeError}</p>}
            </div>
            <Button type="submit" icon={MapPin} className="h-[52px] w-full sm:w-auto">Update Location</Button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

function SearchLoading() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-busy="true" aria-live="polite">
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm font-bold text-primary-900 dark:border-primary-800/70 dark:bg-primary-950/30 dark:text-primary-100">
        <RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        Searching PharmEasy, Apollo Pharmacy, and 1mg in parallel...
      </div>
      <div className="space-y-4" role="status">
        {PROVIDER_NAMES.map((provider) => (
          <Card key={provider} className="space-y-4 p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-[14px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Searching {provider}...</span>
            </div>
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    </motion.section>
  );
}

function InitialMedicineState({ hasLocation }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { icon: LocateFixed, title: 'Use precise location', text: hasLocation ? 'Your selected area and PIN code are ready.' : 'Allow location access or enter an Indian PIN code.' },
        { icon: Store, title: 'Compare providers', text: 'PharmEasy, Apollo Pharmacy, and 1mg are searched in parallel.' },
        { icon: CircleHelp, title: 'Accurate labels', text: 'Catalog results are never presented as confirmed local stock.' }
      ].map((item) => (
        <Card key={item.title} className="space-y-4">
          <IconBadge icon={item.icon} tone="primary" size="md" />
          <h2 className="text-lg font-extrabold text-ink dark:text-white">{item.title}</h2>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{item.text}</p>
        </Card>
      ))}
    </div>
  );
}

function SearchResults({
  query,
  location,
  resultCount,
  sortBy,
  onSortChange,
  availableGroups,
  outOfStockGroups,
  notServiceableGroups,
  unknownGroups,
  hasLocationSpecificStock,
  providers,
  providerMetadata,
  failedProviders,
  successfulProviders,
  onChangeLocation,
  onClear
}) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">Medicine Availability</p>
            <h2 className="break-words text-2xl font-extrabold tracking-tight text-ink dark:text-white sm:text-3xl">{query}</h2>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <p className="flex items-start gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                {getLocationLabel(location)}
              </p>
              <button type="button" onClick={onChangeLocation} className="w-fit text-sm font-extrabold text-primary-700 hover:underline dark:text-primary-300">Change Location</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{resultCount} results</span>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Sort by</span>
              <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="input-field min-h-11 w-full py-2 sm:w-40">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </Card>

      {providers.length > 0 && (
        <ProviderSummary providers={providers} failedProviders={failedProviders} successfulProviders={successfulProviders} />
      )}

      {resultCount > 0 ? (
        <>
          <ResultSection
            title={hasLocationSpecificStock ? 'Available for your location' : 'Available online'}
            description={hasLocationSpecificStock ? 'These results include location-specific stock information supplied by the provider.' : `The provider confirmed online stock, but not local stock for ${location?.pincode}.`}
            groups={availableGroups}
            location={location}
            providerMetadata={providerMetadata}
            tone="success"
          />
          <ResultSection
            title="Not available in this location"
            description="Provider-reported out-of-stock results are kept separate from confirmed availability."
            groups={outOfStockGroups}
            location={location}
            providerMetadata={providerMetadata}
            tone="danger"
          />
          <ResultSection
            title="Not serviceable"
            description="The provider reported that it cannot serve the selected PIN code."
            groups={notServiceableGroups}
            location={location}
            providerMetadata={providerMetadata}
            tone="warning"
          />
          <ResultSection
            title="Found in provider catalogs"
            description="These medicines were found, but the provider did not return enough availability information."
            groups={unknownGroups}
            location={location}
            providerMetadata={providerMetadata}
            tone="neutral"
          />
        </>
      ) : (
        <EmptyState
          icon={failedProviders.length === providers.length && providers.length > 0 ? AlertCircle : PackageSearch}
          title={failedProviders.length === providers.length && providers.length > 0 ? 'Medicine providers could not be reached' : 'No matching medicines found'}
          description={failedProviders.length === providers.length && providers.length > 0 ? 'Review the provider status messages above and try again later.' : 'Try a different medicine name, brand, or generic name.'}
          action={<Button variant="secondary" onClick={onClear}>Search again</Button>}
          className="min-h-[22rem]"
        />
      )}
    </motion.section>
  );
}

function ProviderSummary({ providers, failedProviders, successfulProviders }) {
  return (
    <div className="space-y-3">
      {failedProviders.length > 0 && (
        <InlineNotice icon={AlertCircle} title="Some providers could not be reached" tone="warning">
          {successfulProviders.length > 0
            ? `Results from ${successfulProviders.map((provider) => provider.provider).join(', ')} are still shown. Unavailable providers: ${failedProviders.map((provider) => provider.provider).join(', ')}.`
            : `Please try again later. Unavailable providers: ${failedProviders.map((provider) => provider.provider).join(', ')}.`}
        </InlineNotice>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {providers.map((provider) => (
          <div key={provider.provider} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-extrabold text-ink dark:text-white">{provider.provider}</p>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${provider.status === 'success' ? 'bg-emerald-500' : provider.status === 'empty' ? 'bg-slate-400' : 'bg-red-500'}`} aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {provider.status === 'success' ? `${provider.count} result${provider.count === 1 ? '' : 's'}` : provider.status === 'empty' ? 'No matches returned' : provider.error?.message || 'Provider unavailable'}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
              {provider.locationIncluded ? 'PIN filter sent' : 'Catalog search only'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultSection({ title, description, groups, location, providerMetadata, tone }) {
  if (groups.length === 0) return null;
  return (
    <section>
      <SectionHeader
        eyebrow={tone === 'success' ? 'Available' : tone === 'danger' ? 'Unavailable' : tone === 'warning' ? 'Location status' : 'Catalog matches'}
        title={title}
        description={description}
        className="mb-4"
      />
      <div className="space-y-4">
        {groups.map((group) => (
          <MedicineComparisonCard
            key={group[0].resultKey}
            medicineName={group[0].medicineName}
            items={group}
            location={location}
            providerMetadata={providerMetadata}
          />
        ))}
      </div>
    </section>
  );
}

function MedicineComparisonCard({ medicineName, items, location, providerMetadata }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/45 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <IconBadge icon={Pill} tone="primary" size="md" />
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-primary-700 dark:text-primary-300">Medicine</p>
            <h3 className="mt-0.5 break-words text-lg font-extrabold text-ink dark:text-white sm:text-xl">{medicineName}</h3>
          </div>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {items.length} provider{items.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <MedicineResultRow key={item.resultKey} item={item} location={location} providerStatus={providerMetadata[item.provider]} />
        ))}
      </div>
    </Card>
  );
}

function MedicineResultRow({ item, location, providerStatus }) {
  const availability = availabilityPresentation(item, location.pincode);
  const AvailabilityIcon = availability.icon;
  const usedLocation = providerStatus?.locationIncluded === true;
  const prescriptionLabel = item.prescriptionRequired === true
    ? 'Prescription required'
    : item.prescriptionRequired === false
      ? 'No prescription required'
      : null;

  return (
    <article className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-start gap-4">
        <MedicineImage src={item.image} alt="" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-base font-extrabold text-ink dark:text-white">{item.provider}</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${availability.className}`}>
              <AvailabilityIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {availability.label}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{availability.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
            {usedLocation && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary-600" aria-hidden="true" />
                PIN {location.pincode} sent to provider
              </span>
            )}
            {!usedLocation && (
              <span className="inline-flex items-center gap-1.5">
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
                Provider endpoint does not support PIN filtering
              </span>
            )}
            {item.deliveryEstimate && <span>{item.deliveryEstimate}</span>}
          </div>
          {item.manufacturer && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Manufacturer: {item.manufacturer}</p>}
          {prescriptionLabel && <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{prescriptionLabel}</p>}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 lg:min-w-[11rem] lg:items-end lg:border-0 lg:pt-0">
        <div className="flex items-baseline gap-2 lg:justify-end">
          {Number.isFinite(item.price) ? (
            <span className="text-2xl font-extrabold text-ink dark:text-white">₹{item.price}</span>
          ) : (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Price unavailable</span>
          )}
          {Number.isFinite(item.mrp) && Number.isFinite(item.price) && item.mrp > item.price && (
            <span className="text-sm text-slate-400 line-through">₹{item.mrp}</span>
          )}
        </div>
        {item.url ? (
          <Button asChild variant="secondary" size="sm" className="w-full lg:w-auto">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              View Details
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">Provider did not return a product link</span>
        )}
      </div>
    </article>
  );
}

function MedicineImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-950/45 dark:text-primary-300" aria-hidden="true">
        <Pill className="h-6 w-6" />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1 dark:border-slate-700 dark:bg-slate-900"
    />
  );
}
