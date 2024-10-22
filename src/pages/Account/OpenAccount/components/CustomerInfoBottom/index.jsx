import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';

import { customerInfoFields } from '../../constants';
import './styles.scss';

const CustomerInfoBottom = ({ customerInfo, onClickConfirm, onClose, onClickChangeProfile }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Customer Info"
      clazz="customer-info-bottom__wrapper"
      type="fit-content"
    >
      <div className="customer-info-bottom__content">
        <section className="instruction-info">
          <span>By clicking Next below, you agree that the information displayed above is true and correct.</span>
        </section>
        <div className="divider__item__black mt-4" />
        <div className="customer-info__detail">
          {customerInfoFields.map(({ label, value: fieldName }) => (
            <div
              className="customer-item"
              key={fieldName}
            >
              <span className="customer-label">{label}</span>
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
            label="Update Profile"
            onClick={onClickChangeProfile}
          />
          <Button
            variant="filled__primary"
            label="Next"
            onClick={onClickConfirm}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoBottom;
