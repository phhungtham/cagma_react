import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';
import { openAccountLabels as labels } from '@common/constants/labels';

import { customerInfoFields } from '../../constants';
import './styles.scss';

const CustomerInfoBottom = ({ customerInfo, onClickConfirm, onClose, onClickChangeProfile, translate: t }) => {
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
          <span>{t(labels.byClickingNewAccount)}</span>
        </section>
        <div className="divider__item__black mt-4" />
        <div className="customer-info__detail">
          {customerInfoFields.map(({ label, value: fieldName }) => (
            <div
              className="customer-item"
              key={fieldName}
            >
              <span className="customer-label">{t(label)}</span>
              <span className="customer-value">
                {fieldName === 'job' ? (
                  <>
                    <span>{customerInfo?.jobDisplay}</span>
                    <span>{customerInfo?.subJobDisplay}</span>
                    <span>{customerInfo?.job_nm}</span>
                  </>
                ) : (
                  <span>{customerInfo?.[fieldName]}</span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="divider__item__solid" />
        <div className="customer__cta">
          <Button
            variant="filled__secondary-blue"
            label={t(labels.updateProfile)}
            onClick={onClickChangeProfile}
          />
          <Button
            variant="filled__primary"
            label={t(labels.newAccount)}
            onClick={onClickConfirm}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoBottom;
