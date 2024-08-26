import React from 'react';

import { ArrowIcon } from 'assets/icons';
import PropTypes from 'prop-types';

import Span from '../Span';

const Banner = props => {
  const { clazz, heading, description, children } = props;
  return (
    <div className={`banner ${clazz}`}>
      <div className="banner__img">{children}</div>
      <div className="banner__content">
        <div className="banner__content__heading">
          <Span
            clazz="content__heading"
            text={heading}
          />
          <ArrowIcon direction="right" />
        </div>
        <Span
          clazz="banner__content__desc"
          text={description}
        />
      </div>
    </div>
  );
};

Banner.propTypes = {
  clazz: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
};

Banner.defaultProps = {
  clazz: '',
  label: '',
  description: '',
};

export default Banner;
