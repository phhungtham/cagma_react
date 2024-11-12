import BottomSheet from '@common/components/templates/BottomSheet';
import { openAccountDTRLabels as labels } from '@common/constants/labels';

const GuideTaxBottom = ({ onClose, open, translate: t }) => {
  return (
    <BottomSheet
      open={open}
      title={t(labels.guidelinesForTaxQuestions)}
      onClose={onClose}
      type="fit-content"
    >
      <div className="guide-tax-bottom__wrapper pt-4">
        <ul className="guide-tax__content">
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">{t(labels.amIResidentUS)}</div>
            <div className="mt-1 font-13 text-gray-550">{t(labels.ifYouAreUS)}</div>
          </li>
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">{t(labels.amIResidentOtherUS)}</div>
            <div className="mt-1 font-13 text-gray-550">{t(labels.rulesForTax)}</div>
          </li>
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">{t(labels.whatIsTin)}</div>
            <div className="mt-1 font-13 text-gray-550">{t(labels.tinExplain)}</div>
          </li>
        </ul>
      </div>
    </BottomSheet>
  );
};

export default GuideTaxBottom;
