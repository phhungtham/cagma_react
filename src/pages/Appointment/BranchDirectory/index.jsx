import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Accordion from '@common/components/atoms/Accordion';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { bookAppointmentLabels as labels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { callPhone, moveBack, moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { branchFields } from '../constants';
import './styles.scss';

const BranchDirectory = ({ translate: t }) => {
  const nativeParams = useSelector(nativeParamsSelector);

  const [branches, setBranches] = useState();

  const [showLoading, setShowLoading] = useState(false);

  const [viewMapItem, setViewMapItem] = useState({
    open: false,
    branchData: undefined,
  });

  const { requestApi } = useApi();

  const [branchIndex, setBranchIndex] = useState(null);
  const elementsBranchRef = useRef([]);
  const refTimeout = useRef(null);

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

  const requestGetBranches = async () => {
    setShowLoading(true);
    const { data, isSuccess } = await requestApi(endpoints.getBranchDirectory);
    setShowLoading(false);
    if (isSuccess) {
      const branchList = data.r_CACO006_1Vo || [];
      setBranches(branchList);
    }
  };

  useEffect(() => {
    requestGetBranches();
  }, []);

  const handleOnClickAccordion = index => {
    clearTimeout(refTimeout.current);
    setBranchIndex(prevIndex => (prevIndex === index ? null : index));
    refTimeout.current = setTimeout(() => {
      if (elementsBranchRef.current[index]) {
        elementsBranchRef.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);
  };

  return (
    <>
      <div className="branch-directory__wrapper">
        {showLoading && <Spinner />}
        <Header
          title={t(menuLabels.bookAppointment)}
          onClick={moveBack}
        />
        <div className="branch-directory__content">
          <div className="branch-directory__list">
            {branches?.length > 0 &&
              branches.map((branch, index) => (
                <div
                  className="branch-directory__item"
                  key={branch.brno}
                >
                  <Accordion
                    title={branch.lcl_br_nm}
                    caption={branch.br_adr}
                    isExpand={branchIndex === index}
                    onClick={() => handleOnClickAccordion(index)}
                  >
                    <div
                      className="accordion__table__bottom"
                      ref={el => (elementsBranchRef.current[index] = el)}
                    >
                      <div className="table__info">
                        {branchFields.map(({ label, value }) => (
                          <div
                            className="table__item"
                            key={`${value}-${index}`}
                          >
                            <div className="table__item__label">{t(label)}</div>
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
                      <div className="accordion__ctas flex-gap-x-8">
                        <Button
                          label={t(labels.viewMap)}
                          variant="outlined__primary"
                          size="md"
                          onClick={() => handleOpenViewMap(branch)}
                        />
                        <Button
                          label={t(labels.bookAppointment)}
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
      {viewMapItem.open && (
        <ViewMapBottom
          open={viewMapItem.open}
          onClose={handleCloseViewMap}
          branchData={viewMapItem.branchData}
          onBookAppointment={handleNavigateBookAppointment}
        />
      )}
    </>
  );
};

export default withHTMLParseI18n(BranchDirectory);
