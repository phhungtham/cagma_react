import useDetectBrowser from './useDetectBrowser';

const useDetectSafariVersion = () => {
  const detectBrowser = useDetectBrowser();
  if (detectBrowser === 'safari') {
    let userAgent = navigator?.userAgent;
    const browserVersion = userAgent?.split('Version/')[1].split(' ')[0] || '14';
    return browserVersion;
  }
};

export default useDetectSafariVersion;
