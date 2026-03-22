
import { 
  formatIndianCurrency, 
  formatEuropeanCurrency, 
  formatUSCurrency, 
  formatIndianNumber, 
  formatEuropeanNumber, 
  formatUSNumber 
} from './currencyFormatter.js';
import { regionalMultipliers } from './regionalPricing.js';

export const REGIONS = {
  India: { 
    name: 'India', 
    symbol: '₹', 
    currency: 'INR', 
    formatCurrency: formatIndianCurrency, 
    formatNumber: formatIndianNumber, 
    multiplier: regionalMultipliers.India 
  },
  Europe: { 
    name: 'Europe', 
    symbol: '€', 
    currency: 'EUR', 
    formatCurrency: formatEuropeanCurrency, 
    formatNumber: formatEuropeanNumber, 
    multiplier: regionalMultipliers.Europe 
  },
  USA: { 
    name: 'USA', 
    symbol: '$', 
    currency: 'USD', 
    formatCurrency: formatUSCurrency, 
    formatNumber: formatUSNumber, 
    multiplier: regionalMultipliers.USA 
  }
};

export const formatCurrency = (value, region) => {
  return REGIONS[region]?.formatCurrency(value) || REGIONS.USA.formatCurrency(value);
};

export const formatNumber = (value, region) => {
  return REGIONS[region]?.formatNumber(value) || REGIONS.USA.formatNumber(value);
};

export const getRegionalMultiplier = (region) => {
  return REGIONS[region]?.multiplier || 1.0;
};
