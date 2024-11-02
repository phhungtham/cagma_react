import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';

export const VerifyMembershipResultMessages = {
  [VerifyMembershipResultStatus.ALREADY_INDIVIDUAL]: {
    title: '<p>You are already a</p><p>Shinhan customer!</p>',
    description: 'You can continue managing your banking by logging in',
  },
  [VerifyMembershipResultStatus.ALREADY_CORPORATE]: {
    title: '<p>You are already a</p><p>Shinhan business customer!</p>',
    description: 'You can continue managing your business banking through SBank',
  },
  [VerifyMembershipResultStatus.FAILED]: {
    title: 'We’re sorry',
    description: 'You cannot proceed with online registration',
  },
};

export const ButtonResultLabel = {
  [VerifyMembershipResultStatus.ALREADY_INDIVIDUAL]: 'Login',
  [VerifyMembershipResultStatus.ALREADY_CORPORATE]: 'Open SBank',
  [VerifyMembershipResultStatus.FAILED]: 'Start Over',
};
