import React, { useState } from 'react';
import { Car, CarColor, Review } from '../types';
import Customizer360 from './Customizer360';
import { ChevronLeft, Star, Milestone, Sparkles, Building2, Calculator, MessageSquareText, PlusCircle, CheckCircle } from 'lucide-react';

interface CarDetailsProps {
  car: Car;
  allCars: Car[];
  onBack: () => void;
  onSelectCar: (car: Car) => void;
}

export default function CarDetails({ car, allCars, onBack, onSelectCar }: CarDetailsProps) {
  const [activeColor, setActiveColor] = useState<CarColor>(car.colors[0]);
  const [reviews, setReviews] = useState<Review[]>(car.reviews);

  // Review Form state
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Filter similar items matching category or origin
  const similarCars = allCars
    .filter(c => c.id !== car.id && (c.category === car.category || c.brand === car.brand))
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: `r-new-${Date.now()}`,
      author: reviewName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment,
      verifiedBuyer: true
    };

    setReviews(prev => [newReview, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Back Button */}
      <button
        id="detail-back-btn"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition active:scale-95 duration-200 cursor-pointer"
      >
        <ChevronLeft size={16} /> Close Telemetry Studio
      </button>

      {/* Main Grid: Customizer Studio and Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Integrated Customizer 360 */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Showcase */}
          <Customizer360 
            car={car} 
            activeColor={activeColor} 
            setActiveColor={setActiveColor} 
          />

          {/* Specifications details */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Milestone size={15} className="text-sky-400" /> Full Engineering Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">ENGINE PROPULSION:</span>
                  <span className="text-white font-medium">{car.specifications.engine}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">TOTAL POWER:</span>
                  <span className="text-white font-medium">{car.specifications.power}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">TORQUE OUTPUT:</span>
                  <span className="text-white font-medium">{car.specifications.torque}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">DRIVETRAIN LAYOUT:</span>
                  <span className="text-white font-medium">{car.specifications.driveTrain}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">0-60 MPH ACCELERATION:</span>
                  <span className="text-white font-medium">{car.specifications.acceleration}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">V-MAX TOP SPEED:</span>
                  <span className="text-white font-medium">{car.specifications.topSpeed}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-slate-850">
                  <span className="text-slate-500 uppercase">CURB WEIGHT:</span>
                  <span className="text-white font-medium">{car.specifications.weight}</span>
                </div>
                {car.specifications.batteryRange && (
                  <div className="flex justify-between items-center text-xs font-mono py-2 border-b border-white/5">
                    <span className="text-slate-500 uppercase">BATTERY EV RANGE:</span>
                    <span className="text-sky-400 font-bold">{car.specifications.batteryRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review & Ratings Section */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono flex items-center gap-1.5 border-b border-white/5 pb-2">
              <MessageSquareText size={15} className="text-sky-400" /> Verified Community Ratings
            </h3>

            {/* Form list submission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Form submit review */}
              <div className="p-5 bg-slate-950/45 rounded-2xl border border-white/5 relative">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
                  <PlusCircle size={14} className="text-sky-400" /> Compose Verification review
                </h4>

                {submitSuccess ? (
                  <div className="py-8 text-center bg-sky-950/20 border border-sky-500/25 rounded-xl">
                    <CheckCircle className="text-sky-400 mx-auto mb-2" size={32} />
                    <span className="text-xs text-white uppercase font-bold tracking-wider">Verification Complete</span>
                    <p className="text-[11px] text-slate-400 mt-1">Review rendered instantly below.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase block mb-1">Your Full Name *</label>
                      <input 
                        id="review-form-author"
                        type="text" 
                        required
                        placeholder="e.g. Lewis H."
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-2 outline-none font-sans focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase block mb-1">Product Star Rating *</label>
                      <select
                        id="review-form-rating"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-white/10 text-slate-205 rounded-xl px-3 py-2 outline-none"
                      >
                        <option value="5">★★★★★ Exceptional (5/5)</option>
                        <option value="4">★★★★☆ Superb (4/5)</option>
                        <option value="3">★★★☆☆ Moderate (3/5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-505 text-[9px] font-mono uppercase block mb-1">Verbal Commentary *</label>
                      <textarea 
                        id="review-form-comment"
                        required
                        rows={3}
                        placeholder="Detail mechanical feedback, aerodynamic curves, or hybrid transmission feel..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-slate-205 rounded-xl px-3 py-2 outline-none font-sans focus:border-sky-500/50"
                      />
                    </div>
                    <button
                      id="submit-review-btn"
                      type="submit"
                      className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold tracking-widest uppercase text-[10px] py-3.5 rounded-xl border border-sky-600 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                    >
                      Authenticate Review
                    </button>
                  </form>
                )}
              </div>

              {/* Display existing reviews */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img 
                            src={review.avatar} 
                            alt={review.author} 
                            className="w-7 h-7 object-cover rounded-full border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-white block">{review.author}</span>
                            <span className="text-[10px] text-slate-500 font-mono italic block">{review.date}</span>
                          </div>
                        </div>
                        <span className="text-yellow-500 font-mono font-bold font-sans">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-3 leading-relaxed font-sans">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/10">
                    <span className="text-slate-500 text-xs block font-mono">NO CORRESPONDENCE YET</span>
                    <span className="text-slate-400 text-[11px] block mt-1">Be the first to compose verified engineering comments for the model.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Sidebars, Loan calculator and Similars */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Key values details card */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 text-center space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              Verified Stock Listing
            </span>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-mono">{car.year} Model • {car.category} Category</span>
              <h2 className="text-2xl font-black text-white">{car.brand} <span className="text-sky-400">{car.model}</span></h2>
              <p className="text-2xl font-mono text-sky-400 font-black tracking-tight">${car.price.toLocaleString()}</p>
            </div>

            <div className="pt-3.5 border-t border-white/5 grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400 uppercase text-left">
              <div>
                <span className="text-[9px] block text-slate-500">Odometer:</span>
                <span className="text-slate-200 font-bold text-xs">{car.mileage.toLocaleString()} mi</span>
              </div>
              <div>
                <span className="text-[9px] block text-slate-500">Gearbox:</span>
                <span className="text-slate-200 font-bold text-xs">{car.transmission}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-white/5 rounded-2xl text-[11px] font-sans text-left text-slate-300 leading-relaxed shadow-sm opacity-90">
              <span className="font-bold text-white text-xs tracking-wider block mb-1">Standard Premium Perks</span>
              - VIP Stuttgart Delivery <br />
              - 1 Year Powertrain Telemetry Tracking <br />
              - Dynamic Aerodynamics warranty included.
            </div>
          </div>

          {/* Similar suggestions */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono mb-3.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-400" /> Similar Curations
            </h4>

            <div className="space-y-3">
              {similarCars.map((similar) => (
                <div 
                  key={similar.id} 
                  onClick={() => onSelectCar(similar)}
                  className="p-3 bg-slate-900/20 hover:bg-slate-900/45 border border-white/5 rounded-2xl flex gap-3.5 items-center group cursor-pointer transition select-none"
                >
                  <img 
                    src={similar.heroImage} 
                    alt={similar.model} 
                    className="w-16 h-12 object-cover rounded-xl border border-white/10"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">{similar.brand}</span>
                    <h5 className="text-xs font-bold text-white group-hover:text-sky-400 transition truncate">{similar.model}</h5>
                    <span className="text-[10px] text-sky-400 font-mono block">${similar.price.toLocaleString()}</span>
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
