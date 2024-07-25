import no_image from '../assets/images/no-result.png';
const imgSrcDetected = (baseUrl, path) => {
  if (!path || path === 'undefined' || !path.length) {
    return no_image;
  } else if (!baseUrl || baseUrl === 'undefined') {
    return `../../..${path}`;
  } else {
    return `${baseUrl}${path}`;
  }
};
  
export default imgSrcDetected;
  