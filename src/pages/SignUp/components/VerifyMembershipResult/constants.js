import { signUpVerifyUserLabels as labels } from '@common/constants/labels';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';

export const VerifyMembershipResultMessages = {
  [VerifyMembershipResultStatus.ALREADY_INDIVIDUAL]: {
    title: labels.youAreAlreadyCustomer,
    description: labels.managingLogging,
  },
  [VerifyMembershipResultStatus.ALREADY_CORPORATE]: {
    title: labels.youAreAlreadyBusiness,
    description: labels.managingBusiness,
  },
  [VerifyMembershipResultStatus.FAILED]: {
    title: labels.weSorry,
    description: labels.youCannotProceed,
  },
};

export const ButtonResultLabel = {
  [VerifyMembershipResultStatus.ALREADY_INDIVIDUAL]: labels.login,
  [VerifyMembershipResultStatus.ALREADY_CORPORATE]: labels.openSBank,
  [VerifyMembershipResultStatus.FAILED]: labels.startOver,
};
