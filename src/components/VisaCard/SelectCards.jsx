import consumer_gold from '@assets/images/cards/visa_consumer_gold_debit_card.png';
import consumer_classis_pink from '@assets/images/cards/visa_consumer_classic_debit_card_pink.png';
import consumer_classis_navy from '@assets/images/cards/visa_consumer_classic_debit_card_navy.png';
import visa_virtual from '@assets/images/cards/visa_virtual_card.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import CardBanner from '@common/ui/components/atomic/BannerGroup/CardBanner';
import Spinner from '@common/ui/components/atomic/Spinner';
import Header from '@common/ui/components/Header';
import { MENU_CODE } from '@configs/global/constants';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { isEmpty, moveBack, moveNext, parserDataToHtml, scrollImpact } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { chooseNewCardTemplate, setCardAmount, verificationCardData } from './redux/action';
import { debitCardReducer } from './redux/reducer';
import { debitCardSaga } from './redux/saga';
import { cardsSelector } from './redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from './redux/type';

const SelectCards = ({ translate }) => {
  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureDebitCardName, saga: debitCardSaga }]);
  const [isLoading, setIsLoading] = useState(false);
  const isNativeBack = useSelector(backEventSelector || false);

  const transData = {
    lbl05: translate('lbl_BCD8000000_0005'),
    lbl78: translate('lbl_BCD8000000_0078'),
    lbl79: translate('lbl_BCD8000000_0079'),
    lbl80: translate('lbl_BCD8000000_0080'),
    lbl81: translate('lbl_BCD8000000_0081').split(' '),
    lbl82: translate('lbl_BCD8000000_0082').split(' '),
    lbl83: translate('lbl_BCD8000000_0083').split(' '),
    lbl84: translate('lbl_BCD8000000_0084').split(' '),
    lbl85: translate('lbl_BCD8000000_0085'),
    lbl86: translate('lbl_BCD8000000_0086'),
    lbl87: translate('lbl_BCD8000000_0087').split(' '),
    lbl88: translate('lbl_BCD8000000_0088').replace('%1', '2'),
    lbl89: translate('lbl_BCD8000000_0089')
  };

  const commonCardData = {
    description: transData.lbl79,
    limitTitle: transData.lbl80,
    feeTitle: transData.lbl78,
    amountLimit: { value: transData.lbl81[0], unit: transData.lbl81.slice(1).join(' ') },
    annualFee: { value: transData.lbl82[0], unit: transData.lbl82.slice(1).join(' ') },
    isVirtual: false
  };
  const selectCardData = [
    {
      ...commonCardData,
      cardType: 1,
      cardName: translate('mymen_desc_KHCD800000'),
      cardImage: consumer_gold,
      cardImageSub: '',
      limitAmount: 1,
      join_etpr_no: '0008'
    },
    {
      ...commonCardData,
      cardType: 2,
      cardName: `${translate('mymen_desc_KHCD800001')} ${translate('mymen_desc_KHCD800003')}`,
      description: transData.lbl79,
      cardImage: consumer_classis_navy,
      cardImageSub: consumer_classis_pink,
      limitTitle: transData.lbl80,
      amountLimit: { value: transData.lbl83[0], unit: transData.lbl83.slice(1).join(' ') },
      annualFee: { value: transData.lbl84[0], unit: transData.lbl84.slice(1).join(' ') },
      limitAmount: 1,
      join_etpr_no: '0006',
      join_etpr_no2: '0007',
      textPromotion: translate('lbl_BCD8000000_0085')
    },
    {
      ...commonCardData,
      cardType: 3,
      cardName: translate('mymen_desc_KHCD800002'),
      description: transData.lbl86,
      cardImageSub: '',
      cardImage: visa_virtual,
      limitTitle: transData.lbl05,
      amountLimit: { value: transData.lbl83[0], unit: transData.lbl83.slice(1).join(' ') },
      annualFee: { value: transData.lbl87[0], unit: transData.lbl87.slice(1).join(' ') },
      limitAmount: 5,
      join_etpr_no: '0009',
      isVirtual: true
    }
  ];

  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [showAlert, setShowAlert] = useState({
    state: false,
    showTitle: false,
    message: '',
    alertType: ''
  });
  const selectCardRef = useRef(null);
  const cardListAmount = useRef(null);
  const navigate = useNavigate();
  const { cards } = useSelector(cardsSelector);

  const handleSelectCard = async params => {
    let checkAmountValid =
      params.limitAmount > cardListAmount.current[params.join_etpr_no] || !cardListAmount.current[params.join_etpr_no];
    if (params?.join_etpr_no2) {
      const pinkAmount = cardListAmount.current[params?.join_etpr_no2] || 0;
      if (params?.limitAmount > pinkAmount) {
        checkAmountValid = true;
      }
    }

    const verifyStep1 = isEmpty(cardListAmount.current) ? true : checkAmountValid;
    if (verifyStep1) {
      const verifyStep2 = await verificationNewCardStep2();
      if (verifyStep2) {
        const verifyStep3 = await verificationNewCardStep3();
        if (verifyStep3) {
          chooseNewCardTemplate(params);
          moveNext(MENU_CODE.CARDS_ADD_NEW, '', 'cards/add-new-card');
        }
      }
    } else {
      setShowAlert({
        showTitle: true,
        state: true,
        message: translate('lbl_BCD8000000_0054').replace('%1', params.limitAmount)
      });
    }
  };

  const verificationNewCardStep2 = async () => {
    setIsLoading(true);
    const accountData = await apiCall(debitCardsURLs.GET_ACCOUNT, 'POST', {});
    const result = accountData?.data?.elData;
    if (result) {
      setIsLoading(false);
      if (result?.cus_ac_count === 0) {
        // if user no account => show alert...
        setShowAlert({
          showTitle: true,
          state: true,
          message: translate('lbl_BCD8000000_0096')
        });
        return false;
      } else {
        // if user has account with dep_sjt_class === '1' => pass step , else show alert
        const listAccount = result?.cus_acno_list;
        const checkingList = listAccount.filter(item => {
          return item.dep_sjt_class === '1';
        });
        if (checkingList.length > 0) {
          return true;
        } else {
          setShowAlert({
            showTitle: true,
            state: true,
            message: translate('slbl_stringT001_035')
          });
          return false;
        }
      }
    } else {
      // API failed....
      setIsLoading(false);
      setShowAlert({
        state: true,
        message: accountData?.data?.elHeader?.resMsgVo?.msgText,
        alertType: accountData?.data?.elHeader?.resMsgVo?.msgType
      });
    }
  };

  const verificationNewCardStep3 = async () => {
    setIsLoading(true);
    const requestData = {
      trx_func_d: '7'
    };
    const cardVerify = await apiCall(debitCardsURLs.CARD_ISSUANCE, 'POST', requestData);
    if (cardVerify?.data?.elData) {
      setIsLoading(false);
      verificationCardData(cardVerify.data.elData);

      const resultCode = cardVerify.data.elData.rst_yn;
      if (resultCode === 0) {
        return true;
      } else if (resultCode === 2) {
        const textTrans = parserDataToHtml(translate('lbl_BCD8000000_0094'));
        const textAlert = parserDataToHtml(textTrans.toString().replace('\\n', '<br/>'));
        setShowAlert({
          showTitle: true,
          state: true,
          message: textAlert
        });
        return false;
      } else {
        setShowAlert({
          showTitle: true,
          state: true,
          message: translate('lbl_BCD8000000_0095')
        });
        return false;
      }
    } else {
      // API failed
      setIsLoading(false);
      setShowAlert({
        state: true,
        message: cardVerify?.data?.elHeader?.resMsgVo?.msgText,
        alertType: cardVerify?.data?.elHeader?.resMsgVo?.msgType
      });
    }
  };

  useEffect(() => {
    if (cards) {
      if (isEmpty(cards)) return;
      const cardsKeys = Object.keys(cards);
      if (cardsKeys.length === 0) return;
      let cardCount = {};
      if (cards?.list) {
        cards.list.forEach((card, index) => {
          if (!cardCount?.[card.join_etpr_no]) {
            cardCount[card.join_etpr_no] = 1;
          } else {
            cardCount[card.join_etpr_no] = cardCount[card.join_etpr_no] + 1;
          }
        });
      }
      cardListAmount.current = { ...cardCount };
      setCardAmount({ ...cardCount });
    }
  }, [cards]);

  useEffect(() => {
    if (isNativeBack) {
      moveBack();
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);

  return (
    <div
      className="select_card_container"
      ref={selectCardRef}
      onScroll={() => scrollImpact(selectCardRef.current, setIsHeaderExpand)}
    >
      {isLoading && <Spinner />}
      <Header title={translate('men_KHCD800009')} isExpand={isHeaderExpand} />
      <section className="select_card_content">
        {selectCardData.map((item, index) => (
          <div className="select_card_item" key={index} onClick={() => handleSelectCard(item)}>
            <CardBanner
              cardType={item?.cardType}
              bannerType="horizontal"
              cardName={item?.cardName}
              description={item?.description}
              cardImage={item?.cardImage}
              cardImageSub={item?.cardImageSub}
              amountLimit={{ value: item?.amountLimit.value, unit: item?.amountLimit.unit }}
              annualFee={item?.annualFee}
              feeTitle={item?.feeTitle}
              limitTitle={item?.limitTitle}
              textPromotion={item?.textPromotion ? item?.textPromotion : ''}
            />
          </div>
        ))}
      </section>
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.state}
        title={showAlert.showTitle && translate('lbl_BCD8000000_0053')}
        subtitle={showAlert.message || ''}
        alertType={showAlert.alertType || ''}
        firstButton={{
          onClick: () =>
            setShowAlert({
              state: false,
              message: ''
            }),
          label: translate('lbl_cta_3006')
        }}
      />
    </div>
  );
};

export default withHTMLParseI18n(SelectCards);
