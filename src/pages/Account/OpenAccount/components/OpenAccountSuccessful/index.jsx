import completeImg from '@assets/images/complete.png';
import './styles.scss';
import { openAccountSuccessFields } from '../../constants';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const OpenAccountSuccessful = ({openAccountInfo}) => {
  const onClickViewAccount = () => {

  };

  const onClickNavigateHome = () => {

  };
 
  return (
    <>
      <div className='open-account-successful__wrapper'>
        <div className='open-account__header'>
          <div className='open-account__img'>
            <img src={completeImg} alt="Complete" />
          </div>
          <div className='open-account__title'>
            <div className='complete-message'>You’ve successfully opened</div>
            <div className='product-type'>e-Saving(CAD)</div>
            <div className='note'>Debit card will be sent to the stored customer address.</div>
          </div>
        </div>
        <div className='divider__item__black'></div>
        <div className='open-account__info'>
          {openAccountSuccessFields.map(({label, value}) => 
            <div className='account-item' key={value}>
              <span className='account-label'>{label}</span>
              <span className='account-value'>
                <span>{openAccountInfo?.[value]}</span>
              </span>
            </div>)
          }
        </div>
      </div>
      <div className='footer__fixed'>
        <Button variant="filled__secondary-blue" label="View Account" className="btn__cta" onClick={onClickViewAccount}></Button>
        <Button variant="filled__primary" label="Home" className="btn__cta" onClick={onClickNavigateHome}></Button>
      </div>
    </>
  );
};

export default OpenAccountSuccessful;