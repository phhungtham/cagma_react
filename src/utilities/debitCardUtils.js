export const CARD_LIMIT_DEF = {
  DEBIT_GOLD: {
    // card code: 0008
    purchase_min: 10,
    purchase_max: 10000,
    withdrawal_min: 10,
    withdrawal_max: 10000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 10,000.00 USD',
  },
  DEBIT_CLASSIC: {
    // card code: 0006, 0007
    purchase_min: 10,
    purchase_max: 4000,
    withdrawal_min: 10,
    withdrawal_max: 4000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 4,000.00 USD',
  },
  DEBIT_VIRTUAL: {
    // card code: 0009
    purchase_min: 10,
    purchase_max: 4000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 4,000.00 USD',
  },
};

export const getCardType = cardNo => {
  switch (cardNo) {
    case '0002':
    case '0005':
    case '0008':
      return 'DEBIT_GOLD';
    case '0001':
    case '0004':
    case '0006':
    case '0007':
    case '0010':
    case '0011':
      return 'DEBIT_CLASSIC';
    case '0009':
      return 'DEBIT_VIRTUAL';
    default:
      return 'DEBIT_CLASSIC';
  }
};

export const addComma = amount => {
  if (!amount) return '';
  let returnString = removeComma(amount)
    ?.toString()
    .replace(/[^0-9\.]/g, '');
  returnString = returnString.replace(/(^0+)/g, '');
  returnString = returnString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return returnString;
};

export const removeComma = amount => {
  if (!amount) return '';
  return `${amount}`.split(',').join('');
};
// Sample: source = ., destination: ''
export const replaceString = (input, source, destination) => {
  if (!input) return '';
  return `${input}`.split(source).join(destination);
};

export const checkDecimal = value => {
  let regexp = /^\d*.?\d{0,2}$/;
  if (regexp.test(value)) {
    return false;
  } else {
    return true;
  }
};

const findIndexDot = number => {
  const result = String(number).search(/\./g);
  return result;
};

export const handleFormatValue = value => {
  if (findIndexDot(value) === -1) {
    return `${value}.00`;
  } else {
    const decimals = value.length - findIndexDot(value) - 1;
    if (decimals === 0) {
      return `${value}00`;
    }
    if (decimals === 1) {
      return `${value}0`;
    }
    return value;
  }
};
