import Lottie from 'lottie-react';
import casol_loading from '../../../../assets/lottie/casol_loading.json';

const Spinner = () => {
  return (
    <>
      <div className="spinner__wrapper"></div>
      <div className="spinner">
        <Lottie animationData={casol_loading} loop={true} />
      </div>
    </>
  );
};

Spinner.propTypes = {};
Spinner.defaultProps = {};
export default Spinner;
