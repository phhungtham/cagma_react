export const VerifyIdentityType = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
};

export const verifyIdentityOptions = [
  {
    label: 'I have a valid Driver’s License or Passport',
    value: VerifyIdentityType.AVAILABLE,
  },
  {
    // eslint-disable-next-line quotes
    label: "I don't have or want to submit an ID",
    value: VerifyIdentityType.UNAVAILABLE,
  },
];
