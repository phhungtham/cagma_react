const imgSrcDetected = (baseUrl, path) => {
  if (!path || path === 'undefined' || !path.length) {
    return '';
  } else if (!baseUrl || baseUrl === 'undefined') {
    return `../../..${path}`;
  } else {
    return `${baseUrl}${path}`;
  }
};

export default imgSrcDetected;
