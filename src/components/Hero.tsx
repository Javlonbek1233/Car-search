import React, { useState } from 'react';
import { Search, Sparkles, Bot, CornerDownLeft, Zap, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Car } from '../types';

interface HeroProps {
  onSearchAIResult: (result: any) => void;
  onSelectCar: (car: Car) => void;
  allCars: Car[];
}

export default function Hero({ onSearchAIResult, onSelectCar, allCars }: HeroProps) {
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const prebuiltPrompts = [
    { label: 'Italian V12 Hypercar', prompt: 'I want a pure V12 Italian hypercar with active shock absorbers and hybrid speed injection.' },
    { label: 'Track Performance Porsche', prompt: 'I want an extreme high RPM track porsche matching GT specification.' },
    { label: 'Performance Electric Sedan', prompt: 'What is a highly comfortable AWD electric sedan with cinema screen interiors?' },
  ];

  const handleAiSmartSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAiLoading(true);
    setErrorText('');

    try {
      const response = await fetch('/api/search-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        throw new Error('Could not pull AI search suggestions.');
      }

      const data = await response.json();
      onSearchAIResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'An error occurred fetching smart recommendations. Please retry.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="relative py-16 md:py-24 overflow-hidden border border-white/5 rounded-3xl bg-slate-950/40 backdrop-blur-md">
      {/* Immersive Dark Cosmic Halo Backdrops */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-sky-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-505/10 to-transparent blur-3xl pointer-events-none" />

      {/* Spotlight backdrop grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Hero Outer Frame Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Verification indicator */}
        <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold rounded-full uppercase tracking-wider mb-6 inline-flex items-center gap-1.5">
          <ShieldCheck size={13} />
          Authorized Stuttgart-Apex Motoring Interface
        </span>

        {/* Dynamic Display Heading */}
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6 font-sans">
          The Future of Motoring, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Intelligently Curated
          </span>
        </h1>

        {/* Slogan */}
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
          Discover, customize, and evaluate the world&apos;s most exceptional supercars, extreme EVs, and luxury cruisers. Fully integrated side-by-side metric analytics guided by real-time Gemini AI.
        </p>

        {/* Smart AI Search Console Input Block */}
        <div className="bg-slate-900/45 backdrop-blur-xl border border-white/5 p-3 rounded-2xl md:rounded-3xl max-w-2xl mx-auto shadow-2xl relative">
          <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-20">
            <Bot size={22} className="text-slate-400" />
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAiSmartSearch(aiQuery);
            }} 
            className="flex flex-col md:flex-row gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 text-slate-500" size={18} />
              <input
                id="smart-ai-search-input"
                type="text"
                placeholder="Talk to AI... 'I want an extreme Porsche for track work under $250k'"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="w-full bg-slate-950/60 text-slate-200 text-xs border border-white/10 rounded-xl md:rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition font-sans"
              />
            </div>
            <button
              id="smart-search-submit-btn"
              type="submit"
              disabled={isAiLoading || !aiQuery.trim()}
              className="bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-40 font-bold text-xs px-6 py-3.5 rounded-xl md:rounded-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            >
              {isAiLoading ? 'Consulting Advisor...' : 'Smart Search'}
              <CornerDownLeft size={13} className="hidden md:block text-slate-100" />
            </button>
          </form>

          {errorText && (
            <p className="text-xs text-red-450 text-left mt-2.5 ml-3 font-mono">{errorText}</p>
          )}

          {/* Prompt chips suggestions */}
          <div className="mt-4 pt-3 border-t border-white/5 text-left">
            <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-sky-450" /> Dynamic Search suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {prebuiltPrompts.map((chip, idx) => (
                <button
                  id={`chip-btn-${idx}`}
                  key={idx}
                  onClick={() => {
                    setAiQuery(chip.prompt);
                    handleAiSmartSearch(chip.prompt);
                  }}
                  className="text-[11px] text-slate-300 bg-slate-950/50 border border-white/5 hover:border-sky-500/30 hover:bg-slate-950 transition-colors rounded-xl px-3.5 py-1.5 cursor-pointer flex items-center gap-1 font-mono"
                >
                  <ArrowRight size={10} className="text-sky-450" />
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Carousel Preview Slider of Featured Assets */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <div className="flex -space-x-3 items-center overflow-hidden">
            {allCars.slice(0, 4).map(car => (
              <img 
                key={car.id}
                src={car.heroImage}
                alt={car.model}
                onClick={() => onSelectCar(car)}
                className="w-12 h-9 object-cover rounded-lg border-2 border-slate-950 hover:scale-110 active:scale-95 cursor-pointer hover:z-20 transition shadow"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-tight uppercase flex items-center gap-1">
            <Compass size={13} className="animate-spin text-slate-500" style={{ animationDuration: '8s' }} /> Click items to view active telemetry
          </span>
        </div>

      </div>
    </div>
  );
}
