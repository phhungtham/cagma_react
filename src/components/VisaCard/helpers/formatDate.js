const CardDateValidUntil = (date = '') => {
  if (date !== '') {
    let year = date.slice(2, 4);
    let month = date.slice(4, 6);
    return `${month}/${year}`;
  } else {
    return date;
  }
};

export {
  CardDateValidUntil
};