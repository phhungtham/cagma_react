import { useState } from 'react';

import { ViewDetailIcon } from '@assets/icons';
import BannerImg from '@assets/images/agree-terms.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Checkbox from '@common/components/atoms/Checkbox';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import { appointmentAgreementLabels as labels, menuLabels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';

import './styles.scss';

const BookAppointmentAgreement = ({ translate: t, onSubmit }) => {
  const [showViewAgreementTermBottom, setShowViewAgreementTermBottom] = useState(false);
  const [isCheckedAgreement, setIsCheckedAgreement] = useState(false);

  const handleClickViewAgreementTermBottom = () => {
    setShowViewAgreementTermBottom(true);
  };

  const handleConfirmAgreement = () => {
    setIsCheckedAgreement(true);
    setShowViewAgreementTermBottom(false);
  };

  return (
    <div className="book-appointment-agreement__wrapper h-screen">
      <Header title={t(menuLabels.bookAppointment)} />
      <div className="h-screen__content px-0">
        <div className="agreement__view flex-gap-y-16">
          <p className="page__title">{t(labels.appointmentAgreement)}</p>
          <div className="agreement__banner">
            <img
              src={BannerImg}
              alt="img__agreement"
            />
          </div>
          <ul className="agreement-instructions">
            <li className="instruction-item">{t(labels.toUseAppointmentService)}</li>
          </ul>
        </div>
        <div className="divider__group" />
        <div className="agreement__service flex-gap-y-12">
          <div
            className="agreement__view-document"
            onClick={handleClickViewAgreementTermBottom}
          >
            <p className="input__label">{t(labels.serviceAgreement)}</p>
            <div className="input__icon">
              <ViewDetailIcon />
            </div>
          </div>
          <div className="agreement__checkbox">
            <Checkbox
              size="large"
              label={t(labels.iCheckedConsent)}
              onChange={checked => setIsCheckedAgreement(checked)}
              checked={isCheckedAgreement}
            />
          </div>
        </div>
      </div>
      {showViewAgreementTermBottom && (
        <ViewTermBottom
          open={showViewAgreementTermBottom}
          onClose={() => setShowViewAgreementTermBottom(false)}
          title={t(labels.serviceAgreement)}
          pdfFile={fileUrls.cardHolderAgreement}
          onConfirm={handleConfirmAgreement}
        />
      )}

      <div className="footer__fixed">
        <Button
          label={t(labels.confirm)}
          variant="filled__primary"
          className="btn__cta"
          onClick={onSubmit}
          disable={!isCheckedAgreement}
        />
      </div>
    </div>
  );
};

export default BookAppointmentAgreement;
