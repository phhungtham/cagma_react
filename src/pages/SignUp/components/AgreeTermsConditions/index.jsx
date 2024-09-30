import { useState } from 'react';

import termsConditionsBanner from '@assets/images/terms-condition.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { moveBack } from '@utilities/index';

import { signUpTermConditionConfig } from './constants';
import './styles.scss';

const AgreeTermsConditions = ({ onConfirm }) => {
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });

  const onClickViewTermDetail = value => {
    const termItem = signUpTermConditionConfig.options.find(item => item.value === value);
    const { fileUrl, title } = termItem;
    setViewTermBottom({
      open: true,
      fileUrl,
      title,
      value,
    });
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const handleSubmitForm = () => {
    onConfirm();
  };

  const handleConfirmTerm = () => {
    const checkedValue = viewTermBottom.value;
    if (!checkedOptions.includes(checkedValue)) {
      setCheckedOptions([...checkedOptions, checkedValue]);
    }
    onCloseViewTermBottom();
  };

  const onCloseViewTermBottom = () => {
    setViewTermBottom({ ...viewTermBottom, open: false });
  };

  return (
    <>
      <div className="agree-terms-conditions__wrapper">
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form px-0">
          <div className="page__container">
            <div className="page__title">Agree to Terms and Conditions</div>
            <div className="terms-banner">
              <img
                src={termsConditionsBanner}
                alt="Agree terms and condition"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="terms-instructions">
                <li className="instruction-item">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li className="instruction-item mt-2">Ut et massa mi.</li>
              </ul>
              <div className="mt-2 terms-subs">
                Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices
                mauris.
              </div>
            </div>
          </div>
          <div className="divider__group" />
          <div className="page__container">
            <TermConditionChecklist
              config={signUpTermConditionConfig}
              onClickViewTerm={onClickViewTermDetail}
              onCheckOption={handleCheckOption}
              checkedOptions={checkedOptions}
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmitForm}
          />
        </div>
      </div>
      <ViewTermBottom
        open={viewTermBottom.open}
        onClose={onCloseViewTermBottom}
        title={viewTermBottom.title}
        pdfFile={viewTermBottom.fileUrl}
        onConfirm={handleConfirmTerm}
      />
    </>
  );
};

export default AgreeTermsConditions;
