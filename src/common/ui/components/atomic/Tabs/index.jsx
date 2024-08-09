import React, { useEffect, useState } from 'react';
import Span from '../Span';
import PropTypes from 'prop-types';

const Tabs = props => {
  const { clazz, tabList, isLoginAlready, children, onTabChange, tabIndex = 0 } = props;
  const [tabActive, setTabActive] = useState(tabIndex);

  useEffect(() => {
    setTabActive(tabIndex);
  }, [tabIndex]);

  const handleTabClick = (tabName, index) => {
    setTabActive(index);
    onTabChange && onTabChange(tabName, index);
  };

  return (
    <div className={`tabs ${clazz}`}>
      {isLoginAlready && (
        <div className="tabs__wrapper">
          {tabList.map((tab, index) => (
            <div
              key={index}
              className={`tabs__list ${tabActive === index && 'tab__active'}`}
              onClick={() => handleTabClick(tab.title, index)}
            >
              <Span key={index} clazz="tabs__item" text={tab.title} />
            </div>
          ))}
        </div>
      )}
      {children && <div className="tabs__content">{children}</div>}
    </div>
  );
};

Tabs.propTypes = {
  clazz: PropTypes.string,
  tabList: PropTypes.array,
  isLoginAlready: PropTypes.bool
};

Tabs.defaultProps = {
  clazz: '',
  tabList: [],
  isLoginAlready: true
};

export default Tabs;
