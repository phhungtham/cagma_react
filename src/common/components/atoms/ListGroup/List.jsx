import React from 'react';

import { PropTypes } from 'prop-types';

import { Button } from '../ButtonGroup/Button/Button';
import CheckBox from '../Checkbox';
import Span from '../Span';
import Switch from '../Switch';

const List = props => {
  const {
    clazz,
    size,
    title,
    label,
    subTitle,
    captionSegments,
    thumbnail,
    titleIcon,
    icon,
    control,
    onChange,
    onListClick,
    onIconClick,
  } = props;

  const handleChangeItem = value => {
    if (onChange) onChange(value);
  };

  const captionOn = captionSegments?.type !== 'off';
  return (
    <div
      className={`${clazz} list__wrapper icon__${control.position}`}
      onClick={onListClick}
    >
      <div className={`list__left ${title && subTitle && captionSegments && 'custom'}`}>
        {thumbnail && <div className={`list__left__thumbnail ${size}`}>{thumbnail}</div>}
        <div className="list__left__text">
          {label && (
            <Span
              clazz="left__label"
              text={label}
            />
          )}
          <div className={`left__title  icon__${titleIcon?.position}`}>
            <Span
              clazz={`left__title ${size}`}
              text={title}
            />
            {titleIcon && <div className="title__icon">{titleIcon.name && <titleIcon.name />}</div>}
          </div>
          {subTitle && (
            <Span
              clazz="left__subtitle"
              text={subTitle}
            />
          )}
          {captionOn && (
            <div className="left__captions">
              {captionSegments?.caption1 && (
                <Span
                  clazz="left__caption1"
                  text={captionSegments?.caption1}
                />
              )}
              {captionSegments?.type === 2 && <div className="caption__bar" />}
              {captionSegments?.caption2 && (
                <Span
                  clazz="left__caption2"
                  text={captionSegments?.caption2}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="list__right">
        {icon && (
          <div
            className="right__icon"
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
        {control?.name === 'select' && control?.position === 'right' && (
          <CheckBox
            hideCheckBox={control?.hide}
            backgroundSelected="dark"
            onChange={handleChangeItem}
          />
        )}
        {control?.name === 'select' && control?.position === 'left' && <CheckBox onChange={handleChangeItem} />}
        {control?.name === 'switch' && (
          <Switch
            active={control?.active}
            onChange={handleChangeItem}
            disabled={control?.disabled}
          />
        )}
        {control?.name === 'button' && (
          <Button
            className="right__button"
            label={control?.label}
          />
        )}
      </div>
    </div>
  );
};

List.propTypes = {
  clazz: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'small']),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  icon: PropTypes.object,
  onListClick: PropTypes.func,
  titleIcon: PropTypes.object,
  captionSegments: PropTypes.shape({
    type: PropTypes.number,
    caption1: PropTypes.string,
    caption2: PropTypes.string,
  }),
  control: PropTypes.shape({
    name: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
    hide: PropTypes.bool,
  }),
};

List.defaultProps = {
  clazz: '',
  size: 'normal',
  title: '',
  subTitle: '',
  captionSegments: {},
  icon: null,
  control: {
    name: '',
    active: false,
    disabled: false,
    position: 'right',
    hide: false,
  },
};

export default List;
