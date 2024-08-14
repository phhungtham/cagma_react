export const initValues = {
  name: 'Jennifer',
  dob: '1987/11/17',
  sin: '123456789',
  email: 'Jennifer6756@gmail.com',
  call: '647-770-5364',
  callNumber: '647-770-5364',
  employment: ''
};

export const employmentOptions = [
  {
    label: 'Employed',
    value: '1'
  },
  {
    label: 'Self-Employed',
    value: '2'
  },
  {
    label: 'Retired',
    value: '3'
  },
  {
    label: 'Student',
    value: '4'
  },
  {
    label: 'House-wife',
    value: '5'
  },
  {
    label: 'Unemployed',
    value: '6'
  }
];

export const occupation1Options = [
  {
    label: 'Management',
    value: '1'
  },
  {
    label: 'Business, Finance, Admin',
    value: '2'
  },
  {
    label: 'Natural&Applied Sciences',
    value: '3'
  },
  {
    label: 'Health',
    value: '4'
  },
  {
    label: 'Social Science, Education, Government Service, Religion',
    value: '5'
  },
  {
    label: 'Art, Culture, Recreation, Sport',
    value: '6'
  },
  {
    label: 'Sales, Services',
    value: '7'
  },
  {
    label: 'Trade, Transportation',
    value: '8'
  },
  {
    label: 'Primary Industry',
    value: '9'
  },
  {
    label: 'Processing, Manufacutring, Utilities',
    value: '10'
  },
];

export const SELECT_TYPE = {
  EMPLOYMENT: 'employment',
  OCCUPATION1: 'occupation1'
};

export const initSelectBottom = {
  isShow: false,
  type: '',
  options: [],
  title: ''
};

export const selectBottomTypeMapField = {
  [SELECT_TYPE.EMPLOYMENT]: 'employment',
  [SELECT_TYPE.OCCUPATION1]: 'occupation1',
};