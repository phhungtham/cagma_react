import Lottie from 'lottie-react';
import khsol_loading from '../../../../../assets/lottie/khsol_loading.json';

const Spinner = () => {
  return (
    <>
      <div className="spinner__wrapper"></div>
      <div className="spinner">
        <Lottie animationData={khsol_loading} loop={true} />
      </div>
    </>
  );
};

Spinner.propTypes = {};
Spinner.defaultProps = {};
export default Spinner;
