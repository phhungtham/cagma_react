import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import { useState } from 'react';

const DemoComponent = () => {
  const [selectDate, setSelectDate] = useState({ open: false, date: '' });
  const [selectTime, setSelectTime] = useState({ open: true, time: '' });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }}>
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: 'blue',
      }} onClick={() => setSelectDate((prev) => ({ ...prev, open: true }))}>BS Select Date
      </div>

      <div style={{
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: 'blue',
      }} onClick={() => setSelectTime((prev) => ({ ...prev, open: true }))}>BS Select Time
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