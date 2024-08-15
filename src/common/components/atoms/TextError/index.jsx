import { PropTypes } from 'prop-types';

const defaultClass = '';
const TextError = ({ clazz, text }) => {
  return <p className={`text-error ${clazz}`}>{text}</p>;
};
export default TextError;

TextError.propTypes = {
  clazz: PropTypes.string,
  text: PropTypes.string
};

TextError.defaultProps = {
  clazz: defaultClass,
  text: ''
};
