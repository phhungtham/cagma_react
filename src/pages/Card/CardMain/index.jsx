import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useMove from '@hooks/useMove';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import ActiveCardView from './components/ActiveCardView';
import EmptyCardView from './components/EmptyCardView';
import GuestCardView from './components/GuestCardView';
import './styles.scss';

const CardMain = ({ translate: t }) => {
  const { moveInitHomeNative } = useMove();
  const { isLoading: isLoadingCheckUserLogin, isLogin } = useLoginInfo();
  const [card, setCard] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);
  const { requestApi } = useApi();

  const requestGetCardInfo = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getCardList);
    setShowLoading(false);
    if (isSuccess) {
      const { card_cnt: cardCount } = data || {};
      if (cardCount > 0) {
        const {
          dbcd_k_display: typeOfCard,
          mask_cashcd_no: cardNumber,
          cashcd_acno_display: cardAccountNumber,
          cashcd_iss_dt_display: issueDate,
          cashcd_vldt_dt_display: expireDate,
          day_cashcd_use_lmt_amt_display: dailyWithdrawalLimit,
          day_pos_use_lmt_amt_display: dailyPOSLimit,
          acdnt_cnt: accidentType,
        } = data;
        setCard({
          type: Number(accidentType),
          typeOfCard,
          cardNumber,
          cardAccountNumber,
          issueDate,
          expireDate,
          dailyWithdrawalLimit: `$${dailyWithdrawalLimit}`,
          dailyPOSLimit: `$${dailyPOSLimit}`,
        });
      }
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  useEffect(() => {
    if (isLogin) {
      requestGetCardInfo();
    }
  }, [isLogin]);

  return (
    <>
      <div className="card-main__wrapper page__wrapper">
        {(showLoading || isLoadingCheckUserLogin) && <Spinner />}
        <Header title={t(menuLabels.cardMain)} />
        <div className="card-main__content">
          {!showLoading && !isLoadingCheckUserLogin && (
            <>
              {isLogin ? (
                <>
                  {card ? (
                    <ActiveCardView
                      card={card}
                      translate={t}
                    />
                  ) : (
                    <EmptyCardView
                      translate={t}
                      setShowLoading={setShowLoading}
                      setAlert={setAlert}
                    />
                  )}
                </>
              ) : (
                <GuestCardView translate={t} />
              )}
            </>
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(CardMain);
