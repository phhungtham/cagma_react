import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Accordion from '@common/components/atoms/Accordion';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@configs/global/constants';
import useGetBranchDirectory from '@hooks/useGetBranchDirectory';
import { routePaths } from '@routes/paths';
import { callPhone, moveBack, moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';

import { branchFields } from '../constants';
import './styles.scss';

const BranchDirectory = () => {
  const nativeParams = useSelector(nativeParamsSelector);

  const {
    data: branchList,
    isLoading: isLoadingGetBranch,
    sendRequest: sendRequestGetBranch,
  } = useGetBranchDirectory();

  branchList?.sort((branchPre, branchNex) => (branchPre.lcl_br_nm > branchNex.lcl_br_nm ? 1 : -1));

  const [viewMapItem, setViewMapItem] = useState({
    open: false,
    branchData: undefined,
  });

  const onClickCallPhone = phoneNumber => {
    callPhone(phoneNumber);
  };

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

  const handleNavigateBookAppointment = branch => {
    moveNext(
      MENU_CODE.BOOK_APPOINTMENT,
      {
        param: JSON.stringify({ ...nativeParams, branchNo: branch?.brno }),
      },
      routePaths.bookAppointment
    );
  };

  useEffect(() => {
    sendRequestGetBranch();
  }, []);

  return (
    <>
      <div className="branch-directory__wrapper">
        {isLoadingGetBranch && <Spinner />}
        <Header
          title="Branch Directory"
          onClick={moveBack}
        />
        <div className="branch-directory__content">
          <div className="branch-directory__list">
            {branchList?.length > 0 &&
              branchList.map((branch, index) => (
                <div
                  className="branch-directory__item"
                  key={branch.brno}
                >
                  <Accordion
                    title={branch.lcl_br_nm}
                    caption={branch.br_adr}
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
                            {value === 'br_telno' ? (
                              <div
                                className="table__item__value phone"
                                onClick={() => onClickCallPhone(branch[value])}
                              >
                                {branch[value]}
                              </div>
                            ) : (
                              <div className={`table__item__value ${value}`}>{branch[value]}</div>
                            )}
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
                          onClick={() => handleNavigateBookAppointment(branch)}
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
        onBookAppointment={handleNavigateBookAppointment}
      />
    </>
  );
};

export default BranchDirectory;
