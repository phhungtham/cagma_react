import Header from '@common/ui/components/Header';
import { useRef, useState } from 'react';
import SOL_07 from '@assets/images/SOL_07.png';
import useNativeBack from '@hooks/useNativeBack';
import { scrollImpact } from '@utilities';
import { moveBack } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import '../OpenSourceLicense/styles.scss';

export const FraudWarning = ({ translate }) => {
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const accoriansContentRef = useRef(null);
  useNativeBack(moveBack);

  return (
    <div
      className="open-source-license__wrapper"
      ref={accoriansContentRef}
      onScroll={() => scrollImpact(accoriansContentRef.current, setIsHeaderExpand)}
    >
      <Header isExpand={isHeaderExpand} title={translate('men_KHHC901002')} />

      <section className="open-source-license__content">
        <div className="open-source-license__content--top">
          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0034')}</p>
          <div className="content">
            <p>{translate('lbl_BHO2010000_0035')}</p>
            <div className="image">
              <img className="fraud-warning__img" src={SOL_07} alt="fraud_warning" />
            </div>
          </div>
        </div>

        <div className="open-source-license__content--main">
          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0036')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0037')}</li>
            <li>{translate('lbl_BHO2010000_0038')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0039')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0040')}</li>
            <li>{translate('lbl_BHO2010000_0041')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0042')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0043')}</li>
            <li>{translate('lbl_BHO2010000_0044')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0045')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0046')}</li>
            <li>{translate('lbl_BHO2010000_0047')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0048')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0049')}</li>
            <li>{translate('lbl_BHO2010000_0050')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0051')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0052')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0053')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0054')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0055')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0056')}</li>
            <li>{translate('lbl_BHO2010000_0057')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0058')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0059')}</li>
          </ul>

          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0060')}</p>
          <ul>
            <li>{translate('lbl_BHO2010000_0061')}</li>
            <li>{translate('lbl_BHO2010000_0062')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default withHTMLParseI18n(FraudWarning);
