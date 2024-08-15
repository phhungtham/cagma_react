import { FAButton } from '@common/components/atoms/ButtonGroup/FAB/FAButton';
import Image from '@common/components/atoms/Image';
import Label from '@common/components/atoms/Label';
import Span from '@common/components/atoms/Span';
import PropTypes from 'prop-types';

const EventBanner = props => {
  const { clazz, heading, description, date, button, title, label, icon, thumbnail, onShare, children } = props;
  return (
    <div className={`event__banner ${clazz}`}>
      <div className="event__banner__top">
        <div className="event__banner__heading">
          {title && <Label type="ghost" variant="primary" label={title} clazz="event__banner__label" />}
          {heading && <Span clazz="content__heading" text={heading} />}
        </div>
        <div className="event__banner__img">
          {thumbnail && <Image src={thumbnail} alt="event_banner" />}
          {button && (
            <div className="event__banner__button">
              <FAButton variant="scroll" />
            </div>
          )}
        </div>
      </div>
      <div className={`event__banner__bottom ${date.position}`}>
        <div className="event__banner__actions">
          <div className="event__banner__date">
            {label && <Label clazz="event__banner__time__label" variant="primary" label={label} />}
            <Span clazz="event__banner__time__start" text={date?.timeStart && date?.timeStart} />
            {date?.timeStart && date?.timeEnd && <span>-</span>}
            <Span clazz="event__banner__time__end" text={date?.timeEnd && date?.timeEnd} />
          </div>
          {icon && (
            <div className="event__banner__share" onClick={onShare}>
              {icon}
            </div>
          )}
        </div>
        <Span clazz="event__banner__desc" text={description} />
      </div>
      {children && <div className="event__banner__content">{children}</div>}
    </div>
  );
};

EventBanner.propTypes = {
  clazz: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  date: PropTypes.object,
  button: PropTypes.bool
};

EventBanner.defaultProps = {
  clazz: '',
  heading: '',
  description: '',
  title: '',
  label: '',
  button: false,
  date: { timeStart: '', timeEnd: '' }
};
export default EventBanner;
