import BottomSheet from '@common/components/templates/BottomSheet';
import { PropTypes } from 'prop-types';

import './styles.scss';

const MyAccountsBottom = ({ accounts = [], open, onClose, onSelect, type }) => {
  const onSelectAccount = item => {
    onSelect(item);
  };

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        title="My accounts"
        clazz="my-accounts-bottom__wrapper"
        type="max-scroll"
      >
        <div className="my-accounts__content">
          <div className="my-accounts__list">
            {(accounts || []).map(account => (
              <div
                className="my-accounts__item"
                key={account.name}
                onClick={() => onSelectAccount(account)}
              >
                <div className="my-accounts__item__main">
                  <div className="my-accounts__name">{account.name}</div>
                  <div className="my-accounts__number">{account.number}</div>
                  <div className="my-accounts__balance">Available Balance ${account.balance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

MyAccountsBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

MyAccountsBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
};

export default MyAccountsBottom;
