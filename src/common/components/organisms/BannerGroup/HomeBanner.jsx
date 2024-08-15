import React from 'react';
import PropTypes from 'prop-types';
import blur_area from '@assets/images/blur_area.png';
import Image from '@common/components/atoms/Image';
import Span from '@common/components/atoms/Span';

const HomeBanner = props => {
  const { clazz, size, heading, description, thumbnail } = props;
  return (
    <div className={`home__banner ${size} ${clazz}`}>
      <div className={`home__banner__img ${size}`}>
        <Image src={thumbnail} alt="home_banner" />
      </div>
      {size !== 'large' && (
        <div className={`home__banner__blur ${size}`}>
          <img src={blur_area} alt="" />
        </div>
      )}
      <div className={`home__banner__content ${size}`}>
        <div className={`home__banner__heading ${size}`}>
          <Span clazz={`home__banner__heading__main ${size}`} text={heading} />
        </div>
        <Span clazz={`home__banner__desc ${size}`} text={description} />
      </div>
    </div>
  );
};

HomeBanner.propTypes = {
  clazz: PropTypes.string,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  description: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny'])
};

HomeBanner.defaultProps = {
  clazz: '',
  heading: '',
  description: '',
  subHeading: '',
  size: 'large'
};
export default HomeBanner;
