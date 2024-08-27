export const CurrencyCode = {
  CAD: 'CAD',
  USD: 'USD',
  KRW: 'KRW',
};

export const CurrencyPrefixBaseCode = {
  [CurrencyCode.CAD]: '$',
  [CurrencyCode.USD]: 'US$',
  [CurrencyCode.KRW]: '₩',
};

export const CurrencyAmountDefaultBaseCode = {
  [CurrencyCode.CAD]: '0.00',
  [CurrencyCode.USD]: '0.00',
  [CurrencyCode.KRW]: '0',
};

export const CurrencyExchangeDefaultBaseCode = {
  [CurrencyCode.CAD]: '1.00',
  [CurrencyCode.USD]: '1.00',
  [CurrencyCode.KRW]: '1',
};
