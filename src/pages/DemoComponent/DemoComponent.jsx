import { useState } from 'react';

import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import Tooltip from '@common/components/atoms/Tooltip';

import './styles.scss';

const DemoComponent = () => {
  const [selectDate, setSelectDate] = useState({ open: false, date: '' });
  const [selectTime, setSelectTime] = useState({ open: false, time: '' });

  return (
    <div className='container'>
      <div className='__demo'>
        <div className='__title'>Bottom Sheet</div>
        <div
          className='__button'
          onClick={() => setSelectDate((prev) => ({ ...prev, open: true }))}
        >
          BS Select Date
        </div>

        <div
          className='__button'
          onClick={() => setSelectTime((prev) => ({ ...prev, open: true }))}
        >
          BS Select Time
        </div>
      </div>

      <div className='__demo'>
        <div className='__title'>Tooltip</div>
        <Tooltip content='Top left' placement='top_left'>
          <div className='__button'>Top Left</div>
        </Tooltip>
        <Tooltip content='Top right' placement='top_right'>
          <div className='__button'>Top Right</div>
        </Tooltip>
        <Tooltip content='Top Center' placement='top_center'>
          <div className='__button'>Top Center</div>
        </Tooltip>
        <Tooltip content='Bottom left' placement='bottom_left'>
          <div className='__button'>Bottom Left</div>
        </Tooltip>
        <Tooltip content='Bottom right' placement='bottom_right'>
          <div className='__button'>Bottom Right</div>
        </Tooltip>
        <Tooltip content='Bottom center' placement='bottom_center'>
          <div className='__button'>Bottom Center</div>
        </Tooltip>
      </div>

      <SelectDateBottom
        open={selectDate.open}
        maxYear='2040'
        minYear='1980'
        onClose={() => setSelectDate((prev) => ({ ...prev, open: false }))}
        onDateChange={(date) => {
          setSelectDate({
            date,
            open: false
          });
        }}
        defaultDate={selectDate.date}
        type='MM/YYYY'
      />

      <SelectTimeBottom
        open={selectTime.open}
        onClose={() => setSelectTime((prev) => ({ ...prev, open: false }))}
        onTimeChange={(time) => {
          setSelectTime({ time, open: false });
        }}
        defaultTime={selectTime.time}
      />
    </div >);
};


export default DemoComponent;