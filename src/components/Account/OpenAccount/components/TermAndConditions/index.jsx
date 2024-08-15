import Header from '@common/ui/components/Header';
import { moveBack } from '@utilities/index';
import BannerBook from '@assets/images/open-account-book.png';
import './styles.scss';
import TermConditionChecklist from '@common/ui/components/organisms/TermConditionChecklist';
import { termConditionConfig } from '../../constants';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import { useState } from 'react';
import SelectBottom from '@common/ui/components/atomic/BottomSheet/SelectBottom/SelectBottom';
import ViewTermBottom from '@common/ui/components/molecules/ViewTermBottom';

const TermAndConditions = () => {
  const [isValidForm, setIsValidForm] = useState(false);
  const [isShowViewTermBottom, setIsShowViewTermBottom] = useState(false);
  const onChangeSelectAll = (checked) => {
    setIsValidForm(checked);
  };

  const onClickSubmit = () => {
    alert('on submit');
  };

  const onClickViewTermDetail = (value) => {
    console.log('value :>> ', value);
    setIsShowViewTermBottom(true);
  };

  const onCloseViewTermBottom = () => {
    setIsShowViewTermBottom(false);
  };
  
  return (
    <div className="term-conditions__wrapper">
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className='term-conditions__content'>
        <h1 className='term-condition__title'>Terms&Conditions</h1>
        <div className='term-condition__banner'>
          <div className='banner__desc'>
            <div className='product__type'>
              <span>e-Savings(CAD)</span>
            </div>
            <div className='product__desc'>
              <span>This product provides high interest rate even for a day saving with convenient deposit and withdrawal system.</span>
            </div>
          </div>
          <div className='banner__spec'>
            <div className='product__item'>
              <div className='item__label'>Interest Rate</div>
              <div className='item__value'>
                <span className='item__quantity'>~7.35</span>
                <span className='item__unit'>%</span>
              </div>
            </div>
            <div className='product__item'>
              <div className='item__label'>Tenor</div>
              <div className='item__value'>
                <span className='item__quantity'>6~36</span>
                <span className='item__unit'>months</span>
              </div>
            </div>
          </div>
          <div className='banner__image'>
            <img src={BannerBook}/>
          </div>
        </div>
        <div className='term-condition__checklist'>
          <TermConditionChecklist config={termConditionConfig} onSelectAll={onChangeSelectAll} onClickViewTerm={onClickViewTermDetail} />
        </div>
      </div>
      <div className="footer__fixed">
        <Button label="Next" variant="filled__primary" className="btn__cta" onClick={onClickSubmit} disable={!isValidForm}></Button>
      </div>
      <ViewTermBottom 
        open={isShowViewTermBottom} 
        onClose={onCloseViewTermBottom} 
        title="View Terms" 
        subTitle="View terms subtitle"
      />
    </div>
  );
};

export default TermAndConditions;