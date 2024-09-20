import { ArrowRight } from '@assets/icons';
import { CardActionTypes } from '@pages/Card/constants';

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

const GuestCardView = () => {
  const onSelectItem = item => {};

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
