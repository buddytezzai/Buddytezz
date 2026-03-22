
export const formatIndianCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatEuropeanCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatUSCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatIndianNumber = (value) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatEuropeanNumber = (value) => {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatUSNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
};
