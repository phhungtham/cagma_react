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
