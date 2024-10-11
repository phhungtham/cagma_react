import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { moveBack } from '@utilities/index';
import { loginSelector } from 'app/redux/selector';

import ActiveCardView from './components/ActiveCardView';
import EmptyCardView from './components/EmptyCardView';
import GuestCardView from './components/GuestCardView';
import './styles.scss';

const CardMain = () => {
  const isLogin = useSelector(loginSelector) || true;
  const [card, setCard] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const requestGetCardInfo = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCardList);
    setShowLoading(false);
    if (isSuccess) {
      const { acdnt_cnt: accidentType, r_GIBD2100_1Vo: cardList } = data || {};
      if (cardList?.length) {
        const {
          dbcd_k_display: typeOfCard,
          mask_cashcd_no: cardNumber,
          cashcd_acno_display: cardAccountNumber,
          cashcd_iss_dt_display: issueDate,
          cashcd_vldt_dt_display: expireDate,
        } = cardList[0];
        setCard({
          type: Number(accidentType),
          typeOfCard,
          cardNumber,
          cardAccountNumber,
          issueDate,
          expireDate,
        });
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  useEffect(() => {
    if (isLogin) {
      requestGetCardInfo();
    }
  }, [isLogin]);

  return (
    <>
      <div className="card-main__wrapper page__wrapper">
        {showLoading && <Spinner />}
        <Header
          title="Cards"
          onClick={moveBack}
        />
        <div className="card-main__content">
          {!showLoading && (
            <>{isLogin ? <>{card ? <ActiveCardView card={card} /> : <EmptyCardView />}</> : <GuestCardView />}</>
          )}
        </div>
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default CardMain;
