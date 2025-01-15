const deviceDetected = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
};

export const isIphone = () => {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
};

export const isIphoneIOS14OrOlder = () => {
  const isIOSDevice = isIphone();
  if (isIOSDevice) {
    const match = navigator.userAgent.match(/OS (\d+)_\d+/); //Get IOS version
    if (match) {
      const majorVersion = parseInt(match[1], 10);
      return majorVersion <= 14;
    }
  }
  return false;
};

export default deviceDetected;
