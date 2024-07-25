import cardBlocked from '@assets/images/cardBlocked.png';
import cardClassic from '@assets/images/cards/visa_consumer_classic_debit_card_navy.png';
import cardPinkClassic from '@assets/images/cards/visa_consumer_classic_debit_card_pink.png';
import goldenDebitCard from '@assets/images/cards/visa_consumer_gold_debit_card.png';
import cardClassicVirtual from '@assets/images/cards/visa_virtual_card.png';
import noCardContent from '@assets/images/no-card-content.png';
import requiredActivate from '@assets/images/requiredActivate.png';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import Span from '@common/ui/components/atomic/Span';
import { MENU_CODE } from '@configs/global/constants';
import { apiCall } from '@shared/api';
import { decryptCVC, hideCertificationNumber, moveNext, showCertificationNumber } from '@utilities/index';
import { FlipIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardDateValidUntil } from '../helpers/formatDate';
import { cardSelectedSelector } from '../redux/selector';
import { debitCardsURLs } from '../redux/type';

const CardItem = props => {
  const { card, noCard = false, translate, errMsg, setErrMsg } = props;
  const [isFlip, setIsFlip] = useState(false);
  const [cvcText, setCvcText] = useState(null);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const [isRequiredActivate, setIsRequiredActivate] = useState(false);

  useEffect(() => {
    if (card?.card_no !== cardSelected?.card_no) {
      setIsFlip(false);
      setCvcText(null);
    }
    if (
      card?.card_dlv_dt === null ||
      card?.card_dlv_dt.length === 0 ||
      card?.card_block_real_yn === 1 ||
      card?.card_block_virtual_yn === 1
    ) {
      setIsRequiredActivate(true);
    }
  }, [card, cardSelected?.card_no]);

  const getImage = card => {
    if (noCard) return '';
    if (card) {
      if (card?.card_virtual_yn === 1) return cardClassicVirtual;
      switch (card?.join_etpr_no) {
        case '001':
        case '0001':
        case '0004':
        case '0006':
        case '0009':
        case '0010':
        case '0011':
          return cardClassic;
        case '0007':
          return cardPinkClassic;
        case '0002':
        case '0005':
        case '0008':
          return goldenDebitCard;
        default:
          return '';
      }
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${getImage(card)})`,
    // backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -1
  };

  const handleFlipAction = e => {
    setIsFlip(!isFlip);
  };

  const handlePinCheckAction = async ecrPin => {
    const cardPinCheck = {
      trx_func_d: 1,
      card_no: card.card_no,
      chgbef_ecr_pin: ecrPin,
      filler0020: card.filler0020
    };
    const pinCheck = await apiCall(debitCardsURLs.MANAGE_CARD_PIN, 'POST', cardPinCheck);
    const pinCheckResult = pinCheck?.data?.elHeader;
    if (pinCheckResult?.resSuc) {
      await decryptCVC(card.card_enc_cvc, decryptCVCCallback);
      hideCertificationNumber();
      setErrMsg({ ...errMsg, isError: false, errMsg: null, errTitle: null});
    } else {
      if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0003') {
        // Incorrect password
        handleShowKeyPad('report', pinCheck?.data.elHeader?.resMsg || 'Passwords does not match');
        setErrMsg({ ...errMsg, isError: false, errMsg: null , errTitle: ''});
      } else if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0004') {
        // Incorrect password 5 times -> card locked
        setErrMsg({ ...errMsg, isError: true, errMsg: pinCheckResult?.resMsgVo, errTitle: translate('lbl_com_3175') });
        hideCertificationNumber();
      }
      setCvcText(null);
    }
  };

  const decryptCVCCallback = result => {
    setCvcText(result);
  };

  const handleShowKeyPad = (type, errMsg = '') => {
    showCertificationNumber(
      {
        title: translate('lbl_com_3174'),
        description: translate('lbl_com_3133').replace('%1', '6'),
        maxLength: 6,
        errMsg: errMsg
      },
      handlePinCheckAction
    );
  };

  const handleAddNewCard = () => {
    moveNext(MENU_CODE.CARDS_NEW_CARD_LIST, '', '/cards/new-card-list');
  };

  const handleFilterCardNumber = () => {
    if (!card) return;
    const { card_no_display, filler0020 } = card;
    if (card?.card_virtual_yn === 1) {
      return card_no_display.replace('****-****', filler0020.substring(0, 4) + '-' + filler0020.substring(4, 8));
    } else {
      return card_no_display;
    }
  };

  return (
    <div className={`card-item ${noCard && 'no_card'} ${isFlip ? 'flip-transform' : 'flip-transform-front'}`}>
      {noCard ? (
        <div className="flip-card-front" style={backgroundStyle}>
          <div className="no-card-content-top">{translate('lbl_BCD8000000_0015')}</div>
          <img alt="noCardContent" className="no-card-image" src={noCardContent}></img>
          <Button className={'add-new-card'} label={translate('lbl_BCD8000000_0016')} onClick={handleAddNewCard} />
        </div>
      ) : (
        <>
          {isRequiredActivate && (
            <div className="requiredActivate">
              <img
                alt="cardRequiredActivate"
                className="image-activate"
                src={card.card_virtual_yn === 1 ? cardBlocked : requiredActivate}
              ></img>
              <div>
                <Span
                  clazz={'required-activate-cardnm'}
                  text={`${card.card_nm}
                    (${card.card_no.slice(card.card_no.length - 4, card.card_no.length)}) `}
                />
                <Span
                  clazz={'required-activate-action'}
                  text={`
                  ${
            card.card_block_real_yn === 1 || card.card_block_virtual_yn === 1
              ? translate('lbl_BCD8000000_0013')
              : translate('lbl_BCD8000000_0014')
            }`}
                />
              </div>
            </div>
          )}
          <div className={`flip-card-front ${isRequiredActivate ? 'isRequiredActivate' : ''}`} style={backgroundStyle}>
            {isRequiredActivate && <div className="blurBackground"></div>}
            <div className="opacityBackground"></div>
            {!isRequiredActivate && (
              <div className={`front-info ${card.card_virtual_yn !== 1 && 'short__height'}`}>
                <p className="card-type">{card.card_nm}</p>
                <p className="card-number">{handleFilterCardNumber()}</p>
                <div className="card-valid">
                  {card.card_virtual_yn === 1 && (
                    <div className="left-valid">
                      <label>{translate('lbl_BCD8000000_0010')}</label>
                      <p>{CardDateValidUntil(card.card_valid)}</p>
                    </div>
                  )}
                  <div className={`right-valid ${card.card_virtual_yn === 0 ? '' : 'words-long-break'}`}>
                    <label>{translate('lbl_BCD8000000_0001')}</label>
                    <p>{card.card_holder_nm}</p>
                  </div>
                </div>
                <div className="card-valid">
                  {card.card_virtual_yn === 1 && (
                    <div className="left-valid">
                      <label>{translate('lbl_BCD8000000_0011')}</label>
                      <p className={`cvc-code ${cvcText !== null ? 'noUnderline' : ''}`} onClick={handleShowKeyPad}>
                        {cvcText !== null ? cvcText : translate('lbl_BCD8000000_0012')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flip-card-back">
            <div className="back-info">
              <div className="content">
                <div className="saving-account">
                  <p>{translate('lbl_BCD8000000_0003')}</p>
                  <p>{card.card_acno_display}</p>
                </div>
                <div className="available-info">
                  <label>{translate('lbl_BCD8000000_0004')}</label>
                  <p>{`${card.card_balance_display} ${card.ccy_c}`}</p>
                </div>
                <div className="divider"></div>
                <div className="limit-purchase">
                  <label>{translate('lbl_BCD8000000_0005')}</label>
                  <p>{`${card.card_ont_lmt_amt_display} ${card.ccy_c}/ ${translate('lbl_BCD8000000_0006')}`} </p>
                  <p>{`${card.card_day_lmt_amt_display} ${card.ccy_c}/ ${translate('lbl_BCD8000000_0007')}`} </p>
                </div>
                {cardSelected.card_virtual_yn !== 1 && (
                  <div className="limit-withdraw">
                    <label>{translate('lbl_BCD8000000_0008')}</label>
                    <p>
                      {`${card.card_ont_ac_wdw_lmt_amt_display} ${card.ccy_c}/ ${translate('lbl_BCD8000000_0006')}`}{' '}
                    </p>
                    <p>
                      {`${card.card_day_ac_wdw_lmt_amt_display} ${card.ccy_c}/ ${translate('lbl_BCD8000000_0007')}`}{' '}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isRequiredActivate && (
            <button className={`flip-button ${isFlip ? 'afterFlipped' : ''}`} onClick={handleFlipAction}>
              <FlipIcon />
              <span>{isFlip ? translate('lbl_BCD8000000_0009') : translate('lbl_BCD8000000_0002')}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default withHTMLParseI18n(memo(CardItem));
