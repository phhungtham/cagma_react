import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import './styles.scss';
import Accordion from '@common/components/atoms/Accordion';
import { branchDirectoryListTest, branchFields } from '../constants';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const BranchDirectory = () => {
  return (
    <>
      <div className='branch-directory__wrapper'>
        <Header
          title="Branch Directory"
          onClick={moveBack}
        />
        <div className='branch-directory__content'>
          <div className='branch-directory__list'>
            {branchDirectoryListTest.map((branch, index) => (
              <div className='branch-directory__item' key={branch.branchNo}>
                <Accordion title={branch.title} caption={branch.caption} isExpand={index === 0}>
                  <div className='accordion__table__bottom'>
                    <div className='table__info'>
                      {branchFields.map(({label, value}) => (
                        <div className='table__item' key={value}>
                          <div className='table__item__label'>{label}</div>
                          <div className={`table__item__value ${value}`}>{branch[value]}</div>
                        </div>
                      ))}
                    </div>
                    <div className='accordion__ctas'>
                      <Button label="View map" variant="outlined__primary" size="md"></Button>
                      <Button label="Book Appointment" variant="filled__primary" size="md"></Button>
                    </div>
                  </div>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchDirectory;