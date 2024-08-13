import Header from '@common/ui/components/Header';
import { moveBack } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import avatarURL from '@assets/images/jack-icon.png';
import './styles.scss';
import { CameraIcon, SettingIcon, ViewDetailIcon } from '@assets/icons';
import { Controller, useForm } from 'react-hook-form';
import Input from '@common/ui/components/atomic/Input/Input';
import InputSelect from '@common/ui/components/atomic/Input/InputSelect';
import Dropdown from '@common/ui/components/atomic/Dropdown';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import InfoBox from '@common/ui/components/atomic/InfoBox';

const initValues = {
  name: 'Jennifer',
  dob: '1987/11/17',
  sin: '123456789',
  email: 'Jennifer6756@gmail.com',
  call: '647-770-5364',
  callNumber: '647-770-5364'
};

const ChangeProfile = ({translation}) => {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: initValues
  });
  return (
    <div className="change-profile-wrapper">
      <Header
        title="Change Profile"
        onClick={() => {
          moveBack();
        }}
      />
      <div className="change-profile-content">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            <div className="avatar-img">
              <img src={avatarURL} alt="profile" />
            </div>
            <div className="setting-button">
              <SettingIcon />
            </div>
          </div>
        </div>
        <div className="form-wrapper">
          <div className="form-section">
            <div className="form-section-title">
              <span>Contact Information</span>
            </div>
            <Controller
              render={({ field }) => <Input label={'Name'} type={'text'} disabled {...field} />}
              control={control}
              name="name"
            />
            <Controller
              render={({ field }) => <Input label={'Date of Birth'} type={'text'} disabled {...field} />}
              control={control}
              name="dob"
            />
            <Controller
              render={({ field }) => <Input label={'SIN'} type={'text'} disabled {...field} />}
              control={control}
              name="sin"
            />
            <Controller
              render={({ field }) => <Input label={'E-mail address'} type={'text'} 
                endAdornment={<Button label="Send" variant="outlined__primary" className="btn__send btn__sm"></Button>} {...field} />}
              control={control}
              name="email"
            />
            <Controller
              render={({ field }) => <Input label={'Call Number'} type={'text'} {...field} />}
              control={control}
              name="callNumber"
            />
            <Controller
              render={({ field }) => <Dropdown label={'Employment'} {...field} />}
              control={control}
              name="employment"
            />
            <Controller
              render={({ field }) => <Dropdown label={'Occupation1'} {...field} />}
              control={control}
              name="Occupation1"
            />
            <Controller
              render={({ field }) => <Dropdown label={'Occupation2'} {...field} />}
              control={control}
              name="Occupation2"
            />
            <Controller
              render={({ field }) => <Input label={'Occupation3'} {...field} />}
              control={control}
              name="Occupation3"
            />
            <Controller
              render={({ field }) => <Input label={'Occupation3'} {...field} />}
              control={control}
              name="Occupation3"
            />
            <div className="agreement-download">
              <span>Electronic Communication Agreement</span>
              <ViewDetailIcon />
            </div>
          </div>
          <div className="form-section pt-9">
            <div className="form-section-title">
              <span>Address Information</span>
            </div>
            <Controller
              render={({ field }) => <Dropdown label={'Address Type'} {...field} />}
              control={control}
              name="addressType"
            />
            <Controller
              render={({ field }) => <Input label={'Phone Number'} {...field} />}
              control={control}
              name="phoneNumber"
            />
            <Controller
              render={({ field }) => <Input label={'Fax Number'} {...field} />}
              control={control}
              name="faxNumber"
            />
            <Controller
              render={({ field }) => <Dropdown label={'Country'} {...field} />}
              control={control}
              name="country"
            />
            <Controller
              render={({ field }) => <Input label={'Postal Code'} {...field} />}
              control={control}
              name="postalCode"
            />
            <Controller
              render={({ field }) => <Input label={'APT Number/SUITE Number'} {...field} />}
              control={control}
              name="aptNumber"
            />
            <Controller
              render={({ field }) => <Input label={'Street Number'} {...field} />}
              control={control}
              name="postalCode"
            />
            <Controller
              render={({ field }) => <Input label={'Street Name'} {...field} />}
              control={control}
              name="postalCode"
            />
            <Controller
              render={({ field }) => <Input label={'City'} {...field} />}
              control={control}
              name="postalCode"
            />
            <Controller
              render={({ field }) => <Dropdown label={'Province'} {...field} />}
              control={control}
              name="country"
            />
            <div className="divider-item-solid mt-4"></div>
            <div className="form-section pt-4">
              <div className="form-section-title">
                <span>Proof of address</span>
              </div>
              <div className="address-upload">
                <div className="upload-icon">
                  <CameraIcon />
                </div>
                <p className="upload-title">Upload</p>
                <p className="upload-desc">*5MB Max</p>
              </div>
              <InfoBox variant="informative" label="Your address can be easily updated via online by submitting a proff of address document. If you prefer the in-person help, please visit our branches."/>
            </div>
          </div>
        </div>
        
        <div className="footer-fixed">
          <Button label="Save" variant="filled__primary" className="btn__cta"></Button>
        </div>
      </div>
    </div>
  );
};
export default withHTMLParseI18n(ChangeProfile);