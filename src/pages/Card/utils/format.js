//Ex: 0224 -> 20240229
export const formatCardDateRequest = value => {
  const formattedDate = value.replace(/\D/g, '');
  const month = formattedDate.substring(0, 2);
  const year = '20' + formattedDate.substring(2, 4);
  const lastDay = new Date(year, month, 0).getDate();
  const result = `${year}${month}${lastDay}`;
  return result;
};
