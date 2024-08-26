/**
 * Extract data from the given source data by given dataPath like elData.account, etc
 * @param {any} dataSrc the source data
 * @param {string} dataPath the path of data we want to extract
 * @param {*} fallBackValue default value once the extracting operation not success
 * @returns any
 */
export const extractData = (dataSrc, dataPath, fallBackValue) => {
  if (!dataPath) {
    return dataSrc || fallBackValue;
  }
  const paths = dataPath.split('.');
  const pathLength = paths.length;
  let node = dataSrc[paths[0]];
  let index = 1;
  while (index < pathLength) {
    if (!node) return fallBackValue;
    node = node[paths[index]];
    index++;
  }
  return node || fallBackValue;
};

export const ElHeader = {
  elHeader: {
    language: 'en',
  },
};

export const transformRequest = (payload, language = 'en') => {
  return {
    elData: { ...payload },
    elHeader: {},
  };
};

export const languageStorageKeys = currentLanguage => {
  if (!currentLanguage || currentLanguage === 'undefined') return;
  switch (currentLanguage) {
    case 'en':
      return 'CA_EN';
    case 'ko':
      return 'CA_KO';
    default:
      return 'CA_EN';
  }
};
