export const SignUpStep = {
  THANK_VISIT_AGAIN: 'thankVisitAgain',
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

export const SignUpStepStatus = {
  REGISTERED_EMAIL: 1,
  EKYC_IN_PROGRESS: 2,
  EKYC_DONE: 3,
  INFO_APPROVED: 4,
  INFO_REVIEWING: 8,
  INFO_REJECTED: 9,
  SKIP_THANK_VISIT_AGAIN: 90,
};
