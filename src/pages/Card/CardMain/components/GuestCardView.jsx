import { ArrowRight } from '@assets/icons';
import { MENU_CODE } from '@common/constants/common';
import { CardActionTypes } from '@pages/Card/constants';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

const guestCardOptions = [
  {
    label: 'Activate your Access Card',
    value: CardActionTypes.ACTIVE,
  },
  {
    label: 'Reissue your Access Card',
    value: CardActionTypes.REISSUE,
  },
  {
    label: 'Report a Lost/Stolen Access Card',
    value: CardActionTypes.REPORT_LOST,
  },
];

const typeWithNavigateParams = {
  [CardActionTypes.ACTIVE]: {
    menuCode: MENU_CODE.ACTIVE_CARD,
    path: routePaths.activeCard,
  },
  [CardActionTypes.REISSUE]: {
    menuCode: MENU_CODE.REISSUE_CARD,
    path: routePaths.reissueCard,
  },
};

const GuestCardView = () => {
  const onSelectItem = item => {
    const type = item?.value;
    const { menuCode, path } = typeWithNavigateParams[type];
    moveNext(menuCode, {}, path);
  };

  return (
    <div className="guest-card-view__wrapper page__container">
      <div className="guest-card__header">
        <div className="page__title">Access Card Service</div>
      </div>
      <div className="guest-card__options">
        {guestCardOptions.map(item => (
          <div
            className="guest-card__option"
            key={item.value}
            onClick={() => onSelectItem(item)}
          >
            <span className="option__label">{item.label}</span>
            <ArrowRight />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestCardView;
