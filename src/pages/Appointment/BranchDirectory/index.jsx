import { useState } from 'react';

import Accordion from '@common/components/atoms/Accordion';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import { branchDirectoryListTest, branchFields } from '../constants';
import './styles.scss';

const BranchDirectory = () => {
  const [viewMapItem, setViewMapItem] = useState({
    open: false,
    branchData: undefined,
  });

  const handleOpenViewMap = branchData => {
    setViewMapItem({
      open: true,
      branchData: branchData,
    });
  };

  const handleCloseViewMap = () => {
    setViewMapItem({
      open: false,
    });
  };

  const handleBookAppointment = () => {};

  return (
    <>
      <div className="branch-directory__wrapper">
        <Header
          title="Branch Directory"
          onClick={moveBack}
        />
        <div className="branch-directory__content">
          <div className="branch-directory__list">
            {branchDirectoryListTest.map((branch, index) => (
              <div
                className="branch-directory__item"
                key={`${branch.branchNo}-${index}`}
              >
                <Accordion
                  title={branch.title}
                  caption={branch.caption}
                  isExpand={index === 0}
                >
                  <div className="accordion__table__bottom">
                    <div className="table__info">
                      {branchFields.map(({ label, value }) => (
                        <div
                          className="table__item"
                          key={`${value}-${index}`}
                        >
                          <div className="table__item__label">{label}</div>
                          <div className={`table__item__value ${value}`}>{branch[value]}</div>
                        </div>
                      ))}
                    </div>
                    <div className="accordion__ctas">
                      <Button
                        label="View map"
                        variant="outlined__primary"
                        size="md"
                        onClick={() => handleOpenViewMap(branch)}
                      />
                      <Button
                        label="Book Appointment"
                        variant="filled__primary"
                        size="md"
                        onClick={() => handleBookAppointment()}
                      />
                    </div>
                  </div>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ViewMapBottom
        open={viewMapItem.open}
        onClose={handleCloseViewMap}
        branchData={viewMapItem.branchData}
        handleBookAppointment={handleBookAppointment}
      />
    </>
  );
};

export default BranchDirectory;
