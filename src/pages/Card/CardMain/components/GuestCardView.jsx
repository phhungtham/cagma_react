import { useState } from 'react';

import { ArrowRight } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import { MENU_CODE } from '@common/constants/common';
import { cardLabels, ctaLabels } from '@common/constants/labels';
import { CardActionTypes, ReportLostNotLoggedType } from '@pages/Card/constants';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

import { CardTypeWithNavigateParams, guestCardOptions } from '../constants';

const GuestCardView = ({ translate: t }) => {
  const [showReportLostOptionAlert, setShowReportLostOptionAlert] = useState(false);

  const onSelectItem = item => {
    const type = item?.value;
    const { menuCode, path } = CardTypeWithNavigateParams[type];
    if (type === CardActionTypes.REPORT_LOST) {
      setShowReportLostOptionAlert(true);
    } else {
      moveNext(menuCode, {}, path);
    }
  };

  const handleNavigateReportLost = type => {
    moveNext(
      MENU_CODE.REPORT_LOST_CARD,
      {
        param: JSON.stringify({ type }),
      },
      routePaths.reportLostCard
    );
    setShowReportLostOptionAlert(false);
  };

  return (
    <>
      <div className="guest-card-view__wrapper page__container">
        <div className="guest-card__header">
          <div className="page__title">{t(cardLabels.debitCardService)}</div>
        </div>
        <div className="guest-card__options">
          {guestCardOptions.map(item => (
            <div
              className="guest-card__option"
              key={item.value}
              onClick={() => onSelectItem(item)}
            >
              <span className="option__label">{t(item.label)}</span>
              <ArrowRight />
            </div>
          ))}
        </div>
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showReportLostOptionAlert}
        onClose={() => setShowReportLostOptionAlert(false)}
        title={t(cardLabels.doYouKnowCardNumber)}
        subtitle={t(cardLabels.letUsHelpYou)}
        textAlign="center"
        firstButton={{
          onClick: () => handleNavigateReportLost(ReportLostNotLoggedType.ENTER_CARD_NUMBER),
          label: t(ctaLabels.enterCardNumber),
        }}
        secondButton={{
          onClick: () => handleNavigateReportLost(ReportLostNotLoggedType.ENTER_CUSTOMER_INFO),
          label: t(cardLabels.skip),
        }}
      />
    </>
  );
};

export default GuestCardView;
