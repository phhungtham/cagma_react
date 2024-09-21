import { useState } from 'react';
import { useSelector } from 'react-redux';

import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import { loginSelector } from 'app/redux/selector';

import ActiveCardView from './components/ActiveCardView';
import EmptyCardView from './components/EmptyCardView';
import GuestCardView from './components/GuestCardView';
import './styles.scss';

const CardMain = () => {
  const isLogin = useSelector(loginSelector);
  const [card, setCard] = useState();
  return (
    <>
      <div className="card-main__wrapper page__wrapper">
        <Header
          title="Cards"
          onClick={moveBack}
        />
        <div className="card-main__content">
          {!isLogin ? <>{card ? <ActiveCardView /> : <EmptyCardView />}</> : <GuestCardView />}
        </div>
      </div>
    </>
  );
};

export default CardMain;
