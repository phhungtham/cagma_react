import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '../ListGroup/List';
import { ArrowIcon } from 'assets/icons';
import { useState } from 'react';
import Span from '../Span';
import { Button } from '../ButtonGroup/Button/Button';

const Accoridan = props => {
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
    <div className={`${clazz} accoridan__wrapper ${viewDetail && 'view__detail__type'}`} onClick={onClick}>
      <div className="accoridan__item">
        <List
          title={title}
          titleIcon={titleIcon}
          label={label}
          captionSegments={captionSegments}
          icon={
            <div className={`accoridan__icon ${isOpen ? 'open' : 'close'}`}>
              <ArrowIcon direction={'down'} />
            </div>
          }
          onIconClick={handleToggleExpand}
        />
      </div>
      <div className={`accoridan__panel ${isOpen ? 'open' : 'close'} ${viewDetail && 'view__detail__type'}`}>
        <div className={`accoridan__content ${panelData?.icon && 'data__icon'}`}>
          <div className="accoridan__icon">{panelData?.icon && <panelData.icon />}</div>
          {panelData?.text && <p className="accoridan__text">{panelData?.text}</p>}
          {panelData?.dataTable &&
            panelData?.dataTable.map((data, idx) => (
              <div key={idx + data} className="accoridan__table">
                <Span clazz="accoridan__table__label" text={data.label} />
                <Span clazz="accoridan__table__text" text={data.text} />
              </div>
            ))}
          {panelData?.dataDetail &&
            panelData.dataDetail.map((data, idx) => (
              <div className="accoridan__detail" key={idx}>
                <Span clazz="accoridan__detail__title" text={data.title} />
                {data.detailItems.map((item, idx) => (
                  <div className="accoridan__detail__main" key={idx}>
                    <Span clazz={'accoridan__detail__label'} text={item.label} />
                    <Span clazz={'accoridan__detail__content'} text={item.content} />
                  </div>
                ))}
              </div>
            ))}
        </div>
        {button && <Button className="accoridan__button" variant="outlined" label={button} />}
      </div>
    </div>
  );
};

Accoridan.propTypes = {
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
Accoridan.defaultProps = {
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
export default Accoridan;
