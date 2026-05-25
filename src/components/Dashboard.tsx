import React, { useState } from 'react';
import { Car, Dealer } from '../types';
import { ShieldCheck, User, Sparkles, Building2, Landmark, HelpCircle, FilePlus2, CheckCircle, Calculator, Heart } from 'lucide-react';

interface DashboardProps {
  favorites: string[];
  allCars: Car[];
  onToggleFavorite: (id: string) => void;
  onSelectCar: (car: Car) => void;
  dealers: Dealer[];
}

export default function Dashboard({ 
  favorites, 
  allCars, 
  onToggleFavorite, 
  onSelectCar, 
  dealers 
}: DashboardProps) {
  const favoriteCars = allCars.filter(car => favorites.includes(car.id));

  // State for user profile simulations
  const [currentUser, setCurrentUser] = useState({
    name: 'Adrian Sterling',
    email: 'a.sterling@private-client.com',
    role: 'VIP Buyer',
    memberSince: '2024',
    verified: true,
  });

  // Financing / Loan Calculator State
  const [carPrice, setCarPrice] = useState<number>(146000);
  const [downpayment, setDownpayment] = useState<number>(30000);
  const [loanTerm, setLoanTerm] = useState<number>(48); // 24, 36, 48, 60, 72 months
  const [interestRate, setInterestRate] = useState<number>(4.5); // APR percentage

  // Vehicle Lister Simulator State
  const [listingForm, setListingForm] = useState({
    brand: '',
    model: '',
    year: '2025',
    price: '',
    fuelType: 'Electric',
    transmission: 'Automatic',
    mileage: '',
    country: 'USA',
  });
  const [listSuccess, setListSuccess] = useState<boolean>(false);
  const [listedCarName, setListedCarName] = useState<string>('');

  // Loan calculation formula implementation
  const calculateMonthlyPayment = () => {
    const principal = Math.max(0, carPrice - downpayment);
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) return principal / loanTerm;
    
    const x = Math.pow(1 + monthlyRate, loanTerm);
    const monthly = (principal * monthlyRate * x) / (x - 1);
    return isNaN(monthly) ? 0 : monthly;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalCost = (monthlyPayment * loanTerm) + downpayment;
  const totalInterest = Math.max(0, totalCost - carPrice);

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.brand || !listingForm.model || !listingForm.price) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    setListedCarName(`${listingForm.brand} ${listingForm.model}`);
    setListSuccess(true);
    setTimeout(() => {
      setListSuccess(false);
      setListingForm({
        brand: '',
        model: '',
        year: '2025',
        price: '',
        fuelType: 'Electric',
        transmission: 'Automatic',
        mileage: '',
        country: 'USA',
      });
    }, 4500);
  };

  return (
    <div className="space-y-8">
      
      {/* Upper Banner: User Profile Hub */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <User size={120} className="text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 flex justify-center items-center shadow-lg text-white font-black text-2xl font-sans">
              AS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
                <span className="p-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <ShieldCheck size={14} />
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full font-mono">
                  {currentUser.role}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full font-mono">
                  Since {currentUser.memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <span className="text-xs text-slate-500 block font-mono">WISH LIST COUNT</span>
              <span className="text-lg font-black text-sky-400 font-mono">{favorites.length} Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Wislist and Financing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Wishlist and Vehicle Lister */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Favorites List */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-4 flex items-center gap-1.5">
              <Heart size={15} className="text-rose-500" /> Saved Garage Favorites
            </h3>

            {favoriteCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteCars.map(car => (
                  <div 
                    key={car.id} 
                    className="p-3.5 bg-slate-950/20 hover:bg-slate-950/40 border border-white/5 hover:border-white/10 rounded-2xl flex gap-4 items-center justify-between group cursor-pointer"
                    onClick={() => onSelectCar(car)}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img 
                        src={car.heroImage} 
                        alt={car.model} 
                        className="w-16 h-12 object-cover rounded-xl border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">{car.brand}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition truncate">{car.model}</h4>
                        <span className="text-[11px] text-sky-400 font-mono">${car.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      id={`dash-fav-btn-${car.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(car.id);
                      }}
                      className="text-slate-550 hover:text-rose-400 p-2 hover:bg-white/5 text-xs rounded-xl transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl bg-slate-950/10">
                <span className="text-xs text-slate-505 block font-mono">YOUR WORKSPACE GARAGE IS EMPTY</span>
                <p className="text-xs text-slate-400 mt-1">Navigate the inventory list are star heart vehicles to track specifications here.</p>
              </div>
            )}
          </div>

          {/* List new vehicle for verification */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-4 flex items-center gap-1.5">
              <FilePlus2 size={15} className="text-sky-400" /> Consign / List Premium Vehicle
            </h3>

            {listSuccess ? (
              <div className="p-6 bg-sky-500/10 border border-sky-500/25 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in">
                <CheckCircle size={44} className="text-sky-400 mb-3 animate-bounce" />
                <h4 className="text-white font-bold text-base">Transmission Active!</h4>
                <p className="text-xs text-slate-300 max-w-sm mt-1">
                  Your luxury listing request for <strong>{listedCarName}</strong> has been transmitted to Stuttgart-Apex verification lines. Check listing dashboard updates in some mins.
                </p>
              </div>
            ) : (
              <form onSubmit={handleListSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Brand Manufacturer *</label>
                    <input 
                      id="list-form-brand"
                      type="text" 
                      placeholder="e.g. Corvette, Porsche"
                      required
                      value={listingForm.brand}
                      onChange={(e) => setListingForm(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-slate-950 text-slate-200 text-xs border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500/30 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Model Name *</label>
                    <input 
                      id="list-form-model"
                      type="text" 
                      placeholder="e.g. ZR1, GT2 RS"
                      required
                      value={listingForm.model}
                      onChange={(e) => setListingForm(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full bg-slate-955 text-slate-200 text-xs border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500/30 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Asking Price ($ USD) *</label>
                    <input 
                      id="list-form-price"
                      type="number" 
                      placeholder="e.g. 185000"
                      required
                      value={listingForm.price}
                      onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-slate-950 text-slate-200 text-xs border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500/30 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Energy Type</label>
                    <select 
                      id="list-form-fuel"
                      value={listingForm.fuelType}
                      onChange={(e) => setListingForm(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full bg-slate-955 text-slate-200 text-xs border border-white/10 rounded-xl px-4 py-3 outline-none font-sans"
                    >
                      <option>Electric</option>
                      <option>Hybrid</option>
                      <option>Petrol</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Mileage (miles)</label>
                    <input 
                      id="list-form-mileage"
                      type="number" 
                      placeholder="e.g. 10"
                      value={listingForm.mileage}
                      onChange={(e) => setListingForm(prev => ({ ...prev, mileage: e.target.value }))}
                      className="w-full bg-slate-950 text-slate-200 text-xs border border-white/5 rounded-xl px-4 py-3 outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="list-car-submit-btn"
                    type="submit"
                    className="bg-sky-500 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition duration-300 cursor-pointer"
                  >
                    Transmit Consignment Listing
                  </button>
                </div>
              </form>
            )/* Closing ListingForm check */}
          </div>

        </div>

        {/* Right Column (4 cols): Luxury Loan financing calculator */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Financing Loan Panel */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Calculator size={15} className="text-sky-400" /> Financing & Payment Calculator
            </h3>

            <div className="space-y-5">
              
              {/* Target price slider (Can easily pick favored auto, or custom adjust) */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">CAR ASKING VALUE</span>
                  <span className="text-white font-bold">${carPrice.toLocaleString()}</span>
                </div>
                <input 
                  id="calc-price-idx"
                  type="range"
                  min={20000}
                  max={800000}
                  step={5000}
                  value={carPrice}
                  onChange={(e) => setCarPrice(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-sky-505"
                />
              </div>

              {/* Downpayment slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">DOWNPAYMENT</span>
                  <span className="text-sky-400 font-bold">${downpayment.toLocaleString()} ({Math.round((downpayment/carPrice)*100)}%)</span>
                </div>
                <input 
                  id="calc-downpayment-idx"
                  type="range"
                  min={0}
                  max={carPrice * 0.9}
                  step={1000}
                  value={downpayment}
                  onChange={(e) => setDownpayment(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-sky-505"
                />
              </div>

              {/* Loan term */}
              <div>
                <label className="text-slate-400 text-xs block mb-1 font-mono uppercase">LOAN TERM (MONTHS)</label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-350/5 rounded-xl border border-white/5">
                  {[24, 36, 48, 60].map(term => (
                    <button
                      id={`term-btn-${term}`}
                      key={term}
                      type="button"
                      onClick={() => setLoanTerm(term)}
                      className={`text-[10px] font-bold py-1.5 rounded-lg transition-all ${
                        loanTerm === term 
                          ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25 shadow-md' 
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest rate */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">ANNUAL APR RATE</span>
                  <span className="text-white font-bold">{interestRate}%</span>
                </div>
                <input 
                  id="calc-interest-idx"
                  type="range"
                  min={1.9}
                  max={12.9}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-sky-505"
                />
              </div>

              {/* Outputs block */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 space-y-3.5 pt-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-xs font-mono text-slate-400 uppercase">MONTHLY ESTIMATE</span>
                  <span className="text-xl font-mono text-sky-400 font-black">${Math.round(monthlyPayment).toLocaleString()}/mo</span>
                </div>
                
                <div className="text-[11px] font-mono text-slate-400 space-y-1.5 leading-none">
                  <div className="flex justify-between">
                    <span>Financed Principal:</span>
                    <span className="text-slate-100">${(carPrice - downpayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest Paid:</span>
                    <span className="text-slate-100">${Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Transaction Cost:</span>
                    <span className="text-slate-100">${Math.round(totalCost).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick instructions / Authorized Dealers list */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 scroll-thin max-h-[295px] overflow-y-auto">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono mb-3.5 flex items-center gap-2">
              <Building2 size={14} className="text-sky-400" /> Stuttgart Partner Dealers
            </h4>
            
            <div className="space-y-3">
              {dealers.map(dealer => (
                <div key={dealer.id} className="p-3 bg-slate-950/20 border border-white/5 hover:bg-slate-950/40 transition rounded-xl flex items-center gap-3">
                  <img 
                    src={dealer.logoUrl} 
                    alt={dealer.name} 
                    className="w-9 h-9 object-cover rounded-xl border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{dealer.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono italic block">{dealer.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
