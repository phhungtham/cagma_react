import { useState } from 'react';

import Tooltip from '@common/components/atoms/Tooltip';
import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';

import './styles.scss';

const DemoComponent = () => {
  const [selectDate, setSelectDate] = useState({
    open: false,
    date: `${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
  });
  const [selectTime, setSelectTime] = useState({
    open: false,
    time: `${new Date().getHours() % 12} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`,
  });
  const [viewMapItem, setViewMapItem] = useState({ open: false });

  return (
    <div>
      <div className="container">
        <div className="relative">
          <h1>Location</h1>
        </div>

        <div className="demo">
          <div className="title">Bottom Sheet</div>
          <div
            className="button"
            onClick={() => setSelectDate(prev => ({ ...prev, open: true }))}
          >
            BS Select Date
          </div>

          <div
            className="button"
            onClick={() => setSelectTime(prev => ({ ...prev, open: true }))}
          >
            BS Select Time
          </div>

          <div
            className="button"
            onClick={() => setViewMapItem({ open: true })}
          >
            BS View Map
          </div>
        </div>

        <div className="demo">
          <div className="title">Tooltip</div>
          <Tooltip
            content="Top left"
            placement="top_left"
          >
            <div className="button">Top Left</div>
          </Tooltip>
          <Tooltip
            content="Top right"
            placement="top_right"
          >
            <div className="button">Top Right</div>
          </Tooltip>
          <Tooltip
            content="Top Center"
            placement="top_center"
          >
            <div className="button">Top Center</div>
          </Tooltip>
          <Tooltip
            content="Bottom left"
            placement="bottom_left"
          >
            <div className="button">Bottom Left</div>
          </Tooltip>
          <Tooltip
            content="Bottom right"
            placement="bottom_right"
          >
            <div className="button">Bottom Right</div>
          </Tooltip>
          <Tooltip
            content="Bottom center"
            placement="bottom_center"
          >
            <div className="button">Bottom Center</div>
          </Tooltip>
        </div>

        <SelectDateBottom
          open={selectDate.open}
          maxYear="2040"
          minYear="1980"
          onClose={() => setSelectDate(prev => ({ ...prev, open: false }))}
          onDateChange={date => {
            setSelectDate({
              date,
              open: false,
            });
          }}
          defaultDate={selectDate.date}
          type="MM/YYYY"
        />

        <SelectTimeBottom
          open={selectTime.open}
          onClose={() => setSelectTime(prev => ({ ...prev, open: false }))}
          onTimeChange={time => {
            setSelectTime({ time, open: false });
          }}
          defaultTime={selectTime.time}
        />

        <ViewMapBottom
          open={viewMapItem.open}
          onClose={() => setViewMapItem({ open: false })}
          branchData={{
            title: '72 Centec',
            caption: '72 Nguyen Thi Minh Khai, Vo Thi Sau',
            phone: '039-596-5416',
            fax: '416-250-3460',
            branchNo: '08048',
          }}
        />
      </div>
    </div>
  );
};

export default DemoComponent;
