import { useRef, useState } from 'react';

import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { PropTypes } from 'prop-types';

import './styles.scss';

const LocationMap = ({ address, width, height, title }) => {
  const timeOutRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const formatAddress = () => {
    const addressEnCode = address
      .replace(/"/g, '%22')
      .replace(/#/g, '%23')
      .replace(/\$/g, '%24')
      .replace(/%/g, '%25')
      .replace(/&/g, '%26')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\+/g, '%2B')
      .replace(/,/g, '%2C')
      .replace(/\//g, '%2F')
      .replace(/:/g, '%3A')
      .replace(/;/g, '%3B')
      .replace(/</g, '%3C')
      .replace(/=/g, '%3D')
      .replace(/>/g, '%3E')
      .replace(/\?/g, '%3F')
      .replace(/@/g, '%40')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/\|/g, '%7C');

    let newAddress = '';
    for (const char of (addressEnCode || '')?.trim()) {
      if (newAddress.charAt(newAddress.length - 1) === '+' && char === ' ') {
        continue;
      }

      newAddress += char === ' ' ? '+' : char;
    }

    return newAddress;
  };

  const handleClick = () => {
    if (!iframeLoaded) return;
    const urlViewLargerMap = `https://www.google.com/maps/search/?api=1&query=${formatAddress(address)}`;
    console.log(urlViewLargerMap);
    openURLInBrowser(urlViewLargerMap);
  };

  const handleOnLoadIframe = () => {
    clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(() => setIframeLoaded(true), 200);
  };

  return (
    <div className="view__map">
      <iframe
        width={width}
        height={height}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC820r5kTO-4w5G2FYKR3J7SPgga5a2iY8
            &q=${formatAddress(address)}&zoom=18`}
        onLoad={handleOnLoadIframe}
      />
      {iframeLoaded && (
        <div className="view__larger__map">
          <p className="map__address__title">{address}</p>
          <p
            className="google__map__link"
            onClick={handleClick}
          >
            View Larger Map
          </p>
        </div>
      )}
    </div>
  );
};

LocationMap.propTypes = {
  address: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

LocationMap.defaultProps = {
  title: 'placement_map',
  width: '100%',
  height: '100%',
  address: '',
};

export default LocationMap;
