import React, { useState, useEffect } from 'react';
import { mockCars, mockDealers } from './mockData';
import { Car, Dealer, FilterState } from './types';
import Hero from './components/Hero';
import Filters from './components/Filters';
import CarCard from './components/CarCard';
import CarDetails from './components/CarDetails';
import CompareModal from './components/CompareModal';
import Dashboard from './components/Dashboard';
import { Sparkles, BrainCircuit, Landmark, Flame, Compass, GitCompare, Building2, HelpCircle, Check, X, ShieldCheck, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const translations: Record<string, any> = {
  EN: {
    brandName: "Stuttgart-Apex",
    inventory: "Studio Inventory",
    showcase: "Telemetry Studio",
    compare: "Metric Labs",
    dashboard: "Command Center",
    garage: "Saved Garage",
    subtitle: "AI-Powered Motoring Portal",
    resultsHeading: "Discovered Assets",
    smartHeading: "AI Smart Recommendation",
    similarTitle: "Similar Models",
    applyFilters: "Apply Settings"
  },
  DE: {
    brandName: "Stuttgart-Apex",
    inventory: "Studio-Bestand",
    showcase: "Telemetrie-Studio",
    compare: "Vergleichs-Labor",
    dashboard: "Kontrollzentrum",
    garage: "Gespeicherte Garage",
    subtitle: "KI-basiertes Automobilportal",
    resultsHeading: "Entdeckte Fahrzeuge",
    smartHeading: "KI-Empfehlungsbericht",
    similarTitle: "Ähnliche Modelle",
    applyFilters: "Einstellungen anwenden"
  },
  IT: {
    brandName: "Stuttgart-Apex",
    inventory: "Inventario Studio",
    showcase: "Studio Telemetria",
    compare: "Laboratorio Metriche",
    dashboard: "Centro Controllo",
    garage: "Garage Preferiti",
    subtitle: "Portale Automobilistico IA",
    resultsHeading: "Veicoli Selezionati",
    smartHeading: "Analisi IA Consigliati",
    similarTitle: "Modelli Simili",
    applyFilters: "Applica Parametri"
  },
  JA: {
    brandName: "シュトゥットガルト",
    inventory: "高性能リスト",
    showcase: "テレポートスタジオ",
    compare: "比較ラボ",
    dashboard: "指令センター",
    garage: "ガレージ登録",
    subtitle: "AI スマートモータリング",
    resultsHeading: "登録済みビークル",
    smartHeading: "AI 推奨データ",
    similarTitle: "類似の仕様",
    applyFilters: "設定の適用"
  }
};

export default function App() {
  const [lang, setLang] = useState<string>('EN');
  const t = translations[lang] || translations.EN;

  // Global variables loaded from Express endpoint or local cache fallback
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [dealers, setDealers] = useState<Dealer[]>(mockDealers);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Layout Tab selection: 'search' | 'dashboard' | 'compare'
  const [activeTab, setActiveTab] = useState<'search' | 'dashboard' | 'compare'>('search');
  
  // Selected car for detail modal overlay inside showcase studio
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Saved wishlists locally synchronized
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites_market');
    return saved ? JSON.parse(saved) : [];
  });

  // Dark light theme mode tracker
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Search Results & active filter ranges state
  const maxPriceCeiling = Math.max(...mockCars.map(c => c.price));
  const minPriceCeiling = Math.min(...mockCars.map(c => c.price));

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    brand: 'All',
    model: '',
    year: 'All',
    maxPrice: maxPriceCeiling,
    fuelType: 'All',
    transmission: 'All',
    country: 'All',
    mileage: 'All',
  });

  // AI-powered dynamic search matches container
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  // Side-by-side comparison indices slots
  const [carA, setCarA] = useState<Car | null>(null);
  const [carB, setCarB] = useState<Car | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Fetch cars on startup to bind API capabilities
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/api/cars');
        if (response.ok) {
          const data = await response.json();
          if (data.cars && data.cars.length > 0) {
            setCars(data.cars);
            setDealers(data.dealers);
          }
        }
      } catch (err) {
        console.warn("Express API routes offline. Using pre-loaded mock data securely.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('favorites_market', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSearchAIResult = (result: any) => {
    setAiSuggestions(result);
    // Auto-scroll to results or apply recommended filters automatically
    if (result.recommendedFilters) {
      setFilters(prev => ({
        ...prev,
        brand: result.recommendedFilters.brand !== 'All' ? result.recommendedFilters.brand : prev.brand,
        fuelType: result.recommendedFilters.fuelType !== 'All' ? result.recommendedFilters.fuelType : prev.fuelType,
        maxPrice: result.recommendedFilters.maxPrice !== -1 ? result.recommendedFilters.maxPrice : prev.maxPrice,
        transmission: result.recommendedFilters.transmission !== 'All' ? result.recommendedFilters.transmission : prev.transmission,
      }));
    }
  };

  const handleAddToCompare = (car: Car) => {
    // Fill first empty comparison slot or open compare window
    if (!carA) {
      setCarA(car);
      setIsCompareOpen(true);
    } else if (carA.id === car.id) {
      setCarA(null);
    } else {
      setCarB(car);
      setIsCompareOpen(true);
    }
  };

  // Compute final filtered metrics
  const filteredCars = cars.filter(car => {
    // Brand search query matching
    const matchesKeyword = car.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesBrand = filters.brand === 'All' || car.brand === filters.brand;
    const matchesTransmission = filters.transmission === 'All' || car.transmission === filters.transmission;
    const matchesCountry = filters.country === 'All' || car.country === filters.country;
    const matchesFuel = filters.fuelType === 'All' || car.fuelType === filters.fuelType;
    const matchesPrice = car.price <= filters.maxPrice;
    
    let matchesMileage = true;
    if (filters.mileage !== 'All') {
      const mileLimit = parseInt(filters.mileage, 10);
      matchesMileage = car.mileage <= mileLimit;
    }

    return matchesKeyword && matchesBrand && matchesTransmission && matchesCountry && matchesFuel && matchesPrice && matchesMileage;
  });

  const availableBrands = Array.from(new Set(cars.map(c => c.brand))) as string[];
  const availableCountries = Array.from(new Set(cars.map(c => c.country))) as string[];

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out font-sans ${isLightMode ? 'bg-[#f8fafc] text-slate-905' : 'bg-[#030712] text-slate-100'}`}>
      
      {/* Decorative Outer Aura Lighting */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/5 to-[#3b82f6]/5 blur-3xl opacity-40 pointer-events-none" />
      
      {/* Upper Universal Header Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all ${isLightMode ? 'bg-white/80 border-slate-200' : 'bg-[#030712]/80 border-slate-800/80'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setSelectedCar(null); setActiveTab('search'); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex justify-center items-center shadow-md">
              <span className="text-slate-950 font-black text-lg">S</span>
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-[#10b981] block uppercase">{t.brandName}</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-tight block font-semibold">{t.subtitle}</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-950/20 rounded-2xl border border-slate-800/40">
            <button
              id="tab-search-btn"
              onClick={() => { setSelectedCar(null); setActiveTab('search'); }}
              className={`text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'search' && !selectedCar
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {t.inventory}
            </button>
            <button
              id="tab-dashboard-btn"
              onClick={() => { setSelectedCar(null); setActiveTab('dashboard'); }}
              className={`text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {t.dashboard}
            </button>
            <button
              id="tab-compare-btn"
              onClick={() => {
                if (cars.length > 1) {
                  setCarA(cars[0]);
                  setCarB(cars[1]);
                  setIsCompareOpen(true);
                }
              }}
              className="text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1"
            >
              <GitCompare size={13} /> Compare Labs
            </button>
          </nav>

          {/* System controllers: Language selector & Theme Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Language switcher dropdown */}
            <div className="flex gap-1 bg-slate-950/20 border border-slate-800/40 p-1 rounded-xl">
              {['EN', 'DE', 'IT', 'JA'].map((language) => (
                <button
                  id={`lang-btn-${language}`}
                  key={language}
                  onClick={() => setLang(language)}
                  className={`text-[9.5px] font-black tracking-wide px-2 py-1 rounded transition-colors ${
                    lang === language ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>

            {/* Light/Dark mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsLightMode(!isLightMode)}
              className="p-2.5 rounded-xl border border-slate-800/40 bg-slate-950/20 text-slate-400 hover:text-white transition duration-200"
              title={isLightMode ? 'Dark Theme' : 'Light Theme'}
            >
              {isLightMode ? <Moon size={15} /> : <Sun size={15} />}
            </button>

          </div>

        </div>
      </header>

      {/* Main body viewport */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 min-h-[calc(100vh-120px)] relative">
        
        {/* Detail page overlays Showcase Telemetry Studio */}
        {selectedCar ? (
          <CarDetails 
            car={selectedCar} 
            allCars={cars}
            onBack={() => setSelectedCar(null)}
            onSelectCar={(car) => setSelectedCar(car)}
          />
        ) : (
          <div className="space-y-10">
            {activeTab === 'search' ? (
              <>
                {/* Hero Showcase with integrated smart search */}
                <Hero 
                  onSearchAIResult={handleSearchAIResult} 
                  onSelectCar={(car) => setSelectedCar(car)}
                  allCars={cars}
                />

                {/* AI recommendations summary outcome box if returned */}
                {aiSuggestions && (
                  <div className="bg-gradient-to-br from-slate-950/80 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden animate-fade-in">
                    
                    {/* Corner close trigger */}
                    <button
                      id="close-ai-suggest-btn"
                      onClick={() => setAiSuggestions(null)}
                      className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                      <X size={14} />
                    </button>

                    <div className="flex items-center gap-2 mb-4">
                      <BrainCircuit className="text-purple-400" size={20} />
                      <h3 className="text-sm uppercase tracking-widest text-[#a855f7] font-black font-mono">
                        {t.smartHeading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4 border-b border-slate-800/80 mb-4">
                      
                      {/* Left: reasoning text block */}
                      <div className="lg:col-span-8 prose prose-invert font-sans text-xs text-slate-200 leading-relaxed">
                        <div className="whitespace-pre-wrap">
                          {aiSuggestions.reasoningSummary}
                        </div>
                      </div>

                      {/* Right: Dynamic suggestion links */}
                      <div className="lg:col-span-4 space-y-3">
                        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold block">Matched Inventory:</span>
                        {aiSuggestions.recommendations?.map((item: any, idx: number) => {
                          const matchingRealCar = cars.find(c => c.id === item.carId || (c.model.toLowerCase() === item.model?.toLowerCase()));
                          return (
                            <div 
                              key={idx} 
                              onClick={() => matchingRealCar && setSelectedCar(matchingRealCar)}
                              className={`p-3 border rounded-2xl flex items-center justify-between transition-all duration-300 ${
                                matchingRealCar 
                                  ? 'bg-slate-950/60 hover:bg-slate-950 border-purple-500/20 hover:border-purple-500/50 cursor-pointer' 
                                  : 'bg-slate-950/20 border-slate-850 opacity-60'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <h5 className="font-bold text-white text-xs truncate">{item.brand} {item.model}</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.whyItFits}</p>
                              </div>
                              <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">
                                {item.matchScore}% FIT
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <span>✓ Applied AI-recommended filters parameters directly to UI settings. Click recommendation cards to initialize 360° Customizer.</span>
                    </div>

                  </div>
                )}

                {/* Main Filter Suite */}
                <Filters 
                  filters={filters} 
                  setFilters={setFilters} 
                  minPrice={minPriceCeiling} 
                  maxPrice={maxPriceCeiling}
                  availableBrands={availableBrands}
                  availableCountries={availableCountries}
                />

                {/* Sub-Header Result labels */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Flame size={16} className="text-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 font-mono">
                      {t.resultsHeading}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono italic">
                    Showing {filteredCars.length} of {cars.length} vehicles matching telemetry criteria
                  </span>
                </div>

                {/* Results Grid Container */}
                {filteredCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map(car => (
                      <CarCard 
                        key={car.id} 
                        car={car} 
                        isFavorite={favorites.includes(car.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={(car) => setSelectedCar(car)}
                        onAddToCompare={handleAddToCompare}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20 max-w-lg mx-auto p-6">
                    <HelpCircle size={44} className="text-slate-600 mx-auto mb-3" />
                    <h4 className="text-white font-bold text-base">No Matching Motoring Assets Found</h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                      Adjust your price ceilings, propulsion setting, or manual gearboxes filters to find matching Stuttgart authorized inventory.
                    </p>
                    <button
                      id="clear-all-filter-btn"
                      onClick={() => setFilters({
                        searchQuery: '',
                        brand: 'All',
                        model: '',
                        year: 'All',
                        maxPrice: maxPriceCeiling,
                        fuelType: 'All',
                        transmission: 'All',
                        country: 'All',
                        mileage: 'All',
                      })}
                      className="mt-4 text-xs font-bold text-emerald-400 hover:text-white font-mono bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Dashboard 
                favorites={favorites} 
                allCars={cars}
                onToggleFavorite={handleToggleFavorite}
                onSelectCar={(car) => setSelectedCar(car)}
                dealers={dealers}
              />
            )}
          </div>
        )}

      </main>

      {/* Floating comparison side-drawer trigger */}
      {favorites.length > 0 && !selectedCar && (
        <div className="fixed bottom-6 left-6 z-40 bg-slate-900/90 border border-slate-800 rounded-full px-4 py-3 flex items-center gap-3.5 shadow-2xl backdrop-blur">
          <span className="flex items-center gap-1 text-slate-300 font-bold text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            GARAGE SAVED: <span className="text-emerald-400">{favorites.length}</span>
          </span>
          <button
            id="floating-garage-btn"
            onClick={() => setActiveTab('dashboard')}
            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-full hover:scale-105 active:scale-95 transition"
          >
            Manage Garage
          </button>
        </div>
      )}

      {/* Dynamic comparison overlay portal */}
      {isCompareOpen && carA && (
        <CompareModal 
          carA={carA} 
          carB={carB} 
          allCars={cars}
          onSelectCarB={(car) => setCarB(car)}
          onClose={() => {
            setIsCompareOpen(false);
            setCarB(null);
          }}
        />
      )}

      {/* Premium Footer */}
      <footer className="border-t border-slate-850 py-8 bg-slate-950/20 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 Stuttgart-Apex Luxury Corporation. Powered by Gemini Neural Engineering AI.</p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-600">
            <span>VIP COMMITTAL AGREEMENTS</span>
            <span>•</span>
            <span>ACTIVE AERODYNAMICS COMPLIANCE</span>
            <span>•</span>
            <span>PRIVACY TELEMETRY LAWS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
