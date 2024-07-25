import ShooItsMe from '@assets/images/shoo_its_me.png';
import Header from '@common/ui/components/Header';
import useNativeBack from '@hooks/useNativeBack';
import { scrollImpact } from '@utilities';
import { moveBack } from '@utilities/index';
import { useRef, useState } from 'react';
import { licenseList } from './licenseList';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import './styles.scss';

export const OpenSourceLicense = ({ translate }) => {
  const accoriansContentRef = useRef(null);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  useNativeBack(moveBack);

  const renderDefineLicense = () => {
    return licenseList.map(content => {
      return (
        <li>
          <p>{content.name}</p>
          <p>{content.licenseUrl}</p>
        </li>
      );
    });
  };

  return (
    <div
      className="open-source-license__wrapper"
      ref={accoriansContentRef}
      onScroll={() => scrollImpact(accoriansContentRef.current, setIsHeaderExpand)}
    >
      <Header isExpand={isHeaderExpand} title="Open Source Licenses" />
      <section className="open-source-license__content">
        <div className="open-source-license__content--top">
          <p className="open-source-license__content title">{translate('lbl_BHO2010000_0071')}</p>
          <div className="content">
            <p>
              {translate('lbl_BHO2010000_0072')}
            </p>
            <div className="image">
              <img className="open-source-license__img" src={ShooItsMe} alt="open_source_license" />
            </div>
          </div>
        </div>

        <div className="open-source-license__content--main">
          <ul>{renderDefineLicense()}</ul>
        </div>
      </section>
    </div>
  );
};

export default withHTMLParseI18n(OpenSourceLicense);