export const termConditionConfig = {
  selectAllLabel: 'I fully understand and agree to all of the below',
  options: [
    {
      label: '[Mandatory] User Agreement',
      value: '1'
    },
    {
      label: '[Mandatory] Product Feature',
      value: '2'
    }
  ]
};

export const OPEN_ACCOUNT_STEP = {
  VIEW_TERMS: 'viewTerms',
  CUSTOMER_INFO: 'customerInfo',
  ENTER_ACCOUNT_INFORMATION: 'enterAccountInformation'
};

export const customerInfoFields = [
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'Date of Birth',
    value: 'dob'
  },
  {
    label: 'SIN',
    value: 'sin'
  },
  {
    label: 'E-mail Address',
    value: 'email'
  },
  {
    label: 'Phone Number',
    value: 'phone'
  },
  {
    label: 'Cell Number',
    value: 'cell'
  },
  {
    label: 'Occupation',
    value: 'occupation'
  },
];

export const customerInfo = {
  name: 'CUS-SNM-NM41000002250',
  dob: '01/09/1970',
  sin: '4100002250',
  email: '410000250@TEST.COM',
  phone: 'CUS-ADR-TELN0410002250',
  cell: 'CUS-ADR-TELN0410002250',
  occupation: 'MANAGEMENT',
};