export const convertDateTime = dateTime => {
  if (typeof dateTime.getMonth !== 'function') return dateTime;
  let newDateString =
    ('0' + dateTime.getDate()).slice(-2) +
    '.' +
    ('0' + (dateTime.getMonth() + 1)).slice(-2) +
    '.' +
    dateTime.getFullYear();
  return newDateString;
};

/**
 * It takes a date in the format YYYYMMDD and returns it in the format DD.MM.YYYY
 * @returns the date in the format of day.month.year.
 */
export const formatDate = date => {
  if (date) {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}.${month}.${year}`;
  }
};

//Example: 1122 -> 11/22
export const formatExpiryDate = (newValue = '', curValue = '') => {
  if (!newValue) {
    return '';
  }
  let result = newValue;
  if (newValue.length === 2 && curValue.length === 3) {
    result = newValue.substring(0, 1);
  } else if (newValue.length >= 2) {
    result = newValue.replace(/\D/g, '');
    result = `${result.substring(0, 2)}/${result.substring(2, 4)}`;
  }
  return result;
};

//Example: 123456789 -> 1234-5678-9
export const formatCardNumber = value => {
  if (!value) {
    return '';
  }
  let result = value.replace(/\D/g, '');
  return result.match(/.{1,4}/g).join('-');
};
