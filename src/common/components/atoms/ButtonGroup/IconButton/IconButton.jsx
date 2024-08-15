import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from 'assets/icons';
import { ICON_SIZES } from '@configs/global/constants';
export const IconButton = ({
  className,
  label,
  size,
  disable,
  onClick,
  background,
  backgroundBorder,
  children,
  icon,
  isPrimary,
  image,
  ...otherProps
}) => {
  const customClass = [`btn__icon__common ${disable ? 'disable' : ''}`, className].join(' ');
  const labelMarginTop = ICON_SIZES[size] === '40' ? 8 : 6;

  return (
    <div className={`btn__icon__contain ${label ? 'icon-text' : ''} ${disable ? 'disable' : ''}`}>
      <div className={`btn__icon__wrapper ${background ? 'background' : ''} ${backgroundBorder ? 'border' : ''}`}>
        <div
          className={customClass}
          style={{
            width: `${ICON_SIZES[size]}px`,
            height: `${ICON_SIZES[size]}px`
          }}
          onClick={onClick}
          {...otherProps}
        >
          <div className="icon__container">
            {image ? <img src={image} alt="icon-button" /> : icon}
            {isPrimary && (
              <div className="star__icon">
                <StarIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      {label && <div style={{ marginTop: `${labelMarginTop}px` }}>{label}</div>}
    </div>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  disable: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  image: PropTypes.string,
  isPrimary: PropTypes.bool,
  size: PropTypes.oneOf(['w-12', 'w-16', 'w-20', 'w-24', 'w-32', 'w-36', 'w-40', 'w-44', 'w-48']),
  backgroundBorder: PropTypes.bool,
  background: PropTypes.bool
};

IconButton.defaultProps = {
  className: '',
  disable: false,
  label: null,
  onClick: undefined,
  icon: null,
  image: null,
  size: 'w-40',
  isPrimary: false,
  backgroundBorder: false,
  background: false
};
