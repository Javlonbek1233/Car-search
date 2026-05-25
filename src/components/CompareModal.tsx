import React, { useState } from 'react';
import { Car } from '../types';
import { X, Sparkles, Zap, Award, BookOpen, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface CompareModalProps {
  carA: Car;
  carB: Car | null;
  allCars: Car[];
  onSelectCarB: (car: Car) => void;
  onClose: () => void;
}

export default function CompareModal({ carA, carB, allCars, onSelectCarB, onClose }: CompareModalProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiVerdict, setAiVerdict] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const eligibleCarsForB = allCars.filter(car => car.id !== carA.id);

  const fetchAiComparison = async () => {
    if (!carB) return;
    setIsLoading(true);
    setErrorMsg('');
    setAiAnalysis('');
    setAiVerdict('');

    try {
      const response = await fetch('/api/car-compare-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carAId: carA.id, carBId: carB.id }),
      });

      if (!response.ok) {
        throw new Error('Could not pull AI comparison metrics. Please check server logs.');
      }

      const data = await response.json();
      setAiAnalysis(data.analysisText || 'Detailed analysis unavailable.');
      setAiVerdict(data.verdict || 'Verdict unavailable.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred contacting the AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compute Relative Performance Scores (0-100 scale) for visual meters
  const parseAcceleration = (accStr: string): number => {
    const matched = accStr.match(/(\d+\.?\d*)/);
    return matched ? parseFloat(matched[1]) : 5.0;
  };

  const parsePower = (powerStr: string): number => {
    const matched = powerStr.replace(/,/g, '').match(/(\d+)/);
    return matched ? parseInt(matched[1], 10) : 400;
  };

  const scoreAccA = Math.max(20, Math.min(100, Math.round((7.0 - parseAcceleration(carA.specifications.acceleration)) * 16)));
  const scoreAccB = carB ? Math.max(20, Math.min(100, Math.round((7.0 - parseAcceleration(carB.specifications.acceleration)) * 16))) : 0;

  const scorePowerA = Math.max(30, Math.min(100, Math.round((parsePower(carA.specifications.power) / 1200) * 100)));
  const scorePowerB = carB ? Math.max(30, Math.min(100, Math.round((parsePower(carB.specifications.power) / 1200) * 100))) : 0;

  const scoreWeightA = Math.max(30, Math.min(100, Math.round((6000 - parseInt(carA.specifications.weight.replace(/,/g, '').match(/\d+/)?.[0] || '3500', 10)) / 40)));
  const scoreWeightB = carB ? Math.max(30, Math.min(100, Math.round((6000 - parseInt(carB.specifications.weight.replace(/,/g, '').match(/\d+/)?.[0] || '3500', 10)) / 40))) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Glowing Headlight Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 sticky top-0 backdrop-blur z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">DRIVE-METRIC LABS</span>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="text-emerald-400 fill-emerald-400/20" size={24} /> Side-by-Side Comparison
            </h2>
          </div>
          <button
            id="close-compare-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition rounded-xl"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Scroll Space */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* CAR A (Primary Subject) */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 relative">
              <span className="absolute top-4 right-4 bg-emerald-900/50 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">PRIMARY</span>
              <img 
                src={carA.heroImage} 
                alt={`${carA.brand} ${carA.model}`}
                className="w-full h-44 object-cover rounded-xl mb-4 border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <span className="text-slate-500 text-xs font-mono">{carA.country.toUpperCase()} • {carA.year}</span>
              <h3 className="text-xl font-bold text-white mb-2">{carA.brand} <span className="text-emerald-400">{carA.model}</span></h3>
              <p className="text-xl font-mono text-emerald-400 font-bold">${carA.price.toLocaleString()}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500 block">ENGINE:</span>
                  <span className="text-white font-medium">{carA.specifications.engine}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DRIVETRAIN:</span>
                  <span className="text-white font-medium">{carA.specifications.driveTrain}</span>
                </div>
              </div>
            </div>

            {/* CAR B (Symmetric selection target) */}
            {carB ? (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 relative">
                <button
                  id="reset-compare-b-btn"
                  onClick={() => {
                    setAiAnalysis('');
                    setAiVerdict('');
                  }}
                  className="absolute top-4 right-4 text-xs text-slate-400 hover:text-rose-400 bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-lg"
                >
                  Change Vehicle
                </button>
                <img 
                  src={carB.heroImage} 
                  alt={`${carB.brand} ${carB.model}`}
                  className="w-full h-44 object-cover rounded-xl mb-4 border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <span className="text-slate-500 text-xs font-mono">{carB.country.toUpperCase()} • {carB.year}</span>
                <h3 className="text-xl font-bold text-white mb-2">{carB.brand} <span className="text-cyan-400">{carB.model}</span></h3>
                <p className="text-xl font-mono text-cyan-400 font-bold">${carB.price.toLocaleString()}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500 block">ENGINE:</span>
                    <span className="text-white font-medium">{carB.specifications.engine}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">DRIVETRAIN:</span>
                    <span className="text-white font-medium">{carB.specifications.driveTrain}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/20 border border-dashed border-slate-800 rounded-3xl h-full min-h-[300px] flex flex-col justify-center items-center p-6 text-center">
                <HelpCircle size={44} className="text-slate-600 mb-3 animate-pulse" />
                <h4 className="text-slate-300 font-bold mb-1">Select Opponent</h4>
                <p className="text-xs text-slate-500 max-w-xs mb-4">Choose another ultra-luxury model to match metrics and evaluate dynamics.</p>
                <select
                  id="compare-target-select"
                  onChange={(e) => {
                    const selected = eligibleCarsForB.find(c => c.id === e.target.value);
                    if (selected) onSelectCarB(selected);
                  }}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-400 outline-none w-full max-w-xs"
                >
                  <option value="">-- Choose Car --</option>
                  {eligibleCarsForB.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.year})
                    </option>
                  ))}
                </select>
              </div>
            )}

          </div>

          {/* Performance Radar Metrics Indicators */}
          {carB && (
            <div className="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-6 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <Zap size={15} /> Relative Metric Vectors
              </h3>
              
              <div className="space-y-6">
                
                {/* Acceleration Power Metric */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>ACCELERATION VECTOR (0-60 MPH index)</span>
                    <span className="flex gap-4">
                      <span className="text-emerald-400">{carA.brand} {carA.model}: {carA.specifications.acceleration}</span>
                      <span className="text-cyan-400">{carB.brand} {carB.model}: {carB.specifications.acceleration}</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${scoreAccA}%` }} 
                    />
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500 border-l border-slate-950" 
                      style={{ width: `${scoreAccB}%` }} 
                    />
                  </div>
                </div>

                {/* Power Rating HP Metric */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>ENGINE POWER DYNAMICS (HP index)</span>
                    <span className="flex gap-4">
                      <span className="text-emerald-400">{carA.brand}: {carA.specifications.power}</span>
                      <span className="text-cyan-400">{carB.brand}: {carB.specifications.power}</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${scorePowerA}%` }} 
                    />
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500 border-l border-slate-950" 
                      style={{ width: `${scorePowerB}%` }} 
                    />
                  </div>
                </div>

                {/* Lightweight index */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>LIGHTWEIGHT EFFICIENCY VECTOR</span>
                    <span className="flex gap-4">
                      <span className="text-emerald-400">{carA.brand}: {carA.specifications.weight}</span>
                      <span className="text-cyan-400">{carB.brand}: {carB.specifications.weight}</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex text-right">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${scoreWeightA}%` }} 
                    />
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500 border-l border-slate-950" 
                      style={{ width: `${scoreWeightB}%` }} 
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* AI Neural Review Hub */}
          {carB && (
            <div className="border border-slate-800/80 bg-gradient-to-br from-slate-950/60 to-slate-900/60 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={80} className="text-slate-400" />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#a855f7] bg-purple-900/40 border border-purple-500/20 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <Sparkles size={11} /> Motorcar Intelligent Advisor
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">Simultaneous AI Deep-Tissue Review</h3>
                </div>
                
                <button
                  id="trigger-ai-match-btn"
                  onClick={fetchAiComparison}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:from-[#c084fc] hover:to-[#f472b6] text-xs font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-purple-500/20 active:scale-95 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? 'Consulting Neural Array...' : 'Evaluate with Gemini AI'}
                </button>
              </div>

              {isLoading && (
                <div className="space-y-3 py-4">
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3" />
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {aiVerdict && (
                <div className="mb-4 p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl font-sans text-xs flex items-start gap-2.5">
                  <Award className="text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wide">Dynamic Verdict Outcome</h4>
                    <p className="text-white mt-1 leading-relaxed">{aiVerdict}</p>
                  </div>
                </div>
              )}

              {aiAnalysis && (
                <div className="p-5 bg-slate-950/60 border border-slate-800/60 rounded-2xl text-xs text-slate-300 space-y-3 leading-relaxed font-sans max-h-[350px] overflow-y-auto">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] pb-2 border-b border-slate-800/80">
                    <BookOpen size={12} /> Analytical Evaluation Report
                  </div>
                  <div className="whitespace-pre-wrap selection:bg-purple-500/40 prose prose-invert max-w-none text-slate-200">
                    {aiAnalysis}
                  </div>
                </div>
              )}

              {!isLoading && !aiAnalysis && !errorMsg && (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                  <span className="text-xs text-slate-500 block font-mono">NEURAL ARRAY REVIEWS EMPTY</span>
                  <span className="text-amber-500 text-xs mt-1 block">Click the Evaluate button above to trigger full V12-vs-EV performance telemetry matching.</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end bg-slate-900/50 sticky bottom-0">
          <button
            id="close-compare-modal-footer-btn"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-6 py-3 rounded-2xl border border-slate-700 transition"
          >
            Exit Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
