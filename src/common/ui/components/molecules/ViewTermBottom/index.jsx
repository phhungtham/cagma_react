import { PropTypes } from 'prop-types';
import BottomSheet from '../../atomic/BottomSheet';

const ViewTermBottom = ({open, onClose, title, subTitle, children}) => {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      subTitle={subTitle}
      clazz="view-term-bottom__wrapper"
      type="max-scroll"
    >
      <div className="view-term__content">
        <div className='view-term__detail'>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          <div className='mt-4'>Content View Term</div>
          
        </div>
      </div>
    </BottomSheet>
  );
};

ViewTermBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

ViewTermBottom.defaultProps = {
  open: false,
  onClose: () => {},
  title: '',
  subTitle: '',
};

export default ViewTermBottom;