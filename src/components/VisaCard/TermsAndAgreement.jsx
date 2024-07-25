import CardBanner from '@common/ui/components/atomic/BannerGroup/CardBanner';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import CheckBox from '@common/ui/components/atomic/Checkbox';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import Header from '@common/ui/components/Header';
import useReducers from '@hooks/useReducers';
import { MENU_CODE } from '@configs/global/constants';
import { moveBack, scrollImpact, moveNext } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { appLanguage, backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debitCardReducer } from './redux/reducer';
import { cardSelectedSelector, newCardTemplateSelector } from './redux/selector';
import { FeatureDebitCardName } from './redux/type';
import { ViewPDFIcon } from '@assets/icons';
import { animationSlideScreen } from '@utilities/animationSlideScreen';

// change label...
const TermsAndAgreement = props => {
  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  const isNativeBack = useSelector(backEventSelector || false);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const { clazz = '', cardType, translate } = props;
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const termsRef = useRef(null);
  const navigate = useNavigate();
  const { newCardTemplate } = useSelector(newCardTemplateSelector);
  const currentLanguage = useSelector(appLanguage);
  const plasticURL = `/pdf/plasticCardTerms_${currentLanguage}.pdf`;
  const virtualURL = `/pdf/virtualCardTerms_${currentLanguage}.pdf`;
  const allowPassTerms = () => {
    animationSlideScreen('left');
    if (newCardTemplate?.isVirtual) {
      navigate('/cards/create-virtual-cards');
    } else {
      navigate('/cards/enter-card-info');
    }
  };

  const handleOpenPDF = () => {
    const url = newCardTemplate?.isVirtual ? virtualURL : plasticURL;
    const pdfPath = `${window.location.origin}${url}`;
    const showPdfParam = JSON.stringify({
      pdfUrl: url
    });
    moveNext(MENU_CODE.SHOW_PDF, { param: showPdfParam });
  };

  useEffect(() => {
    if (isNativeBack) {
      moveBack();
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);

  return (
    <div
      ref={termsRef}
      className={`terms_wrapper ${clazz}`}
      onScroll={() => scrollImpact(termsRef.current, setIsHeaderExpand)}
    >
      <Header title={translate('men_KHCD800010')} isExpand={isHeaderExpand} />
      <div className="terms_container">
        <section className="terms_product_banner">
          <CardBanner
            {...newCardTemplate}
            textPromotion={newCardTemplate?.textPromotion ? newCardTemplate?.textPromotion : ''}
          />
        </section>

        {/* CHECK : Visa Virtual not display Info box */}
        {!newCardTemplate?.isVirtual && (
          <section className="terms_info_box">
            <InfoBox label={translate('lbl_BCD8000000_0088').replace('%1', '2')} />
          </section>
        )}
        <section className="pdf-download" onClick={handleOpenPDF}>
          {newCardTemplate?.isVirtual ? translate('lbl_BCD8000000_0097') : translate('lbl_BCD8000000_0096')}
          <ViewPDFIcon />
        </section>
        {/* newCardTemplate.isVirtual */}
        <section className="terms_check">
          <CheckBox
            size="large"
            label={
              newCardTemplate?.isVirtual
                ? translate('mymen_desc_KHCD800005').replace('///', '')
                : translate('mymen_desc_KHCD800004').replace('///', '')
            }
            onChange={val => setIsAgreeTerms(val)}
          />
        </section>
        <section className="terms_bottom">
          <Button
            disable={!isAgreeTerms}
            className="terms_button"
            label={translate('lbl_cta_3001')}
            onClick={allowPassTerms}
          />
        </section>
      </div>
    </div>
  );
};

export default withHTMLParseI18n(TermsAndAgreement);
