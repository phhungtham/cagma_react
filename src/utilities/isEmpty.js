const isEmpty = obj => {
  if (!obj) {
    return true;
  }
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
};

export default isEmpty;
