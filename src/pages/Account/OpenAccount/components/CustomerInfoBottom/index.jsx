import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';
import { openAccountLabels as labels } from '@common/constants/labels';

import './styles.scss';

const CustomerInfoBottom = ({ onClickConfirm, onClose, onClickChangeProfile, translate: t }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title={t(labels.customerInfo)}
      clazz="customer-info-bottom__wrapper"
      type="fit-content"
    >
      <div className="customer-info-bottom__content">
        <section className="instruction-info">
          <span>{t(labels.pleaseReviewYourPersonalInfo)}</span>
        </section>
        <div className="customer__cta">
          <Button
            variant="filled__secondary-blue"
            label={t(labels.updateProfile)}
            onClick={onClickChangeProfile}
          />
          <Button
            variant="filled__primary"
            label={t(labels.next)}
            onClick={onClickConfirm}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoBottom;
