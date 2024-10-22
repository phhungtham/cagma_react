import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const openCalendar = (cb, { selectDate, startDate, endDate }) => {
  if (AppCfg.ENV === 'development') return cb('19650703');
  return $h.exec(
    result => {
      const selectedDate = result?.data ? JSON.parse(result.data)?.selectDate : '';
      cb(selectedDate);
    },
    'GMCommon',
    'openCalendar',
    [
      {
        selectDate,
        startDate,
        endDate,
      },
    ]
  );
};
export default openCalendar;
