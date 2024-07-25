import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import CalendarInput from '@common/ui/components/atomic/Calendar/CalendarInput';
import Chips from '@common/ui/components/atomic/Chips';
import { INQUIRIES } from '@common/ui/constants';
import { setIsShowCalendar } from '@components/VisaCard/redux/action';
import { debitCardReducer } from '@components/VisaCard/redux/reducer';
import { cardSelectedSelector } from '@components/VisaCard/redux/selector';
import { FeatureDebitCardName } from '@components/VisaCard/redux/type';
import useReducers from '@hooks/useReducers';
import isEmpty from '@utilities/isEmpty';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const FilterBottomSheet = ({
  open,
  onClose,
  apllyFilter,
  filterDataStateDefault,
  resetFilter,
  filterTypeData,
  dataFilterBeforeRese,
  onCancelReset,
  translate
}) => {
  useReducers([{ key: FeatureDebitCardName, reducer: debitCardReducer }]);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const [filterData, setfilterData] = useState(filterDataStateDefault);

  const handleUpdateFilterData = (key, value) => {
    let cusData = { ...filterData };
    cusData[key] = value;
    // if (key === 'transType' && value !== INQUIRIES.custom) {
    //   cusData.dateRang = { startDate: '', startDateString: '', endDate: '', endDateString: '' };
    // }
    setfilterData({ ...cusData });
  };

  const handleReset = () => {
    resetFilter();
    isResetRef.current = true;
  };

  const handleChangeDateRange = dateRange => {
    setfilterData({ ...filterData, dateRang: dateRange });
  };

  const combineTransactionType = () => {
    if (isEmpty(filterTypeData) || !filterTypeData) return;
    const transTypeParams = cardSelected?.card_virtual_yn === 1 ? 'rvng_utl_v' : 'rvng_utl_p';
    const transTypeData = filterTypeData?.data?.elData[transTypeParams];
    let renderType = [
      {
        label: translate('lbl_com_3016'),
        value: 0,
        handleClick: value => {
          handleUpdateFilterData('transType', value);
        }
      }
    ];
    transTypeData.forEach(trans => {
      renderType.push({
        label: trans?.value,
        value: +trans?.key,
        handleClick: value => {
          handleUpdateFilterData('transType', value);
        }
      });
    });
    return renderType;
  };

  const handleCloseBottomSheet = () => {
    if (isResetRef.current) {
      setfilterData({ ...dataFilterBeforeRese });
      onCancelReset();
      isResetRef.current = false;
    } else {
      setfilterData({ ...filterDataStateDefault });
    }
    onClose();
  };

  useEffect(() => {
    setfilterData(filterDataStateDefault);
  }, [filterDataStateDefault]);

  useLayoutEffect(() => {
    checkClickOutside();
  }, []);

  const checkClickOutside = () => {
    const bottomSheetFilter = document.querySelector('.filter__bottom__sheet');
    if (!bottomSheetFilter) return;

    return bottomSheetFilter.addEventListener('click', e => {
      const reactCalender = document.querySelector('.calendar_bottom .date__picker') || null;
      const calendarIconLeft = document.querySelector('.calendar_bottom .calendar__icon__left') || null;
      const calendarIconRight = document.querySelector('.calendar_bottom .calendar__icon__right') || null;
      if (!reactCalender && !calendarIconLeft && !calendarIconRight) return;
      if (
        !reactCalender?.contains(e.target) &&
        !calendarIconLeft?.contains(e.target) &&
        !calendarIconRight?.contains(e.target)
      ) {
        setIsShowCalendar(false);
      }
    });
  };

  const isResetRef = useRef(false);

  return (
    <BottomSheet
      clazz="filter__bottom__sheet"
      title={translate('lbl_com_3008')}
      open={open}
      onClose={handleCloseBottomSheet}
      type="fit-content"
    >
      <section className="sort__by">
        <div className="title">{translate('lbl_com_3009')}</div>
        <div className="sort__chip">
          <Chips
            type="default"
            segments={[
              {
                label: translate('lbl_com_3010'),
                value: 'D',
                handleClick: value => {
                  handleUpdateFilterData('sortBy', value);
                }
              },
              {
                label: translate('lbl_com_3011'),
                value: 'A',
                handleClick: value => {
                  handleUpdateFilterData('sortBy', value);
                }
              }
            ]}
            defaultActive={filterData.sortBy}
          />
        </div>
      </section>
      <section className="inquiry__period">
        <div className="title">{translate('lbl_com_3012')}</div>
        <div className="inquiry__chip">
          <Chips
            type="default"
            segments={[
              {
                label: translate('lbl_com_3013').replace('%1', '1'),
                value: INQUIRIES.OM,
                handleClick: value => {
                  handleUpdateFilterData('inquiries', value);
                }
              },
              {
                label: translate('lbl_com_3013').replace('%1', '3'),
                value: INQUIRIES.TM,
                handleClick: value => {
                  handleUpdateFilterData('inquiries', value);
                }
              },
              {
                label: translate('lbl_com_3013').replace('%1', '6'),
                value: INQUIRIES.SM,
                handleClick: value => {
                  handleUpdateFilterData('inquiries', value);
                }
              },
              {
                label: translate('lbl_com_3014'),
                value: INQUIRIES.custom,
                handleClick: value => {
                  handleUpdateFilterData('inquiries', value);
                }
              }
            ]}
            defaultActive={filterData.inquiries}
          />
          <section className={`calendar__input__wrapper ${filterData.inquiries === INQUIRIES.custom && 'show'}`}>
            <CalendarInput
              clazz="calendar_bottom"
              inputType="calendar"
              onDateChange={handleChangeDateRange}
              isHideCalendar={filterData.inquiries !== INQUIRIES.custom || !open}
              isReset={isResetRef.current}
            />
          </section>
        </div>
      </section>
      <section className={`transaction__type ${cardSelected?.card_virtual_yn !== 1 && 'three__child'}`}>
        <div className="title">{translate('lbl_com_3015')}</div>
        <div className="transaction__chip">
          <Chips type="default" segments={combineTransactionType()} defaultActive={filterData.transType} />
        </div>
      </section>
      <section className="button__wrapper">
        <Button className="reset__button" onClick={handleReset} variant="outlined" label={translate('lbl_cta_3008')} />
        <Button
          className="apply__button"
          label={translate('lbl_cta_3009')}
          onClick={() => {
            apllyFilter(filterData);
            isResetRef.current = false;
          }}
        />
      </section>
    </BottomSheet>
  );
};
export default withHTMLParseI18n(FilterBottomSheet);
