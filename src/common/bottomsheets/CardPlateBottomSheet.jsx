import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import RadioButton from '@common/ui/components/atomic/RadioButton';
import { useEffect, useState } from 'react';
import NavyCard from '../../assets/images/cards/visa_consumer_classic_debit_card_navy.png';
import PinkCard from '../../assets/images/cards/visa_consumer_classic_debit_card_pink.png';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const CardPlateBottomSheet = ({ open, onClose, onSaveCard, defaultOption, isReadOnly, translate }) => {
  const [radioActive, setRadioActive] = useState(defaultOption);
  const handleRadioChecked = value => {
    setRadioActive(value);
  };

  const handleSaveCardPlate = () => {
    onClose();
    onSaveCard(radioActive);
  };

  const handleCloseBottomSheet = () => {
    onClose();
    setRadioActive(defaultOption);
  };

  useEffect(() => {
    setRadioActive(defaultOption);
  }, [defaultOption]);

  return (
    <BottomSheet type="fit-content" title={translate('lbl_BCD8000000_0064')} open={open} onClose={handleCloseBottomSheet}>
      <section className="card__plate__wrapper">
        <section className="card__plate__content">
          <section className="card__plate__navy">
            <div className="radio__wrapper">
              <RadioButton
                selected={radioActive}
                handleClick={handleRadioChecked}
                value="0006"
                size="large"
                label={translate('lbl_BCD8000000_0065')}
                disabled={isReadOnly === 'readOnly'}
              />
            </div>
            <img src={NavyCard} />
          </section>
          <section className="card__plate__pink">
            <div className="radio__wrapper">
              <RadioButton
                selected={radioActive}
                handleClick={handleRadioChecked}
                value="0007"
                size="large"
                label={translate('lbl_BCD8000000_0066')}
                disabled={isReadOnly === 'readOnly'}
              />
            </div>
            <img src={PinkCard} />
          </section>
        </section>

        <section className="card__plate__bottom">
          <Button className="card__bottom__button" label={translate('lbl_cta_3007')} onClick={handleSaveCardPlate} />
        </section>
      </section>
    </BottomSheet>
  );
};
export default withHTMLParseI18n(CardPlateBottomSheet);
