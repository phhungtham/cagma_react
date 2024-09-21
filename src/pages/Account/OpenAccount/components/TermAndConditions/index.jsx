import { useState } from 'react';

import BannerBook from '@assets/images/open-account-book.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { DepositSubjectClass } from '@common/constants/deposit';
import { PeriodUnitCodeDisplay } from '@common/constants/product';

import { termConditionConfig } from '../../constants';
import './styles.scss';

const TermAndConditions = ({ onSubmit, product }) => {
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });
  const [checkedOptions, setCheckedOptions] = useState([]);

  const isValidForm = checkedOptions?.length === termConditionConfig.options.length;

  const { lcl_prdt_nm } = product || {};

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
    const termItem = termConditionConfig.options.find(item => item.value === value);
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
      setCheckedOptions(termConditionConfig.options.map(option => option.value));
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

  return (
    <div className="open-account term-conditions__wrapper">
      <div className="open-account term-conditions__content">
        <h1 className="page__title">Terms&Conditions</h1>
        <div className="term-condition__banner">
          <div className="banner__desc">
            <div className="product__type">
              <span>{lcl_prdt_nm}</span>
            </div>
            <div className="product__desc">
              <span>
                This product provides high interest rate even for a day saving with convenient deposit and withdrawal
                system.
              </span>
            </div>
          </div>
          <div className="banner__spec">
            <div className="product__item">
              <div className="item__label">Interest Rate</div>
              <div className="item__value">
                <span className="item__note">up to</span>
                <span className="item__quantity">~{product?.ntfct_intrt}</span>
                <span className="item__unit">%</span>
              </div>
            </div>
            {product?.dep_sjt_class && product.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
              <div className="product__item">
                <div className="item__label">Tenor</div>
                <div className="item__value">
                  <span className="item__quantity">
                    {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                  </span>
                  <span className="item__unit">{PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c]}s</span>
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
            config={termConditionConfig}
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
  );
};

export default TermAndConditions;
