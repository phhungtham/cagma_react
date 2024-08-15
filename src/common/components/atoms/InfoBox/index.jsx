import React from 'react';
import { PropTypes } from 'prop-types';
import { InfoIcon, WarningIcon } from 'assets/icons';
import Span from '../Span';

const InfoBox = ({ variant, textOnly, label, action }) => {
  const handleRenderIcon = () => {
    if (variant !== 'informative') {
      return <WarningIcon />;
    } else {
      return <InfoIcon />;
    }
  };

  return (
    <div className={`info__wrapper ${variant}`}>
      {!textOnly && <section className="info__icon">{handleRenderIcon()}</section>}
      <section className="info__label">
        {label}
        {action && <Span clazz="info__action" text={action?.name} onClick={action?.click} />}
      </section>
    </div>
  );
};
export default InfoBox;

InfoBox.propTypes = {
  variant: PropTypes.oneOf(['informative', 'notice', 'negative', 'negative-dark']),
  textOnly: PropTypes.bool,
  label: PropTypes.string
};

InfoBox.defaultProps = {
  variant: 'informative',
  textOnly: false,
  label: 'Enter the Informative message here.'
};
