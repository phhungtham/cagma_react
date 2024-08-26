import React from 'react';

import PropTypes from 'prop-types';

import Span from '../Span';

const TransferList = props => {
  const { clazz, border, thumbnail, text } = props;
  return (
    <div className={`${clazz} transfer__wrapper ${border && 'border__on'}`}>
      <div className="transfer">
        {thumbnail && (
          <div className="transfer__thumbnail">
            <img
              src={thumbnail}
              alt=""
            />
          </div>
        )}
        <div className="transfer__content">
          <Span
            clazz="transfer__content__text"
            text={text}
          />
        </div>
      </div>
    </div>
  );
};

TransferList.propTypes = {
  clazz: PropTypes.string,
  text: PropTypes.string,
  thumbnail: PropTypes.string,
  border: PropTypes.bool,
};
TransferList.defaultProps = {
  clazz: '',
  text: '',
  thumbnail: null,
  border: false,
};

export default TransferList;
