export const stringNumberToCurrency = value => {
  value = value.replace(/,/g, '');
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const currencyToStringNumber = value => {
  return value.replace(/,/g, '');
};

export const formatCurrencyDisplay = value => {
  if (!value) {
    return value;
  }
  value = stringNumberToCurrency(value);
  if (!value.includes('.')) {
    value = value + '.00';
  }
  return value;
};
