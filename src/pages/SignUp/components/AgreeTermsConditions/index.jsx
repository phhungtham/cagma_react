import { useContext, useState } from 'react';

import termsConditionsBanner from '@assets/images/terms-condition.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { signUpMOTPAgreeTermsLabels as labels, menuLabels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';
import { moveBack } from '@utilities/index';

import { signUpTermConditionConfig } from './constants';
import './styles.scss';

const AgreeTermsConditions = ({ onConfirm }) => {
  const { translate: t } = useContext(SignUpContext);
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });

  const isValidForm = checkedOptions?.length === signUpTermConditionConfig.options.length;

  const onClickViewTermDetail = value => {
    const termItem = signUpTermConditionConfig.options.find(item => item.value === value);
    const { fileUrl, title } = termItem;
    setViewTermBottom({
      open: true,
      fileUrl,
      title: t(title),
      value,
    });
  };

  const scrollToBottom = () => {
    const container = document.querySelector('.h-screen__content');
    if (!container) return;
    const isBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    if (isBottom) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
    //Because hard to know other options below. Need to scroll to bottom when check the first option
    const isCheckFirstOptions = signUpTermConditionConfig.options[0].value === value;
    if (isCheckFirstOptions) {
      scrollToBottom();
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
          title={t(menuLabels.security)}
          onClick={moveBack}
        />
        <div className="h-screen__content pt-5 px-0">
          <div className="page__container">
            <div className="page__title">{t(labels.agreeToTerms)}</div>
            <div className="terms-banner">
              <img
                src={termsConditionsBanner}
                alt="Agree terms and condition"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="terms-instructions">
                <li className="instruction-item">{t(labels.termDescription)}</li>
              </ul>
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
            label={t(labels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmitForm}
            disable={!isValidForm}
          />
        </div>
      </div>
      {viewTermBottom.open && (
        <ViewTermBottom
          open={viewTermBottom.open}
          onClose={onCloseViewTermBottom}
          title={viewTermBottom.title}
          pdfFile={viewTermBottom.fileUrl}
          onConfirm={handleConfirmTerm}
        />
      )}
    </>
  );
};

export default AgreeTermsConditions;
