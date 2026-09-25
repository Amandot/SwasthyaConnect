import { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Siren,
  AlertCircle,
  Ambulance,
  Hospital,
  Users,
  Clock,
  Navigation,
  ChevronRight,
  Shield,
  BookOpen,
  PhoneCall,
  Droplets,
  Thermometer,
  HeartPulse
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader, IconBadge, EmptyState } from '../components/ui/PagePrimitives';
import { cn } from '../lib/utils';

export default function EmergencyPage() {
  const [loading, setLoading] = useState(true);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [firstAidTips, setFirstAidTips] = useState([]);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      setNearbyHospitals([
        {
          id: 1,
          name: 'Lt Gen Shivdev Singh Civil Hospital',
          distance: '0 km (Nabha)',
          eta: '3 mins',
          beds: 20,
          emergency: true,
          phone: '01765-000001',
          address: 'Guru Nanak Pura, Nabha, 147201',
          rating: 4.7
        },
        {
          id: 2,
          name: 'Sawhney Hospital & Maternity Home',
          distance: '~1-2 km (Nabha)',
          eta: '5 mins',
          beds: 12,
          emergency: true,
          phone: '01765-000002',
          address: 'Munshian Street, Nabha, 147201',
          rating: 4.5
        },
        {
          id: 3,
          name: 'Goyal Healthcare Hospital',
          distance: '~1 km (Nabha)',
          eta: '4 mins',
          beds: 10,
          emergency: true,
          phone: '01765-000003',
          address: 'College Road, Nabha, 147201',
          rating: 4.4
        },
        {
          id: 4,
          name: 'Tara Hospital',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 8,
          emergency: true,
          phone: '01765-000004',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.3
        },
        {
          id: 5,
          name: 'Aneja Children & Maternity Hospital',
          distance: '~3 km (Nabha)',
          eta: '9 mins',
          beds: 6,
          emergency: true,
          phone: '01765-000005',
          address: 'Radha Swamy Marg, Nabha, 147201',
          rating: 4.4
        },
        {
          id: 6,
          name: 'Sukhmani Orthopaedic & General Hospital',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 10,
          emergency: true,
          phone: '01765-000006',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.2
        },
        {
          id: 7,
          name: 'Bansal Hospital & Laparoscopic Centre',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 8,
          emergency: true,
          phone: '01765-000007',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.1
        },
        {
          id: 8,
          name: 'Community Health Centre (CHC)',
          distance: '~16–18 km (Bhawanigarh)',
          eta: '25 mins',
          beds: 15,
          emergency: true,
          phone: '01779-000001',
          address: 'NH 7, Bhawanigarh, 148026',
          rating: 4.0
        },
        {
          id: 9,
          name: 'Gupta Hospital & Heart Centre',
          distance: '~16 km (Bhawanigarh)',
          eta: '23 mins',
          beds: 12,
          emergency: true,
          phone: '01779-000002',
          address: 'NH 64, Bhawanigarh, 148026',
          rating: 4.3
        }
      ]);

      setEmergencyContacts([
        { name: 'National Emergency', number: '112', icon: Phone, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
        { name: 'Ambulance', number: '102', icon: Ambulance, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
        { name: 'Fire Station', number: '101', icon: Siren, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
        { name: 'Poison Control', number: '1800-123-4567', icon: AlertCircle, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' }
      ]);

      setFirstAidTips([
        {
          title: 'Bleeding',
          tip: 'Apply firm pressure with clean cloth. Elevate if possible.',
          icon: Droplets,
          color: 'text-red-600 dark:text-red-400'
        },
        {
          title: 'Burns',
          tip: 'Cool with running water for 10-15 minutes. Do not apply ice.',
          icon: Thermometer,
          color: 'text-orange-600 dark:text-orange-400'
        },
        {
          title: 'Heart Attack',
          tip: 'Keep person calm. Loosen clothing. Seek immediate help.',
          icon: HeartPulse,
          color: 'text-pink-600 dark:text-pink-400'
        },
        {
          title: 'Choking',
          tip: 'Perform Heimlich maneuver. Call emergency if unsuccessful.',
          icon: AlertCircle,
          color: 'text-purple-600 dark:text-purple-400'
        }
      ]);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (hospitalName, address, e) => {
    if (e) {
      e.stopPropagation();
    }

    const fullAddress = address ? `${hospitalName}, ${address}` : hospitalName;
    const searchQuery = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  const quickActions = [
    {
      title: 'Call Ambulance',
      description: 'Emergency medical transport',
      icon: Ambulance,
      action: () => window.location.href = 'tel:102',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40'
    },
    {
      title: 'Find Hospital',
      description: 'Nearby medical facilities',
      icon: Hospital,
      action: () => scrollToSection('nearby-care'),
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'First Aid',
      description: 'Emergency procedures',
      icon: BookOpen,
      action: () => scrollToSection('first-aid'),
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40'
    },
    {
      title: 'Emergency Contacts',
      description: 'Important numbers',
      icon: Users,
      action: () => scrollToSection('emergency-contacts'),
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  if (loading) {
    return (
      <div
        className="app-container flex min-h-[70vh] items-center justify-center py-12"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-2xl border-4 border-red-100 border-t-brand-emergency motion-reduce:animate-none dark:border-red-950 dark:border-t-red-500" aria-hidden="true" />
          <p className="mt-5 text-lg font-extrabold text-ink dark:text-white">Loading emergency services</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Please wait while the information is prepared.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container py-8 sm:py-10">
      <PageHeader
        eyebrow="Emergency support"
        title="Emergency help"
        description="Immediate medical assistance when every second counts."
        icon={Siren}
      />

      <section className="overflow-hidden rounded-[22px] border border-red-700 bg-brand-emergency shadow-soft" aria-labelledby="sos-heading">
        <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 text-white">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10">
              <Siren className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-100">SOS</p>
              <h2 id="sos-heading" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Need help right now?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-red-50 sm:text-base">Use the SOS button to call National Emergency.</p>
            </div>
          </div>

          <Button
            asChild
            variant="secondary"
            aria-label="Call National Emergency on 112"
            className="min-h-16 w-full rounded-2xl bg-white px-8 text-lg text-red-700 shadow-lg hover:bg-red-50 dark:bg-white dark:text-red-700 dark:hover:bg-red-50 lg:w-64"
          >
            <a href="tel:112">
              <PhoneCall className="mr-2 h-6 w-6" aria-hidden="true" />
              Call 112
            </a>
          </Button>
        </div>
      </section>

      <section id="emergency-contacts" className="mt-8 scroll-mt-28" aria-labelledby="emergency-contacts-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-emergency">One-tap access</p>
            <h2 id="emergency-contacts-heading" className="mt-1 text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">Emergency contacts</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {emergencyContacts.map((contact, index) => (
            <a
              key={index}
              href={`tel:${contact.number}`}
              aria-label={`Call ${contact.name} on ${contact.number}`}
              className="group block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111f]"
            >
              <Card className="h-full p-4 transition-[border-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary-200 dark:group-hover:border-primary-800">
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', contact.bg, contact.color)}>
                    <contact.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-ink dark:text-white">{contact.name}</p>
                    <p className="mt-0.5 text-lg font-extrabold tracking-tight text-ink dark:text-white">{contact.number}</p>
                  </div>
                  <PhoneCall className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-brand-emergency" aria-hidden="true" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="emergency-actions-heading">
        <h2 id="emergency-actions-heading" className="text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl">More emergency actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const content = (
              <Card className="h-full p-4 transition-[border-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary-200 dark:group-hover:border-primary-800">
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', action.bg, action.color)}>
                    <action.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-ink dark:text-white">{action.title}</h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-300" aria-hidden="true" />
                </div>
              </Card>
            );

            return (
              <button key={action.title} type="button" onClick={action.action} className="group block w-full rounded-[22px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-canvas">
                {content}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <section id="nearby-care" className="scroll-mt-28" aria-labelledby="nearby-hospitals-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-700 dark:text-primary-300">Nearby care</p>
              <h2 id="nearby-hospitals-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-ink dark:text-white">Nearby hospitals</h2>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200">
              Sample directory
            </span>
          </div>

          <p className="mb-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Sample facility details are shown for this interface. Confirm services and phone numbers before use.
          </p>

          {nearbyHospitals.length > 0 ? (
            <ul className="space-y-3">
              {nearbyHospitals.map((hospital) => (
                <li key={hospital.id}>
                  <Card className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <IconBadge icon={Hospital} tone="danger" className="mt-0.5" />
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold leading-6 text-ink dark:text-white">{hospital.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {hospital.distance}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              ETA: {hospital.eta}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                              Emergency services listed
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{hospital.address}</p>
                        </div>
                      </div>

                      <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-col xl:flex-row">
                        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                          <a href={`tel:${hospital.phone}`} aria-label={`Call ${hospital.name} at ${hospital.phone}`}>
                            <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                            Call
                          </a>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={(e) => handleGetDirections(hospital.name, hospital.address, e)}
                          aria-label={`Get directions to ${hospital.name}`}
                        >
                          <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Hospital}
              title="No hospitals found"
              description="No facility details are available for this directory. Confirm local services through an official source."
            />
          )}
        </section>

        <aside id="first-aid" className="scroll-mt-28 space-y-5" aria-label="First aid and emergency preparation">
          <Card>
            <div className="flex items-center gap-3">
              <IconBadge icon={Shield} tone="primary" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Quick guidance</p>
                <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-ink dark:text-white">First aid</h2>
              </div>
            </div>

            <ol className="mt-5 space-y-4">
              {firstAidTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 dark:border-white/10">
                  <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800', tip.color)}>
                    <tip.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-ink dark:text-white">{tip.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{tip.tip}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-5 rounded-xl border border-primary-100 bg-primary-50/70 p-3 text-xs leading-5 text-primary-900 dark:border-primary-900/70 dark:bg-primary-950/30 dark:text-primary-100">
              For urgent situations, contact emergency services before following any first-aid guidance.
            </p>
          </Card>

          <Card className="border-red-200 dark:border-red-900/60">
            <IconBadge icon={AlertCircle} tone="danger" size="lg" />
            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-ink dark:text-white">Emergency preparedness</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Keep an emergency kit ready. Store important medical information and emergency contacts.
            </p>
          </Card>
        </aside>
      </div>

      <section className="mt-8" aria-labelledby="emergency-instructions-heading">
        <Card className="border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <IconBadge icon={AlertCircle} tone="warning" />
              <div>
                <h2 id="emergency-instructions-heading" className="text-lg font-extrabold text-ink dark:text-white">In case of emergency</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Stay calm. Call emergency services immediately. Provide your exact location and describe the situation clearly.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:ml-auto">
              <Button asChild variant="danger">
                <a href="tel:112">
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  Call 112
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
