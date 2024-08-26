import { PropTypes } from 'prop-types';

import './styles.scss';

const defaultClass = 'span';
const Span = ({ clazz, text, onClick }) => {
  const clazzName = [defaultClass, clazz].join(' ');
  return (
    <span
      className={clazzName}
      onMouseDown={onClick}
    >
      {text}
    </span>
  );
};
export default Span;

Span.propTypes = {
  clazz: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

Span.defaultProps = {
  clazz: defaultClass,
  text: '',
  onClick: undefined,
};
