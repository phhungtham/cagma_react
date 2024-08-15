import { useRef } from 'react';
import no_image from '@assets/images/no-result.png';

const Image = props => {
  const { src, alt = 'shinhan_image', onClick } = props;
  const imageRef = useRef(null);
  const hanldeImageError = () => {
    if (imageRef) {
      imageRef.current.src = no_image;
    }
  };

  return <img ref={imageRef} src={src} alt={alt} onClick={onClick} onError={hanldeImageError} />;
};

export default Image;
