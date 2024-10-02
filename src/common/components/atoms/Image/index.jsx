import { useRef } from 'react';

const Image = props => {
  const { src, alt = '', onClick } = props;
  const imageRef = useRef(null);

  const handleLoadImageFailed = () => {
    if (imageRef) {
      imageRef.current.src = '';
    }
  };

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      onClick={onClick}
      onError={handleLoadImageFailed}
    />
  );
};

export default Image;
