import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { customerInfoFields } from '../../constants';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const CustomerInfoBottom = ({customerInfo}) => {
  return (
    <BottomSheet
      open={true}
      onClose={() => {}}
      title="Customer Info"
      clazz="customer-info-bottom__wrapper"
      type="fit-content"
    >
      <div className="customer-info-bottom__content">
        <section className='instruction-info'>
          <span>By clicking New Account below, you agree that the information displayed above is true and correct.</span>
        </section>
        <div className='divider__item__black mt-4'></div>
        <div className='customer-info__detail'>
          {customerInfoFields.map(({label, value}) => 
            <div className='customer-item' key={value}>
              <span className='customer-label'>{label}</span>
              <span className='customer-value'>
                <span>{customerInfo[value]}</span>
              </span>
            </div>)
          }
        </div>
        <div className='divider__item__solid'></div>
        <div className='customer__cta'>
          <Button variant="filled__secondary-blue" label="Update Profile"></Button>
          <Button variant="filled__primary" label="New Account"></Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoBottom;