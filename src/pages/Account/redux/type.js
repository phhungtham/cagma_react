export const FeatureName = 'account';
export const ActionType = {
  GET_ACCOUNT_REQUEST_SUCCESS: `${FeatureName}/GET_ACCOUNT_REQUEST_SUCCESS`,
  GET_ACCOUNT_REQUEST_FAILED: `${FeatureName}/GET_ACCOUNT_REQUEST_FAILED`,
  GET_ACCOUNT_REQUEST: `${FeatureName}/GET_ACCOUNT_REQUEST`,
  CREATE_ACCOUNT_REQUEST: `${FeatureName}/CREATE_ACCOUNT_REQUEST`,
  CLEAN_UP: `${FeatureName}/CLEAN_UP`,
};

export const AccountURLs = {
  GET_ACCOUNTS: '/kh/iq/KHIQ001.pwkjson',
  // CREATE_ACCOUNTS: '/api/add_account'
};
