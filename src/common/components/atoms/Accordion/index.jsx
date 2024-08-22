import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '../ListGroup/List';
import { ArrowIcon } from 'assets/icons';
import { useState } from 'react';
import Span from '../Span';
import { Button } from '../ButtonGroup/Button/Button';

const Accordion = props => {
  const { clazz, title, viewDetail, label, titleIcon, captionSegments, panelData, isExpand, button, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleExpand = e => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(isExpand);
  }, [isExpand]);

  return (
    <div className={`${clazz} accordion__wrapper ${viewDetail && 'view__detail__type'}`} onClick={onClick}>
      <div className="accordion__item">
        <List
          title={title}
          titleIcon={titleIcon}
          label={label}
          captionSegments={captionSegments}
          icon={
            <div className={`accordion__icon ${isOpen ? 'open' : 'close'}`}>
              <ArrowIcon direction={'down'} />
            </div>
          }
          onIconClick={handleToggleExpand}
        />
      </div>
      <div className={`accordion__panel ${isOpen ? 'open' : 'close'} ${viewDetail && 'view__detail__type'}`}>
        <div className={`accordion__content ${panelData?.icon && 'data__icon'}`}>
          <div className="accordion__icon">{panelData?.icon && <panelData.icon />}</div>
          {panelData?.text && <p className="accordion__text">{panelData?.text}</p>}
          {panelData?.dataTable &&
            panelData?.dataTable.map((data, idx) => (
              <div key={idx + data} className="accordion__table">
                <Span clazz="accordion__table__label" text={data.label} />
                <Span clazz="accordion__table__text" text={data.text} />
              </div>
            ))}
          {panelData?.dataDetail &&
            panelData.dataDetail.map((data, idx) => (
              <div className="accordion__detail" key={idx}>
                <Span clazz="accordion__detail__title" text={data.title} />
                {data.detailItems.map((item, idx) => (
                  <div className="accordion__detail__main" key={idx}>
                    <Span clazz={'accordion__detail__label'} text={item.label} />
                    <Span clazz={'accordion__detail__content'} text={item.content} />
                  </div>
                ))}
              </div>
            ))}
        </div>
        {button && <Button className="accordion__button" variant="outlined" label={button} />}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  clazz: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  viewDetail: PropTypes.bool,
  titleIcon: PropTypes.object,
  captionSegments: PropTypes.object,
  panelData: PropTypes.object,
  isExpand: PropTypes.bool,
  button: PropTypes.string
};
Accordion.defaultProps = {
  clazz: '',
  title: '',
  label: '',
  viewDetail: false,
  titleIcon: {
    name: '',
    position: ''
  },
  captionSegments: { type: 1 },
  panelData: {
    icon: null,
    text: '',
    dataTable: [{ label: '', text: '' }],
    dataDetail: [{ title: '', detailData: [{ label: '', content: '' }] }]
  },
  isExpand: false,
  button: ''
};
export default Accordion;
