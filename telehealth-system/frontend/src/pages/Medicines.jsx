import { useState, useEffect } from 'react';
import { medicineAPI } from '../services/api';

function Medicines() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await medicineAPI.getPharmacies();
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setPharmacies(['Sharma Pharmacy', 'Village Pharmacy', 'Health Plus', 'Gupta Medical Store']);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await medicineAPI.searchMedicines(searchQuery);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error searching medicines:', error);
      // Demo data
      const demoMedicines = {
        [searchQuery]: [
          { pharmacy: 'Sharma Pharmacy', available: true, price: 25 },
          { pharmacy: 'Village Pharmacy', available: false, price: null },
          { pharmacy: 'Health Plus', available: true, price: 28 },
          { pharmacy: 'Gupta Medical Store', available: true, price: 22 }
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
    // Trigger search
    setLoading(true);
    setSearched(true);
    
    // Demo data for quick search
    setTimeout(() => {
      const demoMedicines = {
        [medicine]: [
          { pharmacy: 'Sharma Pharmacy', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10 },
          { pharmacy: 'Village Pharmacy', available: Math.random() > 0.5, price: Math.floor(Math.random() * 50) + 10 },
          { pharmacy: 'Health Plus', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10 },
          { pharmacy: 'Gupta Medical Store', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10 }
        ]
      };
      setMedicines(demoMedicines);
      setLoading(false);
    }, 500);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Medicine Availability</h1>
      <p className="text-slate-500 mb-8">Find medicines at nearby pharmacies</p>

      {/* Search Section */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a medicine..."
              className="input-field pl-12"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <SearchIcon className="w-5 h-5" />
            )}
            Search
          </button>
        </form>

        {/* Quick Search */}
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-2">Common medicines:</p>
          <div className="flex flex-wrap gap-2">
            {commonMedicines.map((medicine) => (
              <button
                key={medicine}
                onClick={() => handleQuickSearch(medicine)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors"
              >
                {medicine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-6">
          {loading ? (
            <div className="card animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          ) : Object.keys(medicines).length > 0 ? (
            Object.entries(medicines).map(([medicineName, availability]) => (
              <div key={medicineName} className="card">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <PillIcon className="w-6 h-6 text-primary-600" />
                  {medicineName}
                </h2>

                <div className="space-y-3">
                  {availability.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        item.available
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.available ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {item.available ? (
                            <CheckIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.pharmacy}</p>
                          <p className={`text-sm ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                            {item.available ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>
                      </div>

                      {item.available && item.price && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800">Rs. {item.price}</p>
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Get Directions
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                          {availability.filter(a => a.available).length} available
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                          {availability.filter(a => !a.available).length} out of stock
                        </span>
                      </div>
                    </div>
                    {availability.filter(a => a.available && a.price).length > 0 && (
                      <p className="text-sm text-slate-500">
                        Lowest price: Rs. {Math.min(...availability.filter(a => a.available && a.price).map(a => a.price))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card bg-slate-50 text-center py-12">
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">No Results Found</h3>
              <p className="text-slate-500">Try searching for a different medicine</p>
            </div>
          )}
        </div>
      )}

      {/* Nearby Pharmacies */}
      {!searched && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <LocationIcon className="w-5 h-5 text-primary-600" />
            Nearby Pharmacies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pharmacies.map((pharmacy, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <PharmacyIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{pharmacy}</p>
                    <p className="text-sm text-slate-500">{(Math.random() * 2 + 0.5).toFixed(1)} km away</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <DirectionsIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// Icon Components
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function LocationIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PharmacyIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function DirectionsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

export default Medicines;
