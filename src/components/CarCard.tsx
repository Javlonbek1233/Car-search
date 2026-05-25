import React from 'react';
import { Car } from '../types';
import { Star, Heart, GitCompare, Eye, Fuel, Gauge, Zap } from 'lucide-react';

interface CarCardProps {
  key?: string;
  car: Car;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (car: Car) => void;
  onAddToCompare: (car: Car) => void;
}

export default function CarCard({ 
  car, 
  isFavorite, 
  onToggleFavorite, 
  onSelect, 
  onAddToCompare 
}: CarCardProps) {
  return (
    <div className="bg-slate-900/20 hover:bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 rounded-2xl overflow-hidden relative group shadow-lg flex flex-col justify-between h-full">
      {/* Absolute Badges on Image */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 transition duration-300">
        <div className="flex gap-1.5">
          {car.isNewArrival && (
            <span className="bg-sky-500 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              NEW ARRIVAL
            </span>
          )}
          {car.isPopular && (
            <span className="bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              POPULAR
            </span>
          )}
        </div>
        <button
          id={`fav-btn-${car.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(car.id);
          }}
          className={`p-2.5 rounded-full backdrop-blur-md justify-center items-center flex transition-transform active:scale-95 duration-300 ${
            isFavorite 
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' 
              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={14} className={isFavorite ? 'fill-rose-500' : ''} />
        </button>
      </div>

      {/* Main image content with zoom-on-hover effect */}
      <div className="relative overflow-hidden aspect-[16/10] w-full border-b border-white/5">
        <img 
          src={car.heroImage} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Dark subtle shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-90" />

        {/* Highlight Specifications preview inside image overlay */}
        <div className="absolute bottom-4 inset-x-4 flex justify-between items-end">
          <div>
            <span className="text-slate-400 text-[10px] font-mono block uppercase">{car.country}</span>
            <h4 className="text-white font-black text-lg tracking-tight group-hover:text-sky-400 transition-colors uppercase">
              {car.brand} <span className="text-sky-400 font-medium font-sans text-base block md:inline">{car.model}</span>
            </h4>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">{car.year}</span>
            <p className="text-white font-mono text-base font-bold tracking-tight">${car.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Specs Overview grid */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/5 text-center">
          <div className="text-xs font-mono">
            <span className="text-slate-500 text-[9px] block uppercase">0-60 MPH</span>
            <span className="text-slate-200 font-semibold">{car.specifications.acceleration}</span>
          </div>
          <div className="text-xs font-mono border-x border-white/5">
            <span className="text-slate-500 text-[9px] block uppercase">DRIVETRAIN</span>
            <span className="text-slate-200 font-semibold">{car.specifications.driveTrain}</span>
          </div>
          <div className="text-xs font-mono">
            <span className="text-slate-500 text-[9px] block uppercase">POWER</span>
            <span className="text-slate-200 font-semibold truncate max-w-full block px-1">
              {car.specifications.power.split('@')[0]}
            </span>
          </div>
        </div>

        {/* Feature quick highlight list */}
        <div className="py-3 flex-1">
          <ul className="text-[10px] text-slate-400 font-mono space-y-1 my-1">
            {car.features.slice(0, 2).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-1.5 truncate text-[10.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-450 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Action items */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
          {/* Quick comparison button */}
          <button
            id={`compare-add-${car.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCompare(car);
            }}
            className="flex items-center justify-center gap-1 text-[10.5px] uppercase font-bold py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 transition rounded-xl cursor-pointer"
          >
            <GitCompare size={12} /> Compare
          </button>

          {/* View Studio detail button */}
          <button
            id={`inspect-btn-${car.id}`}
            onClick={() => onSelect(car)}
            className="flex items-center justify-center gap-1 text-[10.5px] uppercase font-bold py-2 bg-gradient-to-r from-sky-505 to-indigo-555 hover:from-sky-500 hover:to-indigo-500 text-white transition rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)] hover:shadow-[0_4px_16px_rgba(56,189,248,0.3)]"
          >
            <Eye size={12} /> Showcase
          </button>
        </div>

      </div>

    </div>
  );
}
