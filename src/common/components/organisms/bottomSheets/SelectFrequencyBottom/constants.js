import { DateInWeekValue, FrequencyType } from '@common/constants/bottomsheet';

export const frequencyTypeOptions = [
  {
    label: 'Once',
    value: FrequencyType.ONCE,
  },
  {
    label: 'Weekly',
    value: FrequencyType.WEEKLY,
  },
  {
    label: 'Bi-weekly',
    value: FrequencyType.BI_WEEKLY,
  },
  {
    label: 'Monthly',
    value: FrequencyType.MONTHLY,
  },
];

export const frequencyOnceOptions = [
  {
    label: '-',
    value: '0',
  },
];

export const frequencyWeekOptions = [
  {
    label: 'Mon',
    value: DateInWeekValue.MON,
  },
  {
    label: 'Tue',
    value: DateInWeekValue.TUE,
  },
  {
    label: 'Wed',
    value: DateInWeekValue.WED,
  },
  {
    label: 'Thu',
    value: DateInWeekValue.THU,
  },
  {
    label: 'Fri',
    value: DateInWeekValue.FRI,
  },
  {
    label: 'Sat',
    value: DateInWeekValue.SAT,
  },
  {
    label: 'Sun',
    value: DateInWeekValue.SUN,
  },
];

export const frequencyMonthlyOptions = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
];

export const frequencyValueByTypeOptions = {
  [FrequencyType.ONCE]: frequencyOnceOptions,
  [FrequencyType.WEEKLY]: frequencyWeekOptions,
  [FrequencyType.BI_WEEKLY]: frequencyWeekOptions,
  [FrequencyType.MONTHLY]: frequencyMonthlyOptions,
};
