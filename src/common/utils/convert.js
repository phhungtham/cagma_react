import { convertCurrency } from './formater';

export const toJson = (str, defaultValue) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};
export const sum = listNumbers => listNumbers.reduce((prev, item) => prev + (item || 0), 0);
export const sumWithFormat = listNumber => convertCurrency(sum(listNumber), 3);
export const currencyWithSign = (number, sign = '$') => `${sign}${number}`;

export const convertToOrdinal = n => {
  let ord = 'th';
  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }
  return n + ord;
};
