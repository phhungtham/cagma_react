import { CalendarIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import './styles.scss';

const VerifyIDPage = () => {
  return (
    <div>
      <Header
        title="Sign up"
        onClick={moveBack}
      />
      <div className="body__wrapper">
        <div className="greeting">Thank you for visit again</div>
        <div className="info">
          <InfoBox
            variant="informative"
            label="Please write the information you provided us during signup."
            direction="middle"
          />
        </div>
        <div className="form__wrapper">
          <Input
            label={'ID Information'}
            type={'text'}
          />

          <Input
            label={'Date of birth'}
            type={'text'}
            endAdornment={
              <div className="calendar__icon">
                <CalendarIcon />
              </div>
            }
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default VerifyIDPage;
