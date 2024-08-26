import React from 'react';

import { ShareIcon } from 'assets/icons';
import PropTypes from 'prop-types';

import Label from '../Label';
import Span from '../Span';

const ProductBanner = props => {
  const { clazz, type, label, heading, description, footerLeft, footerRight, children } = props;
  const footerJSX = () => {
    return type === 'detail' ? (
      <div className="banner__footer">
        <div className="left">
          <Span
            clazz="title"
            text={footerLeft.title}
          />
          <div className="footer__params">
            <Span
              clazz="params"
              text={footerLeft.params}
            />
            <Span
              clazz="unit"
              text={footerLeft.unit}
            />
          </div>
        </div>
        <span className="divider" />
        <div className="right">
          <Span
            clazz="title"
            text={footerRight.title}
          />
          <div className="footer__params">
            <Span
              clazz="params"
              text={`${footerRight.params}${footerRight.unit} `}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="list__bottom">
        <div className="left">
          <Span
            clazz="params"
            text={`${footerLeft.params} ${footerLeft.unit} `}
          />
        </div>
        <div className="right">
          <Label label={footerRight.title} />
          <Span
            clazz="params"
            text={`${footerRight.params}${footerRight.unit} `}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`product__banner ${type} ${clazz}`}>
      <div className={`product__banner__content ${type}`}>
        {type === 'compact' && (
          <Span
            clazz={`product__banner__label ${type}`}
            text={label}
          />
        )}
        <Span
          clazz={`product__banner__heading ${type}`}
          text={heading}
        />
        <Span
          clazz={`product__banner__desc ${type}`}
          text={description}
        />
      </div>
      {type === 'compact' && (
        <div className="product__banner__share">
          <ShareIcon />
        </div>
      )}
      <div className={`product__banner__img ${type}`}>{children}</div>
      {(type === 'detail' || type === 'list') && footerJSX()}
    </div>
  );
};

ProductBanner.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['compact', 'detail', 'list']),
  label: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  footerLeft: PropTypes.object,
  footerRight: PropTypes.object,
};

ProductBanner.defaultProps = {
  clazz: '',
  type: 'compact',
  label: '',
  heading: '',
  description: '',
  footerLeft: { title: '', params: '', unit: '' },
  footerRight: { title: '', params: '', unit: '' },
};
export default ProductBanner;
