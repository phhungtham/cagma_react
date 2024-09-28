import { ArrowDown } from '@assets/icons';
import InfoBox from '@common/components/atoms/InfoBox';

const InterestRateSection = ({ interestRate }) => {
  return (
    <div className="interest-rate__section">
      <section className="pb-6">
        <div className="enter-account__interest-rate">
          <span>Interest rate</span>
          <span>{interestRate}% APR</span>
          <span className="interest-rate__arrow">
            <ArrowDown />
          </span>
        </div>
        <InfoBox
          variant="informative"
          label="APR (Annual Percentage Rate)"
        />
      </section>
    </div>
  );
};

export default InterestRateSection;
