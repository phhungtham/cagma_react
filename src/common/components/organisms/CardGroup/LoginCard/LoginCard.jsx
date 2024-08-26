import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { ThinArrowIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const LoginCard = ({ isLogin, afterLoginImage, isJoinCard }) => {
  return (
    <section className="login__card__wrapper">
      <section className="login__card__contain">
        <section className="left__content">
          <section className="top__content">
            <div className="title">{isLogin ? 'Welcome to SOL' : 'Login to SOL'}</div>
            {isLogin ? (
              <div className="subtitle">You don't own any accounts</div>
            ) : (
              <>
                <div className="subtitle">Get started login</div>
                <div className="subtitle">and enjoy various service!</div>
              </>
            )}
          </section>
          <Button
            className={'login__card__button'}
            label={isLogin ? 'Browse products' : 'Login'}
          />
        </section>
        <section className="right__content">
          {/* <img alt='card' src={isLogin ? afterLoginImage : CardBankImage} /> */}
        </section>
      </section>
      {isJoinCard && (
        <section className="join__card">
          <span>Don't you have Shinhan Bank account?</span>
          <span className="arrow__icon">
            <ThinArrowIcon />
          </span>
        </section>
      )}
    </section>
  );
};

LoginCard.prototype = {
  isLogin: PropTypes.bool,
  afterLoginImage: PropTypes.string,
  isJoinCard: PropTypes.bool,
};

LoginCard.defaultProps = {
  isLogin: true,
  afterLoginImage: '',
  isJoinCard: true,
};

export default LoginCard;
