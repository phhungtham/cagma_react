import { PropTypes } from 'prop-types';

const LocationMap = ({ address, width, height, title }) => {
  const formatAddress = () => {
    let newAddress = '';
    for (const char of (address || '')?.trim()) {
      if (newAddress.charAt(newAddress.length - 1) === '+' && char === ' ') {
        continue;
      }

      newAddress += char === ' ' ? '+' : char;
    }

    return newAddress;
  };

  return (
    <iframe
      width={width}
      height={height}
      title={title}
      loading="lazy"
      sandbox="allow-scripts allow-popups allow-same-origin"
      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC820r5kTO-4w5G2FYKR3J7SPgga5a2iY8
          &q=${formatAddress(address)}&zoom=18`}
    />
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
