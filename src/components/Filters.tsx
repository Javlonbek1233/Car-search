import React from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, Search, RotateCcw, Box, Globe, Flame, ShieldAlert } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  minPrice: number;
  maxPrice: number;
  availableBrands: string[];
  availableCountries: string[];
}

export default function Filters({ 
  filters, 
  setFilters, 
  minPrice, 
  maxPrice, 
  availableBrands, 
  availableCountries 
}: FiltersProps) {

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      brand: 'All',
      model: '',
      year: 'All',
      maxPrice: maxPrice,
      fuelType: 'All',
      transmission: 'All',
      country: 'All',
      mileage: 'All',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, brand: e.target.value }));
  };

  const handleFuelTypeChange = (fuel: string) => {
    setFilters(prev => ({ ...prev, fuelType: prev.fuelType === fuel ? 'All' : fuel }));
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative">
      
      {/* Search Header and Reset */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-sky-455" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest font-sans">Advanced Filters Panel</h3>
        </div>
        <button
          id="reset-filters-btn"
          onClick={handleReset}
          className="text-xs text-slate-440 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition rounded-xl font-mono"
        >
          <RotateCcw size={12} /> Reset Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Brand Dropdown */}
        <div>
          <label className="text-slate-490 text-xs font-semibold uppercase tracking-wider block mb-2 font-mono">Manufacturer Brand</label>
          <select
            id="brand-filter-select"
            value={filters.brand}
            onChange={handleBrandChange}
            className="w-full bg-slate-900 border border-white/10 text-slate-200 text-xs rounded-xl px-4 py-3 select-none outline-none focus:ring-1 focus:ring-sky-500/30 transition font-sans cursor-pointer hover:bg-slate-850"
          >
            <option value="All">All Manufacturers</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="text-slate-490 text-xs font-semibold uppercase tracking-wider block mb-2 font-mono">Gearbox / Transmission</label>
          <select
            id="transmission-filter-select"
            value={filters.transmission}
            onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
            className="w-full bg-slate-900 border border-white/10 text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500/30 transition font-sans cursor-pointer hover:bg-slate-855"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic Type</option>
            <option value="Manual">Manual Transmission</option>
            <option value="Dual-Clutch">Dual-Clutch PDK</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="text-slate-490 text-xs font-semibold uppercase tracking-wider block mb-2 font-mono">Country of Engineering</label>
          <select
            id="country-filter-select"
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="w-full bg-slate-900 border border-white/10 text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500/30 transition font-sans cursor-pointer hover:bg-slate-855"
          >
            <option value="All">Global Origin</option>
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type Toggles */}
        <div>
          <label className="text-slate-490 text-xs font-semibold uppercase tracking-wider block mb-2 font-mono">Propulsion Energy</label>
          <div className="flex gap-1.5 p-1 bg-slate-950 border border-white/5 rounded-xl">
            {['Electric', 'Hybrid', 'Petrol'].map((fuel) => (
              <button
                id={`fuel-toggle-${fuel.toLowerCase()}`}
                key={fuel}
                onClick={() => handleFuelTypeChange(fuel)}
                className={`flex-1 text-[10px] uppercase font-bold py-2 rounded-lg transition-all duration-200 ${
                  filters.fuelType === fuel 
                    ? 'bg-sky-500/15 border border-sky-500/25 text-sky-400 shadow-md' 
                    : 'text-slate-405 border border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Second Row: Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-5 border-t border-white/5">
        
        {/* Maximum Price Ceiling Slider */}
        <div>
          <div className="flex justify-between items-center mb-2 text-xs font-mono">
            <span className="text-slate-400 uppercase font-semibold">Maximum Price Limit</span>
            <span className="text-sky-400 font-bold">${filters.maxPrice.toLocaleString()} USD</span>
          </div>
          <input
            id="price-range-slider"
            type="range"
            min={minPrice}
            max={maxPrice}
            step={5000}
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>${minPrice.toLocaleString()}</span>
            <span>${maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Mileage constraint */}
        <div>
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2 font-mono">Odometer Kilometer / Mileage</label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-955 border border-white/5 rounded-xl">
            {['All', '100', '1000', '5000'].map((mile) => (
              <button
                id={`mileage-toggle-${mile}`}
                key={mile}
                onClick={() => setFilters(prev => ({ ...prev, mileage: mile }))}
                className={`text-[10px] uppercase font-bold py-2.5 rounded-lg transition-all duration-200 ${
                  filters.mileage === mile 
                    ? 'bg-sky-500/15 border border-sky-500/25 text-sky-400 shadow-md' 
                    : 'text-slate-405 border border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {mile === 'All' ? 'Any Miles' : `< ${mile} mi`}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
