import { monthNumberWithDisplays } from '@common/constants/dateTime';

/**
 * It takes a number and returns a string of that number with a leading zero if the number is less than
 * 10
 * @returns the value of the variable _result.
 */
export const dateNumberCheck = number => {
  let result = `${number}`;
  if (Number(number) < 10) {
    result = `0${number}`;
  }
  return result;
};

/**
 * It takes a month parameter and returns a date string in the format of YYYYMMDD
 * @returns A function that returns a string.
 */
export const addDateWithMonth = (monthParam, format = '', order = 'YYYYMMDD') => {
  let month = monthParam;
  let rtnDate = null;
  const curDate = new Date();
  if (month === null || month === '') {
    month = 0;
  }
  const lastDayofLastMonth = new Date(curDate.getFullYear(), curDate.getMonth() - month + 1, 0).getDate();
  if (curDate.getDate() > lastDayofLastMonth) {
    curDate.setDate(lastDayofLastMonth);
  }
  const getMonth = curDate.getMonth() - month;
  curDate.setMonth(getMonth);
  if (order === 'YYYYMMDD') {
    rtnDate = `${String(curDate.getFullYear())}${format}${String(
      dateNumberCheck(curDate.getMonth() + 1)
    )}${format}${String(dateNumberCheck(curDate.getDate()))}`;
  } else {
    rtnDate = `${String(curDate.getDate())}${format}${String(dateNumberCheck(curDate.getMonth() + 1))}${format}${String(
      dateNumberCheck(curDate.getFullYear())
    )}`;
  }
  return rtnDate;
};

export const formatDateToStringfy = date => {
  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
};

export const formatDateExpiry = event => {
  var code = event.keyCode;
  var allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }
  event.target.value = event.target.value
    .replace(
      /^([1-9]\/|[2-9])$/g,
      '0$1/' // 3 > 03/
    )
    .replace(
      /^(0[1-9]|1[0-2])$/g,
      '$1/' // 11 > 11/
    )
    .replace(
      /^([0-1])([3-9])$/g,
      '0$1/$2' // 13 > 01/3
    )
    .replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
      '$1/$2' // 141 > 01/41
    )
    .replace(
      /^([0]+)\/|[0]+$/g,
      '0' // 0/ > 0 and 00 > 0
    )
    .replace(
      /[^\d\/]|^[\/]*$/g,
      '' // To allow only digits and `/`
    )
    .replace(
      /\/\//g,
      '/' // Prevent entering more than 1 `/`
    );
};

export const convertToShortTime = timeString => {
  //time string parameter format: "HHMMSS"
  const shortTime = `${timeString.slice(0, 2)}:${timeString.slice(2, 4)}`;
  return shortTime;
};

export const convertDateToHyphenFormat = date => {
  const hyphenDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  return hyphenDate;
};

export const convertDateToSlashFormat = date => {
  // const hyphenDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  return date;
};

export const getDayOfWeek = date => {
  const dayOfWeek = new Date(date).getDay();
  const dateOfWeek = new Date(date).getDate();
  const DayofWeekString = isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
  return `${dateNumberCheck(dateOfWeek)} ${DayofWeekString}`;
};

export const totalNumOfDaysBetweenDates = date => {
  // date : yyyymmdd
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  const currentDate = new Date().toLocaleDateString();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(currentDate.toString());
  const secondDate = new Date(`${month}/${day}/${year}`);
  const totalDay = Math.floor((secondDate - firstDate) / oneDay);
  return totalDay;
};

export const convertDateToMMYYYY = date => {
  //convert YYYYMM to MM.YYYY
  return `${date.slice(4, 6)}.${date.slice(0, 4)}`;
};

export const getDateToYYYYMMDD = date => {
  // get default date format: YYYYMMDD if date param was undefined
  if (!date) {
    return new Date()
      .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');
  } else {
    return new Date(date)
      .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');
  }
};

const handleTimeValue = time => {
  if (time < 10) {
    return `0${time}`;
  }
  return time;
};

export const getCurrentTime = format => {
  let currentDate = new Date();
  let currentHour = handleTimeValue(currentDate.getHours());
  let currentMinutes = handleTimeValue(currentDate.getMinutes());
  let currentSeconds = handleTimeValue(currentDate.getSeconds());
  switch (format) {
    case 'HH:MM:SS':
      return `${currentHour}:${currentMinutes}:${currentSeconds}`;
    case 'HHMMSS':
      return `${currentHour}${currentMinutes}${currentSeconds}`;
    default:
      break;
  }
};

export const getCurrentDate = format => {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear().toString();
  let currentMonth = handleTimeValue(currentDate.getMonth() + 1);
  let currentDay = currentDate.getDate().toString();

  switch (format) {
    case 'DD.MM.YYYY':
      return `${currentDay}.${currentMonth}.${currentYear}`;
    default:
      break;
  }
};

export const convertYYYYMMtoMMYYYY = dateString => {
  const yearString = dateString.slice(0, 4);
  const monthString = dateString.slice(4, 6);
  return `${monthString}.${yearString}`;
};

export const getDateFormat = format => {
  const nowDate = new Date();
  var newDate = format;
  var yyyy = nowDate.getFullYear().toString();
  var MM = formatZero(nowDate.getMonth() + 1, 2);
  var dd = formatZero(nowDate.getDate(), 2);
  var hh = formatZero(nowDate.getHours(), 2);
  var mm = formatZero(nowDate.getMinutes(), 2);
  var ss = formatZero(nowDate.getSeconds(), 2);
  var SSS = formatZero(nowDate.getMilliseconds(), 3);

  newDate = newDate.replace('yyyy', yyyy);
  newDate = newDate.replace('MM', MM);
  newDate = newDate.replace('dd', dd);
  newDate = newDate.replace('hh', hh);
  newDate = newDate.replace('mm', mm);
  newDate = newDate.replace('ss', ss);
  newDate = newDate.replace('SSS', SSS);

  return newDate;
};

//Example: 20230518 => May 18, 2023
export const formatYYYYMMDDToDisplay = date => {
  if (!date) {
    return '';
  }
  date = String(date);
  const yearString = date.slice(0, 4);
  const monthString = date.slice(4, 6);
  const dateString = date.slice(6, 8);
  return `${monthNumberWithDisplays[monthString]} ${dateString}, ${yearString}`;
};

export const formatHHMMToDisplay = time => {
  let type = 'AM';
  let hour = Number(time.slice(0, 2));
  if (hour >= 12) {
    type = 'PM';
    if (hour > 12) {
      hour = hour - 12;
    }
  }
  const minute = time.slice(2, 4);
  return `${hour}:${minute} ${type}`;
};

export const appendZeroToTime = time => {
  if (Number(time) < 10) {
    return '0' + time;
  }
  return time;
};

function formatZero(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

export const formatSecondsDisplay = seconds => {
  const minutes = Math.floor(seconds / 60);
  const second = seconds % 60;
  const formattedSeconds = second < 10 ? `0${second}` : second;

  return `${minutes}:${formattedSeconds}`;
};
