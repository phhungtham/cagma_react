import { InfoIcon, WarningIcon } from 'assets/icons';
import { PropTypes } from 'prop-types';

import Span from '../Span';

const InfoBox = ({ variant, textOnly, label, action, direction = 'top' }) => {
  const handleRenderIcon = () => {
    if (variant !== 'informative') {
      return <WarningIcon />;
    } else {
      return <InfoIcon />;
    }
  };

  return (
    <div className={`info__wrapper ${variant} ${direction}`}>
      {!textOnly && <section className="info__icon">{handleRenderIcon()}</section>}
      <section className="info__label">
        {label}
        {action && (
          <Span
            clazz="info__action"
            text={action?.name}
            onClick={action?.click}
          />
        )}
      </section>
    </div>
  );
};
export default InfoBox;

InfoBox.propTypes = {
  variant: PropTypes.oneOf(['informative', 'notice', 'negative', 'negative-dark']),
  textOnly: PropTypes.bool,
  label: PropTypes.string,
  direction: PropTypes.oneOf(['top', 'middle']),
};

InfoBox.defaultProps = {
  variant: 'informative',
  textOnly: false,
  label: 'Enter the Informative message here.',
  direction: 'top',
};
