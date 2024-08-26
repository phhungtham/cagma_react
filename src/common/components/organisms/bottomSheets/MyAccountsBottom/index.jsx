import BottomSheet from '@common/components/templates/BottomSheet';
import { PropTypes } from 'prop-types';

import './styles.scss';

const accounts = [
  {
    name: 'Main Account',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 2',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 3',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 4',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 5',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 6',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 7',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 8',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
  {
    name: 'Main Account 9',
    number: '123-456-000111',
    balance: '300000',
    ccy_code: '$',
  },
];

const MyAccountsBottom = ({ open, onClose, onSelect }) => {
  const onSelectAccount = item => {
    onSelect(item);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="My accounts"
      clazz="my-accounts-bottom__wrapper"
      type="max-scroll"
    >
      <div className="my-accounts__content">
        <div className="my-accounts__list">
          {accounts.map(account => (
            <div
              className="my-accounts__item"
              key={account.name}
              onClick={() => onSelectAccount(account)}
            >
              <div className="my-accounts__item__main">
                <div className="my-accounts__name">{account.name}</div>
                <div className="my-accounts__number">{account.number}</div>
                <div className="my-accounts__balance">
                  <span className="mr-2">Available Balance</span>
                  <span>{account.ccy_code}</span>
                  <span>{account.balance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
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
