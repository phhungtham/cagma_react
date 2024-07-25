import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import Span from '@common/ui/components/atomic/Span';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const DebitCardBottom = props => {
  const {
    open,
    onClose,
    debitBottomType = '',
    cardName = '',
    cardTypeText = '',
    accountLinked = { type: '', number: '' },
    onBottomSheetButtonClick,
    translate
  } = props;

  const DEBIT_BOTTOM_TYPE = {
    REPORT: 'report',
    RELEASE: 'release',
    LOCK: 'lock',
    UNLOCK: 'unlock'
  };

  const handleBottomDebitCardActions = () => {
    onBottomSheetButtonClick && onBottomSheetButtonClick(debitBottomType);
  };

  const displayTextByType = (type, isTitle = false) => {
    switch (type) {
      case DEBIT_BOTTOM_TYPE.REPORT:
        if (isTitle) return translate('mymen_KHCD800004');
        return translate('lbl_cta_3039');
      case DEBIT_BOTTOM_TYPE.RELEASE:
        return translate('mymen_KHCD800007');
      case DEBIT_BOTTOM_TYPE.LOCK:
        return translate('mymen_KHCD800005');
      case DEBIT_BOTTOM_TYPE.UNLOCK:
        return translate('mymen_KHCD800008');
      default:
        return '';
    }
  };

  return (
    <BottomSheet clazz="debit__bottom" type="fit-content" open={open} onClose={onClose}>
      <section className="debit__bottom__header">
        <Span clazz="bottom__type" text={displayTextByType(debitBottomType, true)} />
        <Span clazz="card__name" text={cardTypeText.length > 0 ? cardTypeText : cardName} />
      </section>
      <section className="debit__bottom__data">
        <div className="data__table">
          <Span clazz="item__name" text={translate('lbl_BCD8000000_0030')} />
          <Span clazz="item__data" text={cardName} />
        </div>
        <div className="data__table">
          <Span clazz="item__name" text={translate('lbl_BCD8000000_0031')} />
          <div className="item__linked">
            <Span clazz="item__data" text={accountLinked.type} />
            <Span clazz="item__data" text={accountLinked.number} />
          </div>
        </div>
      </section>
      {(debitBottomType === DEBIT_BOTTOM_TYPE.RELEASE || debitBottomType === DEBIT_BOTTOM_TYPE.UNLOCK) && (
        <section className="debit__bottom__info">
          <InfoBox label={translate('lbl_BCD8000000_0035')} />
        </section>
      )}
      <section className="debit__bottom__footer">
        <Button
          className="debit__button__action"
          label={displayTextByType(debitBottomType)}
          onClick={handleBottomDebitCardActions}
        />
      </section>
    </BottomSheet>
  );
};

export default withHTMLParseI18n(DebitCardBottom);
