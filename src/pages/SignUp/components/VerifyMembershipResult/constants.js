import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';

export const VerifyMembershipResultMessages = {
  [VerifyMembershipResultStatus.INDIVIDUAL_SUCCESS]: {
    title: '<p>You are already a</p><p>Shinhan customer!</p>',
    description: 'You can continue managing your banking by logging in',
  },
  [VerifyMembershipResultStatus.CORPORATE_SUCCESS]: {
    title: '<p>You are already a</p><p>Shinhan business customer!</p>',
    description: 'You can continue managing your business banking through SBank',
  },
  [VerifyMembershipResultStatus.FAILED]: {
    title: 'We’re sorry',
    description: 'You cannot proceed with online registration',
  },
};

export const ButtonResultLabel = {
  [VerifyMembershipResultStatus.INDIVIDUAL_SUCCESS]: 'Login',
  [VerifyMembershipResultStatus.CORPORATE_SUCCESS]: 'Open SBank',
  [VerifyMembershipResultStatus.FAILED]: 'Start Over',
};
