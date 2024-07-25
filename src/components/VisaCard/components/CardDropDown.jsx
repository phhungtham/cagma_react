import React, { useState } from 'react';
import { ThinArrowIcon } from 'assets/icons';
const CardDropDown = ({ icon, title, markedSub, markType = 'blue', children, onClick, isShowIcon = true }) => {
  return (
    <div className="card__drop__down">
      <section className="card__drop__down__header">
        <div className="title" onClick={onClick}>
          <div className="be__icon">{icon}</div>
          <div className="be__icon__title">{title}</div>&nbsp;
          <mark className={`${markType === 'grey' && 'grey'}`}>{markedSub}</mark>
        </div>
        {isShowIcon && (
          <div className="drop__down__icon" onClick={onClick}>
            <ThinArrowIcon />
          </div>
        )}
      </section>
      {children && <section className={'card__drop__down__content expanded'}>{children}</section>}
    </div>
  );
};

export default CardDropDown;
