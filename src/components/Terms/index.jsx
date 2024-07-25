import React, { useRef, useState } from 'react';
import Accoridan from '@common/ui/components/atomic/Accoridan';
import Header from '@common/ui/components/Header';
import './styles.scss';
import { scrollImpact } from '@utilities';

const Terms = () => {
  const accoriansContentRef = useRef(null);
  const [faqList, setFaqList] = useState(Array.from(Array(10).keys()));
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);

  const renderFQAList = () => {
    if (faqList.length <= 0) return;
    return faqList.map(index => (
      <Accoridan
        key={index}
        panelData={{
          text: 'Please For customers who use Smail on multi devices, you can use sync function  on mobile phone that you registered with the Bank. Text. Please Enter Text. Please Enter Text.'
        }}
        title="What should I do if I lose my security device?"
      />
    ));
  };
  return (
    <div
      className="terms__wrapper"
      ref={accoriansContentRef}
      onScroll={() => scrollImpact(accoriansContentRef.current, setIsHeaderExpand)}
    >
      <Header isExpand={isHeaderExpand} title="Terms" />
      <section className="terms__content">{renderFQAList()}</section>
    </div>
  );
};

export default Terms;
