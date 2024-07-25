import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import React from 'react';

const CreateMerchantAlertBottomSheet = ({ open = false, onClose, onClickProceed, translate }) => {
  const handleCloseBottomSheet = () => {
    onClose();
  };
  return (
    <>
      <BottomSheet open={open} onClose={handleCloseBottomSheet} type="fit-content" clazz="create__merchant__bottomsheet">
        <div style={{ textAlign: 'center' }}>
          <div className="alert__text__1">{translate('lbl_com_3272')}</div>
          <div className="alert__text__2">{translate('lbl_com_3273')}</div>
          <button className="btn__proceed" onClick={onClickProceed}>
            {translate('lbl_cta_3043')}
          </button>
          <button className="btn__back" onClick={handleCloseBottomSheet}>
            {translate('lbl_cta_3013')}
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

export default withHTMLParseI18n(CreateMerchantAlertBottomSheet);
