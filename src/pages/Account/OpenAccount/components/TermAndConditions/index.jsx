import { useEffect, useState } from 'react';

import BannerBook from '@assets/images/open-account-book.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { DepositSubjectClass } from '@common/constants/deposit';
import { PeriodUnitCodeDisplay } from '@common/constants/product';
import { fileUrls } from '@common/constants/url';
import { moveBack } from '@utilities/index';

import { ProductType } from '../../constants';
import { ProductDescription } from './constants';
import './styles.scss';

const TermAndConditions = ({ onSubmit, product }) => {
  const { prdt_c: productCode, lcl_prdt_nm, dep_sjt_class: productType } = product || {};
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
      title,
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
    if (product) {
      debugger;
      //TODO: Handle
      const termConditionConfig = {
        selectAllLabel: 'I fully understand and agree to all of the below',
        options: [
          {
            label: '[Mandatory] User Agreement',
            value: '1',
            title: 'User Agreement',
            fileUrl: fileUrls.openAccountAgreeTerm,
          },
          {
            label: '[Mandatory] Product Feature',
            value: '2',
            title: 'Product Feature',
            fileUrl: fileUrls.openAccountProductFeature,
          },
        ],
      };
      setTermConfig(termConditionConfig);
    }
  }, [product]);

  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="open-account term-conditions__wrapper">
        <div className="open-account term-conditions__content">
          <h1 className="page__title">Terms&Conditions</h1>
          <div className={`term-condition__banner ${ProductType[productType]}`}>
            <div className="banner__desc">
              <div className="product__type">
                <span>{lcl_prdt_nm}</span>
              </div>
              <div className="product__desc">
                <span>
                  {ProductDescription[productCode]}
                  {/* This product provides high interest rate even for a day saving with convenient deposit and withdrawal
                system. */}
                </span>
              </div>
            </div>
            <div className="banner__spec">
              <div className="product__item">
                <div className="item__label">Interest Rate</div>
                <div className="item__value">
                  <span className="item__note">up to</span>
                  <span className="item__quantity">{product?.ntfct_intrt}</span>
                  <span className="item__unit">%</span>
                </div>
              </div>
              {product?.dep_sjt_class && product.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
                <div className="product__item">
                  <div className="item__label">Terms</div>
                  <div className="item__value">
                    <span className="item__quantity">
                      {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                    </span>
                    <span className="item__unit">{PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c]}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="banner__image">
              <img src={BannerBook} />
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
            label="Next"
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
