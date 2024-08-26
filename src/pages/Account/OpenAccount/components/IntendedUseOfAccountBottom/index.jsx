import BottomSheet from '@common/components/templates/BottomSheet';
import { PropTypes } from 'prop-types';

import { intendedUseOfAccounts } from '../../constants';
import './styles.scss';

const IntendedUseOfAccountBottom = ({ open, onClose, onSelect }) => {
  const onSelectIntended = item => {
    onSelect(item);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Intended use of account"
      clazz="intended-use-account-bottom__wrapper"
      type="max-scroll"
    >
      <div className="intended-use-account__content">
        <div className="intended-use-account__list">
          {intendedUseOfAccounts.map(item => (
            <div
              className="intended__item"
              key={item.value}
              onClick={() => onSelectIntended(item)}
            >
              <div className="intended__item__main">
                <div className="intended__label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};

IntendedUseOfAccountBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

IntendedUseOfAccountBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
};

export default IntendedUseOfAccountBottom;
