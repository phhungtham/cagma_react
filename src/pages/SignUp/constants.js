export const SignUpStep = {
  VERIFY_ID: 'verifyId',
  VERIFY_USER_INFO: 'verifyUserInfo',
  VERIFY_MEMBERSHIP_RESULT: 'verifyMembershipResult',
  ENTER_EMAIL: 'enterEmail',
  VERIFY_IDENTITY_TERMS: 'verifyIdentityTerms',
  EKYC_IN_PROGRESS: 'ekycInProgress',
  ENTER_PERSONAL_DETAIL: 'enterPersonalDetail',
  EKYC_RESULT: 'ekycResult',
  CREATE_ID: 'createId',
  CREATE_PASSWORD: 'createPassword',
  MOTP_AGREE_TERMS: 'agreeTermsConditions',
  CREATE_PASSCODE: 'createPasscode',
  SIGN_UP_COMPLETE: 'signUpComplete',
  SET_UP_BIOMETRIC_AUTH: 'setUpBiometricAuth',
  SET_UP_ALERTS: 'setUpAlerts',
  OPEN_ACCOUNT_INSTRUCTION: 'openAccountInstruction',
};

export const VerifyMembershipResultStatus = {
  ALREADY_INDIVIDUAL: 'alreadyIndividual',
  ALREADY_CORPORATE: 'alreadyCorporate',
  FAILED: 'failed',
};

export const CustomerInfoVerifyType = {
  FIND_ID: 0,
  FIND_PW: 1,
  EKYC: 2,
};
