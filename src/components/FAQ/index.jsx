import React, { useRef, useCallback, useState } from 'react';
import Header from '@common/ui/components/Header';
import { AnswerIcon, ArrowIcon, QuestionIcon } from 'assets/icons';
import InputSearch from '@common/ui/components/atomic/Input/InputSearch';

import './styles.scss';
import Accoridan from '@common/ui/components/atomic/Accoridan';
import { FAQCategory, SIZE } from '@common/ui/constants';
import ScrollTopButton from '@common/ui/components/atomic/ButtonGroup/ScrollTopButton';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import List from '@common/ui/components/atomic/ListGroup/List';
import no_image from '../../assets/images/no-result.png';
import SeeMorePagination from '@common/ui/components/atomic/Pagination';
import { scrollImpact } from '@utilities';

export const FAQ = () => {
  const accoriansContentRef = useRef(null);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [categorySeleted, setCategorySeleted] = useState(FAQCategory[0]);
  const [isOpenBottom, setIsOpenBottom] = useState(false);
  const [isInputCanel, setIsInputCanel] = useState(false);
  const [faqList, setFaqList] = useState(Array.from(Array(10).keys()));

  const handleMoveToTop = () => {
    accoriansContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleToggleBottom = status => {
    setIsOpenBottom(status);
  };

  const handleShowCancelInput = status => {
    setIsInputCanel(status);
  };

  const handleCancelInput = () => {
    //will reset list here
    setFaqList(Array.from(Array(10).keys()));
  };

  const onSearchFQA = e => {
    const inputValue = e.target.value;
    //dummy filter faq on search
    const faqSeachResult = faqList.filter(() => false);
    setFaqList(faqSeachResult);
  };

  const renderFQAList = () => {
    return faqList.map(index => (
      <Accoridan
        key={index}
        panelData={{
          icon: AnswerIcon,
          text: 'Please For customers who use Smail on multi devices, you can use sync function  on mobile phone that you registered with the Bank. Text. Please Enter Text. Please Enter Text.'
        }}
        title="What should I do if I lose my security device?"
        titleIcon={{
          name: QuestionIcon,
          position: 'left'
        }}
      />
    ));
  };

  return (
    <div
      className="faq__wrapper"
      ref={accoriansContentRef}
      onScroll={() => scrollImpact(accoriansContentRef.current, setIsHeaderExpand)}
    >
      <Header isExpand={isHeaderExpand} title={'FAQ'} clazz={'faq__header'} />
      <InputSearch
        onCancel={isInputCanel ? handleCancelInput : null}
        size={SIZE.LARGE}
        placeHolder={'Type your question here'}
        onFocusSearchInput={handleShowCancelInput}
        onChange={onSearchFQA}
      />
      <section className="filter__title">
        <div className="all__status">
          {categorySeleted}&nbsp;
          <div className="filter__icon" onClick={() => handleToggleBottom(true)}>
            <ArrowIcon />
          </div>
        </div>
      </section>
      <section className="faq__content">
        {faqList.length > 0 ? (
          renderFQAList()
        ) : (
          <div className="no__result">
            <img src={no_image} alt={'no_notification'} />
            <span>
              No search results for <b>system</b>
            </span>
          </div>
        )}
      </section>
      {faqList.length > 0 && <SeeMorePagination currentTotalItem={20} allTotalItem={35} />}
      {isHeaderExpand && faqList.length > 0 && (
        <section className="faq__scroll__top">
          <ScrollTopButton onClick={handleMoveToTop} />
        </section>
      )}
      <section className="faq__bottomsheet">
        <BottomSheet
          title={'Select Category'}
          open={isOpenBottom}
          onClose={() => handleToggleBottom(false)}
          type={'fit-content'}
        >
          <div className="faq__bottomsheet__content">
            {FAQCategory.map(cate => (
              <List
                key={cate}
                control={{
                  name: 'select',
                  position: 'right',
                  active: true,
                  hide: categorySeleted !== cate
                }}
                title={cate}
                onListClick={() => setCategorySeleted(cate)}
              />
            ))}
          </div>
        </BottomSheet>
      </section>
    </div>
  );
};

export default FAQ;
