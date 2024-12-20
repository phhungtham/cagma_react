import { ArrowDown } from '@assets/icons';
import InfoBox from '@common/components/atoms/InfoBox';
import { openAccountLabels as labels } from '@common/constants/labels';

const InterestRateSection = ({ interestRate, translate: t }) => {
  return (
    <div className="interest-rate__section">
      <section className="pb-6">
        <div className="enter-account__interest-rate flex-gap-x-8">
          <span>{t(labels.interestRate2)}</span>
          <span>{interestRate}% APR</span>
          <span className="interest-rate__arrow">
            <ArrowDown />
          </span>
        </div>
        <InfoBox
          variant="informative"
          label={t(labels.apr)}
        />
      </section>
    </div>
  );
};

export default InterestRateSection;
