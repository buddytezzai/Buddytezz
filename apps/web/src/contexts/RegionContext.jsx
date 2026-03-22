
import React, { createContext, useState, useEffect } from 'react';
import { REGIONS } from '@/lib/regionConfig.js';

export const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegionState] = useState('India');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedRegion');
    if (saved && REGIONS[saved]) {
      setRegionState(saved);
    }
    setIsLoaded(true);
  }, []);

  const setRegion = (newRegion) => {
    if (REGIONS[newRegion]) {
      setRegionState(newRegion);
      localStorage.setItem('selectedRegion', newRegion);
    }
  };

  if (!isLoaded) return null;

  return (
    <RegionContext.Provider value={{ region, setRegion, config: REGIONS[region] }}>
      {children}
    </RegionContext.Provider>
  );
};
