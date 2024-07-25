/**
 * Format the given numberable such as 12345 | 12345 to expected format
 * @param {string|number} currency a number will be formatted as a currency
 * @param {object} options conform the format { separate: <default to ,>, toFixed: <default to 2>, divider: <default to .> }
 * @returns A formatted number
 */
export const convertCurrency = (currency, options = {}) => {
  const { separate = ',', toFixed = 2, divider = '.' } = options;
  let c = parseFloat(currency).toFixed(toFixed);
  const [even, odd] = c.split('.');
  const maxIndex = even.length - 1;
  let index = maxIndex;
  let groupDigits = '';
  let time = 0;
  let result = [];
  while (index >= 0) {
    groupDigits = `${c[index]}${groupDigits}`;
    time += 1;
    if (time === 3) {
      result = [groupDigits, ...result];
      groupDigits = '';
      time = 0;
    }
    index -= 1;
  }

  // negative
  if (groupDigits === '-') {
    result[0] = `-${result[0]}`;
  } else if (groupDigits.length > 0) {
    result = [groupDigits, ...result];
  }
  // has odd
  if (odd) {
    return `${result.join(separate)}${divider}${odd}`;
  }
  return `${result.join(separate)}`;
};

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
