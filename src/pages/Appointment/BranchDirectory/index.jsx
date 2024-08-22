import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import './styles.scss';

const BranchDirectory = () => {
  return (
    <>
      <div className='branch-directory__wrapper'>
        <Header
          title="Branch Directory"
          onClick={moveBack}
        />
        <div className='branch-directory__content'>
        </div>
      </div>
    </>
  );
};

export default BranchDirectory;