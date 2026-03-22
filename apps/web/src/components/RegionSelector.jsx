
import React from 'react';
import { useRegion } from '@/hooks/useRegion.js';
import { REGIONS } from '@/lib/regionConfig.js';

const RegionSelector = () => {
  const { region, setRegion } = useRegion();

  return (
    <div className="flex justify-center mb-10 w-full region-transition">
      <div className="inline-flex bg-[hsl(var(--muted))/40] p-1.5 rounded-2xl shadow-inner border border-[hsl(var(--border))] backdrop-blur-md overflow-x-auto max-w-full hide-scrollbar">
        {Object.keys(REGIONS).map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              region === r 
                ? 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white shadow-lg shadow-[hsl(var(--primary))]/25 scale-105' 
                : 'text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--muted))]'
            }`}
            aria-pressed={region === r}
          >
            <span className="text-lg opacity-80">{REGIONS[r].symbol}</span>
            {REGIONS[r].name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;
