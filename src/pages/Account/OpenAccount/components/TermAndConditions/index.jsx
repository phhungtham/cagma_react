import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { DepositSubjectClass } from '@common/constants/deposit';
import { ctaLabels, openAccountLabels as labels, menuLabels } from '@common/constants/labels';
import { PeriodUnitCodeDisplay } from '@common/constants/product';
import { AppCfg } from '@configs/appConfigs';
import { BannerMapProductCode } from '@pages/Product/ProductList/constants';
import { moveBack } from '@utilities/index';
import { appLanguage } from 'app/redux/selector';

import { OpenAccountDescriptions, ProductType } from '../../constants';
import { OpenAccountTermFile } from './constants';
import './styles.scss';

const TermAndConditions = ({ onSubmit, product, translate: t }) => {
  const { prdt_c: productCode, prdt_c_display, lcl_prdt_nm, dep_sjt_class: productType } = product || {};
  const currentLanguage = useSelector(appLanguage);
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });
  const [termConfig, setTermConfig] = useState();
  const [checkedOptions, setCheckedOptions] = useState([]);

  const isValidForm = checkedOptions?.length === termConfig?.options.length;

  const onClickSubmit = () => {
    onSubmit();
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickViewTermDetail = value => {
    const termItem = termConfig.options.find(item => item.value === value);
    const { fileUrl, title } = termItem;
    setViewTermBottom({
      open: true,
      fileUrl,
      title: t(title),
      value,
    });
  };

  const handleCheckAll = checked => {
    if (checked) {
      setCheckedOptions(termConfig.options.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  const handleConfirmTerm = () => {
    const checkedValue = viewTermBottom.value;
    if (!checkedOptions.includes(checkedValue)) {
      setCheckedOptions([...checkedOptions, checkedValue]);
    }
    onCloseViewTermBottom();
  };

  const onCloseViewTermBottom = () => {
    setViewTermBottom({ ...viewTermBottom, open: false });
  };

  useEffect(() => {
    if (productCode) {
      const urlPrefix = `${AppCfg.API_ENDPOINT_PORT}${OpenAccountTermFile[productCode]}`;
      const userAgreementFile = `${urlPrefix}_agree_en.pdf`;
      const productFeatureFile = `${urlPrefix}_${currentLanguage || 'en'}.pdf`;
      const termConditionConfig = {
        selectAllLabel: labels.agreeTermsAll,
        options: [
          {
            label: labels.userAgreement,
            value: '1',
            title: labels.userAgreement,
            fileUrl: userAgreementFile,
          },
          {
            label: labels.productFeature,
            value: '2',
            title: labels.userAgreement,
            fileUrl: productFeatureFile,
          },
        ],
      };
      setTermConfig(termConditionConfig);
    }
  }, [productCode, currentLanguage]);

  return (
    <>
      <Header
        title={t(menuLabels.openAccount)}
        onClick={moveBack}
      />
      <div className="open-account term-conditions__wrapper">
        <div className="open-account term-conditions__content">
          <h1 className="page__title">{t(labels.termsConditions)}</h1>
          <div className={`term-condition__banner ${ProductType[productType]}`}>
            <div className="banner__desc">
              <div className="product__type">
                <span>{prdt_c_display || lcl_prdt_nm}</span>
              </div>
              <div className="product__desc">
                <span>{t(OpenAccountDescriptions[productCode])}</span>
              </div>
            </div>
            <div className="banner__spec">
              <div className="product__item">
                <div className="item__label">{t(labels.interestRate)}</div>
                <div className="item__value">
                  <span className="item__note">{t(labels.upTo)}</span>
                  <span className="item__quantity">{product?.ntfct_intrt}</span>
                  <span className="item__unit">%</span>
                </div>
              </div>
              {product?.dep_sjt_class && product.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
                <div className="product__item">
                  <div className="item__label">{t(labels.terms)}</div>
                  <div className="item__value">
                    <span className="item__quantity">
                      {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                    </span>
                    <span className="item__unit">{t(PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c])}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="banner__image">
              <img src={BannerMapProductCode[productCode]} />
            </div>
          </div>
          <div className="term-condition__checklist">
            <TermConditionChecklist
              config={termConfig}
              onClickViewTerm={onClickViewTermDetail}
              onCheckOption={handleCheckOption}
              onCheckAll={handleCheckAll}
              checkedOptions={checkedOptions}
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(ctaLabels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={onClickSubmit}
            disable={!isValidForm}
          />
        </div>
        <ViewTermBottom
          open={viewTermBottom.open}
          onClose={onCloseViewTermBottom}
          title={viewTermBottom.title}
          pdfFile={viewTermBottom.fileUrl}
          onConfirm={handleConfirmTerm}
        />
      </div>
    </>
  );
};

export default TermAndConditions;
