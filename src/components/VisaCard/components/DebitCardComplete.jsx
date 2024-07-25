import call__icon from '@assets/images/call-icon.png';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import { DuoButton } from '@common/ui/components/atomic/ButtonGroup/DuoButton/DuoButton';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import Span from '@common/ui/components/atomic/Span';
import { callPhone } from '@utilities/index';
import { WaveDivider } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const DebitCardComplete = props => {
  const {
    clazz,
    dateComplete,
    completeThumbnail,
    cardName,
    actionText,
    dataTable,
    button,
    duoButton,
    shortInfo,
    translate
  } = props;

  const handleActionCall = () => {
    callPhone('023-955-0001');
  };

  return (
    <div className={`container__complete ${clazz}`}>
      <section className={`complete__top ${dataTable.length >= 6 && 'more_data'}`}>
        <div className="complete__top__header">
          <Span clazz="date" text={dateComplete} />
        </div>
        <div className="complete__top__content">
          <img className="complete__img" src={completeThumbnail} alt="lock_card" />
          <div className={`complete__title ${actionText.position}`}>
            {actionText?.position === 'left' && (
              <>
                <Span clazz="card__state" text={actionText.text} />
                <Span clazz="card__name" text={cardName} />
              </>
            )}
            {actionText?.position === 'right' && (
              <>
                <Span clazz="card__name" text={cardName} />
                <Span clazz="card__state" text={actionText.text} />
              </>
            )}
          </div>

          {shortInfo && (
            <section className={`debit__bottom__data ${shortInfo ? 'shortInfo' : ''}`}>
              <div className="data__table">
                <Span clazz="item__name" text={translate('lbl_BCD8000000_0030')} />
                <Span clazz="item__data" text={shortInfo.cardName} />
              </div>
              <div className="data__table">
                <Span clazz="item__name" text={translate('lbl_BCD8000000_0031')} />
                <div className="item__linked">
                  <Span clazz="item__data" text="Main account" />
                  <Span clazz="item__data" text={shortInfo.accountNo} />
                </div>
              </div>
            </section>
          )}

          {dataTable && (
            <div className="data__table">
              {dataTable?.map((item, index) => (
                <div key={index} className="data__item">
                  <Span clazz="title" text={item.title} />
                  <div className="item__value">
                    {item.value.map((val, index) => (
                      <Span key={index} clazz="value" text={val} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={`complete__top__info__box ${!dataTable && 'no__dataTable'}`}>
          <InfoBox label={translate('lbl_BCD8000000_0033')} />
        </div>
        <div className="complete__top__wave__divider">
          <WaveDivider />
        </div>
      </section>
      <section className="complete__bottom">
        <div className="complete__bottom__call">
          <img className="call__icon" src={call__icon} alt="help__call" onClick={handleActionCall} />
          <Span clazz="call__text" text={translate('lbl_BCD8000000_0034')} />
        </div>
        <div className="complete__bottom__button">
          {duoButton && (
            <DuoButton
              firstButton={{
                label: duoButton.firstButton.label,
                onClick: duoButton.firstButton.action
              }}
              secondButton={{
                label: duoButton.secondButton.label,
                onClick: duoButton.secondButton.action
              }}
            />
          )}
          {button && <Button className="one__button" label={button.label} onClick={button.action} />}
        </div>
      </section>
    </div>
  );
};

DebitCardComplete.defaultProps = {
  clazz: '',
  dateComplete: '',
  completeThumbnail: null,
  cardName: '',
  actionText: {
    text: '',
    position: 'right'
  },
  duoButton: null
};

export default withHTMLParseI18n(DebitCardComplete);
