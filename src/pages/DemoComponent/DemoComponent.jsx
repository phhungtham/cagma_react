import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import { useState } from 'react';

const DemoComponent = () => {
  const [open, setOpen] = useState(true);
  const [month, setMonth] = useState();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: 'blue',
      }} onClick={() => setOpen(true)}>BS Select Date
      </div>

      <SelectDateBottom
        open={open}
        maxYear='2040'
        minYear='1980'
        onClose={() => setOpen(false)}
        onDateChange={(data) => {
          setMonth(data);
          setOpen(false);
        }}
        date={month}
        type='MM/YYYY'
      />
    </div>);
};


export default DemoComponent;