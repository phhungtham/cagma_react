import React, { useEffect, useRef, useState } from 'react';

import AnchorTab from '../../atoms/AnchorTab';

const ScrollAnchorTabWrapper = ({ defaultActiveTab, sections, options, children }) => {
  const containerRef = useRef();
  const { classHeader, classAnchor } = options;
  const [activeTab, setActiveTab] = useState('');
  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);

  useEffect(() => {
    setActiveTab(defaultActiveTab);
    const defaultSection = sections.find(item => item.tab === defaultActiveTab);
    const waitForRefAndScroll = () => {
      if (defaultSection?.ref?.current) {
        handleScrollToTitle(defaultSection.ref);
      } else {
        requestAnimationFrame(waitForRefAndScroll);
      }
    };
    waitForRefAndScroll();
  }, [defaultActiveTab]);

  const handleScrollToTitle = ref => {
    const scrollContainer = containerRef?.current;
    if (ref?.current && scrollContainer) {
      const headerHeight = document.querySelector(classHeader).offsetHeight || 0;
      const anchorTabHeight = document.querySelector(classAnchor).offsetHeight || 0;

      const scrollToPosition =
        ref.current.getBoundingClientRect().top + scrollContainer.scrollTop - headerHeight - anchorTabHeight - 20;
      setIsProgrammaticScrolling(true);
      scrollContainer.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });
      const checkScrollPosition = () => {
        const currentScrollTop = scrollContainer.scrollTop;
        const distanceToTarget = Math.abs(currentScrollTop - scrollToPosition);
        if (distanceToTarget < 5) {
          setIsProgrammaticScrolling(false);
        } else {
          requestAnimationFrame(checkScrollPosition);
        }
      };
      requestAnimationFrame(checkScrollPosition);
    }
  };

  const handleScrollToActive = () => {
    if (isProgrammaticScrolling) return;
    const scrollContainer = containerRef.current;
    const scrollTop = scrollContainer.scrollTop;
    const headerHeight = document.querySelector(classHeader).offsetHeight || 0;
    const anchorTabHeight = document.querySelector(classAnchor).offsetHeight || 0;

    const getSectionOffsets = sectionRef => {
      if (sectionRef?.current) {
        const offsetTop = sectionRef.current.offsetTop - headerHeight - anchorTabHeight - 20;
        const offsetBottom = offsetTop + sectionRef.current.offsetHeight;
        return { offsetTop, offsetBottom };
      }
      return { offsetTop: -Infinity, offsetBottom: -Infinity };
    };

    sections.forEach(({ ref, tab }) => {
      const { offsetTop, offsetBottom } = getSectionOffsets(ref);
      if (scrollTop >= offsetTop && scrollTop < offsetBottom) {
        setActiveTab(tab);
      }
    });
  };

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        if (!isProgrammaticScrolling) {
          handleScrollToActive();
        }
      };
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isProgrammaticScrolling]);

  return (
    <div
      className="scroll-anchor-tab__wrapper"
      ref={containerRef}
      onScroll={handleScrollToActive}
    >
      <AnchorTab
        type="default"
        segments={sections.map(({ tab, label, ref }) => ({
          label: label,
          value: tab,
          handleClick: () => handleScrollToTitle(ref),
        }))}
        defaultActive={activeTab}
        active={activeTab}
      />
      {children}
    </div>
  );
};

export default ScrollAnchorTabWrapper;
