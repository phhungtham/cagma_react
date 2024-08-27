export const stringNumberToCurrency = value => {
  value = value.replace(/,/g, '');
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const currencyToStringNumber = value => {
  return value.replace(/,/g, '');
};
