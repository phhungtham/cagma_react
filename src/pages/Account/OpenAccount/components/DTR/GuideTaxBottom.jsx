import BottomSheet from '@common/components/templates/BottomSheet';

const GuideTaxBottom = ({ onClose, open }) => {
  return (
    <BottomSheet
      open={open}
      title="Guidelines for Tax Questions"
      onClose={onClose}
      type="fit-content"
    >
      <div className="guide-tax-bottom__wrapper pt-4">
        <ul className="guide-tax__content">
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">Am I a tax resident of the US?</div>
            <div className="mt-1 font-13 text-gray-550">
              If you are a U.S. Passport holder, U.S. Permanent Residence Card holder, legal U.S. resident, or alien
              with a U.S. place of birth, you are considered a tax resident of the U.S.The Canada Revenue Agency
              requires us to collect infor
            </div>
          </li>
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">Am I a tax resident of a country other than Canada or the U.S.?</div>
            <div className="mt-1 font-13 text-gray-550">
              Rules for tax residency can be complex and vary by country. If you’re unsure, please refer to that
              country’s tax authority, or your tax advisor.
            </div>
          </li>
          <li className="guide-tax__item">
            <div className="font-15 text-gray-700">What’s a TIN (Tax Identification Number)?</div>
            <div className="mt-1 font-13 text-gray-550">
              A TIN is a unique combination of letters and numbers assigned to an individual or entity when filing taxes
              in their tax jurisdiction/country. If you do not know your TIN, please refer to that country’s tax
              authority, or your tax advisor.
            </div>
          </li>
        </ul>
      </div>
    </BottomSheet>
  );
};

export default GuideTaxBottom;
